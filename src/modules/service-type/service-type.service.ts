import { prisma } from "@/config/prisma";
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import { AuthUser } from "@/types/auth-request";
import {
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
} from "./service-type.types";

const getBusinessId = async (userId: string) => {
  const business = await prisma.business.findUnique({
    where: {
      ownerId: userId,
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

export const createServiceType = async (
  user: AuthUser,
  data: CreateServiceTypeDto,
) => {
  const businessId = await getBusinessId(user.id);

  const existingServiceType = await prisma.serviceType.findFirst({
    where: {
      businessId,
      name: data.name,
      deletedAt: null,
    },
  });

  if (existingServiceType) {
    throw new BadRequestError("Service type with this name already exists");
  }

  return prisma.serviceType.create({
    data: {
      businessId,
      code: data.code,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const getServiceTypes = async (query: {
  search?: string;
  isActive?: string | boolean;
}) => {
  return prisma.serviceType.findMany({
    where: {
      deletedAt: null,

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

export const getServiceType = async (id: string) => {
  const serviceType = await prisma.serviceType.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!serviceType) {
    throw new NotFoundError("Service type not found");
  }

  return serviceType;
};

export const getActiveServiceTypes = async () => {
  return prisma.serviceType.findMany({
    where: {
      isActive: true,
      deletedAt: null,
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

export const updateServiceType = async (
  id: string,
  user: AuthUser,
  data: UpdateServiceTypeDto,
) => {
  const businessId = await getBusinessId(user.id);

  const serviceType = await prisma.serviceType.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!serviceType) {
    throw new NotFoundError("Service type not found");
  }

  if (data.name) {
    const existingServiceType = await prisma.serviceType.findFirst({
      where: {
        businessId,
        name: data.name,
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

    if (existingServiceType) {
      throw new BadRequestError("Service type with this name already exists");
    }
  }

  return prisma.serviceType.update({
    where: {
      id,
    },
    data,
  });
};

export const updateServiceTypeStatus = async (
  id: string,
  user: AuthUser,
  isActive: boolean,
) => {
  const businessId = await getBusinessId(user.id);

  const serviceType = await prisma.serviceType.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!serviceType) {
    throw new NotFoundError("Service type not found");
  }

  return prisma.serviceType.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};
