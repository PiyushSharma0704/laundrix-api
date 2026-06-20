import { prisma } from "@/config/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "@/utils/AppError";

import { AuthUser } from "@/types/auth-request";

import {
  CreateServiceCatalogItemDto,
  UpdateServiceCatalogItemDto,
} from "./service-catalog-item.types";

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

export const createServiceCatalogItem = async (
  user: AuthUser,
  data: CreateServiceCatalogItemDto,
) => {
  const businessId = await getBusinessId(user.id);

  const serviceType = await prisma.serviceType.findFirst({
    where: {
      id: data.serviceTypeId,
      businessId,
      deletedAt: null,
    },
  });

  if (!serviceType) {
    throw new NotFoundError("Service type not found");
  }

  const garmentType = await prisma.garmentType.findFirst({
    where: {
      id: data.garmentTypeId,
      businessId,
      deletedAt: null,
    },
  });

  if (!garmentType) {
    throw new NotFoundError("Garment type not found");
  }

  const existingItem =
    await prisma.serviceCatalogItem.findFirst({
      where: {
        businessId,
        serviceTypeId: data.serviceTypeId,
        garmentTypeId: data.garmentTypeId,
        deletedAt: null,
      },
    });

  if (existingItem) {
    throw new BadRequestError(
      "Catalog item already exists for this service type and garment type",
    );
  }

  return prisma.serviceCatalogItem.create({
    data: {
      businessId,
      serviceTypeId: data.serviceTypeId,
      garmentTypeId: data.garmentTypeId,
      code: data.code,
      description: data.description,
      pricingUnit: data.pricingUnit,
      basePrice: data.basePrice,
      minimumPrice: data.minimumPrice,
      gstRate: data.gstRate,
    },
    include: {
      serviceType: true,
      garmentType: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const getServiceCatalogItems = async (query: {
  serviceTypeId?: string;
  garmentTypeId?: string;
  pricingUnit?: string;
  isActive?: string | boolean;
  search?: string;
}) => {
  return prisma.serviceCatalogItem.findMany({
    where: {
      deletedAt: null,

      ...(query.serviceTypeId && {
        serviceTypeId: query.serviceTypeId,
      }),

      ...(query.garmentTypeId && {
        garmentTypeId: query.garmentTypeId,
      }),

      ...(query.pricingUnit && {
        pricingUnit: query.pricingUnit as any,
      }),

      ...(query.isActive !== undefined && {
        isActive:
          typeof query.isActive === "string"
            ? query.isActive === "true"
            : query.isActive,
      }),

      ...(query.search && {
        OR: [
          {
            code: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    include: {
      serviceType: true,
      garmentType: {
        include: {
          category: true,
        },
      },
    },

    orderBy: [
      {
        serviceType: {
          name: "asc",
        },
      },
      {
        garmentType: {
          name: "asc",
        },
      },
    ],
  });
};

export const getServiceCatalogItem = async (id: string) => {
  const item = await prisma.serviceCatalogItem.findFirst({
    where: {
      id,
      deletedAt: null,
    },

    include: {
      serviceType: true,
      garmentType: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!item) {
    throw new NotFoundError("Service catalog item not found");
  }

  return item;
};

export const getActiveServiceCatalogItems = async () => {
  return prisma.serviceCatalogItem.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },

    include: {
      serviceType: true,
      garmentType: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const updateServiceCatalogItem = async (
  id: string,
  user: AuthUser,
  data: UpdateServiceCatalogItemDto,
) => {
  const businessId = await getBusinessId(user.id);

  const item = await prisma.serviceCatalogItem.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!item) {
    throw new NotFoundError("Service catalog item not found");
  }

  const serviceTypeId =
    data.serviceTypeId ?? item.serviceTypeId;

  const garmentTypeId =
    data.garmentTypeId ?? item.garmentTypeId;

  const existingItem =
    await prisma.serviceCatalogItem.findFirst({
      where: {
        businessId,
        serviceTypeId,
        garmentTypeId,
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

  if (existingItem) {
    throw new BadRequestError(
      "Catalog item already exists for this service type and garment type",
    );
  }

  return prisma.serviceCatalogItem.update({
    where: {
      id,
    },
    data,
    include: {
      serviceType: true,
      garmentType: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const updateServiceCatalogItemStatus = async (
  id: string,
  user: AuthUser,
  isActive: boolean,
) => {
  const businessId = await getBusinessId(user.id);

  const item = await prisma.serviceCatalogItem.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null,
    },
  });

  if (!item) {
    throw new NotFoundError("Service catalog item not found");
  }

  return prisma.serviceCatalogItem.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};