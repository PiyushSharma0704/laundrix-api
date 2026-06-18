// src/modules/stores/store.service.ts
import { prisma } from "@/config/prisma";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/utils/AppError";

import { UserRole } from "@prisma/client";

import { AuthUser } from "@/types/auth-request";
import { CreateStoreDto, UpdateStoreDto } from "./store.types";

export const createStore = async (user: AuthUser, data: CreateStoreDto) => {
  if (
    user.role !== UserRole.PLATFORM_SUPER_ADMIN &&
    user.role !== UserRole.BUSINESS_OWNER
  ) {
    throw new ForbiddenError("You cannot create stores");
  }

  const business = await prisma.business.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  try {
    return await prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        businessId: business.id,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new BadRequestError("Store slug already exists");
    }

    throw err;
  }
};

export const getStoreById = async (storeId: string, user: AuthUser) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,

      OR:
        user.role === UserRole.PLATFORM_SUPER_ADMIN
          ? undefined
          : [
              {
                business: {
                  ownerId: user.id,
                },
              },
              {
                employees: {
                  some: {
                    userId: user.id,
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

export const getMyStores = async (user: AuthUser) => {
  if (user.role === UserRole.PLATFORM_SUPER_ADMIN) {
    return prisma.store.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return prisma.store.findMany({
    where: {
      OR: [
        {
          business: {
            ownerId: user.id,
          },
        },
        {
          employees: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateStore = async (
  storeId: string,
  user: AuthUser,
  payload: UpdateStoreDto,
) => {
  await getStoreById(storeId, user);

  return prisma.store.update({
    where: {
      id: storeId,
    },

    data: {
      name: payload.name,
      slug: payload.slug,
    },
  });
};

export const deleteStore = async (storeId: string, user: AuthUser) => {
  await getStoreById(storeId, user);

  await prisma.store.delete({
    where: {
      id: storeId,
    },
  });

  return {
    success: true,
  };
};
