// src/modules/stores/store.service.ts
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import { prisma } from "../../config/prisma";
import { CreateStoreDto } from "./store.types";

export const createStore = async (userId: string, data: CreateStoreDto) => {
  const business = await prisma.business.findFirst({
    where: {
      id: data.businessId,
      ownerId: userId,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  try {
    return prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        businessId: data.businessId,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new BadRequestError("Store slug already exists");
    }

    throw err;
  }
};

export const getStoreById = async (storeId: string, userId: string) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,

      OR: [
        {
          business: {
            ownerId: userId,
          },
        },
        {
          employees: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      business: true,
    },
  });

  if (!store) {
    throw new NotFoundError("Store not found");
  }

  return store;
};

export const getMyStores = async (userId: string) => {
  return prisma.store.findMany({
    where: {
      OR: [
        {
          business: {
            ownerId: userId,
          },
        },
        {
          employees: {
            some: {
              userId,
            },
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      businessId: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
