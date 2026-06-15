// src/modules/stores/store.service.ts
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import { prisma } from "../../config/prisma";
import { CreateStoreDto } from "./store.types";

export const createStore = async (ownerId: string, data: CreateStoreDto) => {
  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId,
      },
    });

    return store;
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
      OR: [{ ownerId: userId }, { users: { some: { id: userId } } }],
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
      OR: [{ ownerId: userId }, { users: { some: { id: userId } } }],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
