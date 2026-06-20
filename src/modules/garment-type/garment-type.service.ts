import { prisma } from "@/config/prisma";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@/utils/AppError";

import { UserRole } from "@prisma/client";

import { AuthUser } from "@/types/auth-request";

import {
  CreateGarmentTypeDto,
  UpdateGarmentTypeDto,
} from "./garment-type.types";

const getBusinessId = async (user: AuthUser) => {
  if (user.role !== UserRole.BUSINESS_OWNER) {
    throw new ForbiddenError("Only business owners can manage garment types");
  }

  const business = await prisma.business.findUnique({
    where: {
      ownerId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  return business.id;
};

export const createGarmentTypeService = async (
  user: AuthUser,
  data: CreateGarmentTypeDto,
) => {
  const businessId = await getBusinessId(user);

  const category = await prisma.garmentCategory.findFirst({
    where: {
      id: data.categoryId,
      businessId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new NotFoundError("Garment category not found");
  }

  const existingGarmentType = await prisma.garmentType.findFirst({
    where: {
      businessId,
      categoryId: data.categoryId,
      name: data.name,
      deletedAt: null,
    },
  });

  if (existingGarmentType) {
    throw new BadRequestError(
      "Garment type with this name already exists in the category",
    );
  }

  return prisma.garmentType.create({
    data: {
      businessId,
      categoryId: data.categoryId,
      code: data.code,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const getGarmentTypesService = async (
  query: {
    categoryId?: string;
    search?: string;
    isActive?: string | boolean;
  } = {},
) => {
  return prisma.garmentType.findMany({
    where: {
      deletedAt: null,

      ...(query.categoryId && {
        categoryId: query.categoryId,
      }),

      ...(query.search && {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      }),

      ...(query.isActive !== undefined && {
        isActive:
          typeof query.isActive === "string"
            ? query.isActive === "true"
            : query.isActive,
      }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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

export const getGarmentTypeService = async (id: string) => {
  const garmentType = await prisma.garmentType.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
    },
  });

  if (!garmentType) {
    throw new NotFoundError("Garment type not found");
  }

  return garmentType;
};

export const getActiveGarmentTypesService = async () => {
  return prisma.garmentType.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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

export const updateGarmentTypeService = async (
  id: string,
  user: AuthUser,
  data: UpdateGarmentTypeDto,
) => {
  const businessId = await getBusinessId(user);

  const garmentType = await prisma.garmentType.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!garmentType) {
    throw new NotFoundError("Garment type not found");
  }

  const categoryId = data.categoryId ?? garmentType.categoryId;
  const name = data.name ?? garmentType.name;

  if (data.categoryId) {
    const category = await prisma.garmentCategory.findFirst({
      where: {
        id: data.categoryId,
        businessId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new NotFoundError("Garment category not found");
    }
  }

  const existingGarmentType = await prisma.garmentType.findFirst({
    where: {
      businessId,
      categoryId,
      name,
      deletedAt: null,
      NOT: {
        id,
      },
    },
  });

  if (existingGarmentType) {
    throw new BadRequestError(
      "Garment type with this name already exists in the category",
    );
  }

  return prisma.garmentType.update({
    where: {
      id,
    },
    data,
  });
};

export const updateGarmentTypeStatusService = async (
  id: string,
  user: AuthUser,
  isActive: boolean,
) => {
  const businessId = await getBusinessId(user);

  const garmentType = await prisma.garmentType.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!garmentType) {
    throw new NotFoundError("Garment type not found");
  }

  return prisma.garmentType.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};
