// src/modules/customers/address.service.ts
import { prisma } from "../../config/prisma";

import { CreateAddressDto, UpdateAddressDto } from "./address.types";

import { NotFoundError } from "../../utils/AppError";

export const createAddress = async (
  customerId: string,
  payload: CreateAddressDto,
) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  return prisma.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        customerId,
        ...payload,
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
  await getAddressById(customerId, addressId);

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  return {
    deleted: true,
  };
};
