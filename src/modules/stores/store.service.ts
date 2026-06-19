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
  const business = await prisma.business.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  const existingStore = await prisma.store.findFirst({
    where: {
      businessId: business.id,
      OR: [
        {
          slug: data.slug,
        },
        {
          code: data.code,
        },
      ],
    },
  });

  if (existingStore) {
    throw new BadRequestError("Store code or slug already exists");
  }

  return prisma.store.create({
    data: {
      businessId: business.id,

      name: data.name,
      slug: data.slug,
      code: data.code,

      phone: data.phone,
      email: data.email,
      address: data.address,
    },
  });
};

export const getStoreById = async (storeId: string, user: AuthUser) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      deletedAt: null,
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
      deletedAt: null,
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
      ...(payload.name && {
        name: payload.name,
      }),

      ...(payload.slug && {
        slug: payload.slug,
      }),

      ...(payload.code && {
        code: payload.code,
      }),

      ...(payload.phone !== undefined && {
        phone: payload.phone,
      }),

      ...(payload.email !== undefined && {
        email: payload.email,
      }),

      ...(payload.address !== undefined && {
        address: payload.address,
      }),

      ...(payload.isActive !== undefined && {
        isActive: payload.isActive,
      }),
    },
  });
};

export const deleteStore = async (storeId: string, user: AuthUser) => {
  await getStoreById(storeId, user);

  await prisma.store.update({
    where: {
      id: storeId,
    },

    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return {
    success: true,
  };
};
