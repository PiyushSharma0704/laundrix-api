// src/modules/customers/address.service.ts
import { prisma } from "../../config/prisma";

import { CreateAddressDto, UpdateAddressDto } from "./address.types";

import { NotFoundError } from "../../utils/AppError";
import { ensureCustomerExists } from "@/utils/helpers";

export const createAddress = async (
  customerId: string,
  payload: CreateAddressDto,
) => {
  await ensureCustomerExists(customerId);

  return prisma.$transaction(async (tx) => {
    const existingCount = await tx.address.count({
      where: {
        customerId,
      },
    });

    const isDefault = existingCount === 0 ? true : (payload.isDefault ?? false);

    if (isDefault) {
      await tx.address.updateMany({
        where: {
          customerId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return tx.address.create({
      data: {
        customerId,
        ...payload,
        isDefault,
      },
    });
  });
};

export const getAddresses = async (customerId: string) => {
  return prisma.address.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAddressById = async (customerId: string, addressId: string) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      customerId,
    },
  });

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  return address;
};

export const updateAddress = async (
  customerId: string,
  addressId: string,
  payload: UpdateAddressDto,
) => {
  await getAddressById(customerId, addressId);

  if (payload.isDefault) {
    await prisma.address.updateMany({
      where: {
        customerId,
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: payload,
  });
};

export const deleteAddress = async (customerId: string, addressId: string) => {
  const address = await getAddressById(customerId, addressId);

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({
      where: {
        id: addressId,
      },
    });

    if (address.isDefault) {
      const nextAddress = await tx.address.findFirst({
        where: {
          customerId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (nextAddress) {
        await tx.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }
  });

  return {
    deleted: true,
  };
};
