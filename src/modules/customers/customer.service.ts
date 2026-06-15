// src/modules/customers/customer.service.ts

import { prisma } from "@/config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCustomerDto, UpdateCustomerDto, CustomerQuery } from "./customer.types";

export const createCustomer = async (payload: CreateCustomerDto) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      phone_dialCode: {
        phone: payload.phone,
        dialCode: payload.dialCode || "+91",
      },
    },
  });

  if (existingCustomer) {
    const existingLink = await prisma.customerStore.findUnique({
      where: {
        customerId_storeId: {
          customerId: existingCustomer.id,
          storeId: payload.storeId,
        },
      },
    });

    if (!existingLink) {
      await prisma.customerStore.create({
        data: {
          customerId: existingCustomer.id,
          storeId: payload.storeId,
        },
      });
    }

    return existingCustomer;
  }

  const customer = await prisma.customer.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,

      phone: payload.phone,
      dialCode: payload.dialCode || "+91",

      email: payload.email,
      notes: payload.notes,

      stores: {
        create: {
          storeId: payload.storeId,
        },
      },
    },
  });

  return customer;
};

export const getCustomerById = async (id: string, storeId: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: true,
      stores: {
        where: { storeId },
      },
    },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  if (customer.stores.length === 0) {
    throw new AppError("Customer not associated with this store", 404);
  }

  return customer;
};

export const getCustomers = async (storeId: string, query: CustomerQuery) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    stores: {
      some: { storeId },
    },
    ...(query.search
      ? {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" as const } },
            { lastName: { contains: query.search, mode: "insensitive" as const } },
            { phone: { contains: query.search } },
            { email: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data: customers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateCustomer = async (
  id: string,
  storeId: string,
  payload: UpdateCustomerDto
) => {
  const existingLink = await prisma.customerStore.findUnique({
    where: {
      customerId_storeId: {
        customerId: id,
        storeId,
      },
    },
  });

  if (!existingLink) {
    throw new AppError("Customer not found for this store", 404);
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      notes: payload.notes,
      isActive: payload.isActive,
    },
  });

  return customer;
};

export const deleteCustomer = async (id: string, storeId: string) => {
  const existingLink = await prisma.customerStore.findUnique({
    where: {
      customerId_storeId: {
        customerId: id,
        storeId,
      },
    },
  });

  if (!existingLink) {
    throw new AppError("Customer not found for this store", 404);
  }

  // Unlink from this store only — preserve customer record for other stores
  await prisma.customerStore.delete({
    where: {
      customerId_storeId: {
        customerId: id,
        storeId,
      },
    },
  });

  return { success: true };
};