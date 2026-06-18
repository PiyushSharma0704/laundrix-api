// src/utils/helpers.ts
import { prisma } from "@/config/prisma";
import { NotFoundError } from "@/utils/AppError";

export const ensureCustomerBelongsToStore = async (
  customerId: string,
  storeId: string,
) => {
  const customerStore = await prisma.customerStore.findUnique({
    where: {
      customerId_storeId: {
        customerId,
        storeId,
      },
    },
  });

  if (!customerStore) {
    throw new NotFoundError("Customer not found for this store");
  }

  return customerStore;
};

export const ensureCustomerExists = async (
  customerId: string
) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  return customer;
};

export const ensureCustomerAccessible = async (
  customerId: string,
  storeIds: string[] | null
) => {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,

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
    },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  return customer;
};

export const generateCustomerCode = async (storeId: string) => {
  const count = await prisma.customerStore.count({
    where: {
      storeId,
    },
  });

  return `CUS-${String(count + 1).padStart(6, "0")}`;
};