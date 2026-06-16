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
