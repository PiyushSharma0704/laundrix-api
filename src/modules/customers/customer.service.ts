// src/modules/customers/customer.service.ts

import { prisma } from "@/config/prisma";
import { AppError } from "../../utils/AppError";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQuery,
} from "./customer.types";
import {
  ensureCustomerAccessible,
  generateCustomerCode,
} from "@/utils/helpers";
import { AuthUser } from "@/types/auth-request";
import { getAccessibleStoreIds } from "@/middleware/access-scope";

export const createCustomer = async (
  user: AuthUser,
  payload: CreateCustomerDto,
) => {
  const accessibleStoreIds = await getAccessibleStoreIds(user.id, user.role);

  if (accessibleStoreIds && !accessibleStoreIds.includes(payload.storeId)) {
    throw new AppError("You cannot create customers in this store", 403);
  }

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
      const customerCode = await generateCustomerCode(payload.storeId);

      await prisma.customerStore.create({
        data: {
          customerId: existingCustomer.id,
          storeId: payload.storeId,
          customerCode,
        },
      });
    }

    return existingCustomer;
  }
  const customerCode = await generateCustomerCode(payload.storeId);

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
          customerCode,
        },
      },
    },
    include: {
      stores: true,
    },
  });

  return customer;
};

export const getCustomerById = async (customerId: string, user: AuthUser) => {
  const storeIds = await getAccessibleStoreIds(user.id, user.role);

  await ensureCustomerAccessible(customerId, storeIds);

  return prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      addresses: true,
      stores: true,
    },
  });
};

export const getCustomers = async (user: AuthUser, query: CustomerQuery) => {
  const storeIds = await getAccessibleStoreIds(user.id, user.role);

  const page = query.page || 1;
  const limit = query.limit || 20;

  const where = {
    isActive: true,

    ...(storeIds
      ? {
          stores: {
            some: {
              storeId: {
                in: storeIds,
              },
            },
          },
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.count({
      where,
    }),
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
  customerId: string,
  user: AuthUser,
  payload: UpdateCustomerDto,
) => {
  const storeIds = await getAccessibleStoreIds(user.id, user.role);

  await ensureCustomerAccessible(customerId, storeIds);

  return prisma.customer.update({
    where: {
      id: customerId,
    },
    data: payload,
  });
};

export const deleteCustomer = async (customerId: string, user: AuthUser) => {
  const storeIds = await getAccessibleStoreIds(user.id, user.role);

  await ensureCustomerAccessible(customerId, storeIds);

  await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      isActive: false,
    },
  });

  return {
    success: true,
  };
};
