import { prisma } from "@/config/prisma";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@/utils/AppError";

import { UserRole } from "@prisma/client";

import { AuthUser } from "@/types/auth-request";

import {
  CreateGarmentCategoryDto,
  UpdateGarmentCategoryDto,
} from "./garment-category.types";

const getBusinessId = async (user: AuthUser) => {
  if (user.role !== UserRole.BUSINESS_OWNER) {
    throw new ForbiddenError(
      "Only business owners can manage garment categories",
    );
  }

  const business = await prisma.business.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  return business.id;
};

export const createCategory = async (
  user: AuthUser,
  payload: CreateGarmentCategoryDto,
) => {
  const businessId = await getBusinessId(user);

  const existing = await prisma.garmentCategory.findFirst({
    where: {
      businessId,
      name: {
        equals: payload.name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    throw new BadRequestError("Garment category already exists");
  }

  return prisma.garmentCategory.create({
    data: {
      businessId,
      name: payload.name.trim(),
      description: payload.description,
      sortOrder: payload.sortOrder ?? 0,
    },
  });
};

export const getCategories = async (user: AuthUser) => {
  const businessId = await getBusinessId(user);

  return prisma.garmentCategory.findMany({
    where: {
      businessId,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
};

export const getActiveCategories = async (user: AuthUser) => {
  const businessId = await getBusinessId(user);

  return prisma.garmentCategory.findMany({
    where: {
      businessId,
      isActive: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
};

export const getCategoryById = async (categoryId: string, user: AuthUser) => {
  const businessId = await getBusinessId(user);

  const category = await prisma.garmentCategory.findFirst({
    where: {
      id: categoryId,
      businessId,
    },
  });

  if (!category) {
    throw new NotFoundError("Garment category not found");
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  user: AuthUser,
  payload: UpdateGarmentCategoryDto,
) => {
  const businessId = await getBusinessId(user);

  await getCategoryById(categoryId, user);

  if (payload.name) {
    const existing = await prisma.garmentCategory.findFirst({
      where: {
        businessId,
        id: {
          not: categoryId,
        },
        name: {
          equals: payload.name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      throw new BadRequestError("Garment category already exists");
    }
  }

  return prisma.garmentCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description,
      sortOrder: payload.sortOrder,
    },
  });
};

export const updateCategoryStatus = async (
  categoryId: string,
  user: AuthUser,
  isActive: boolean,
) => {
  await getCategoryById(categoryId, user);

  return prisma.garmentCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      isActive,
    },
  });
};
