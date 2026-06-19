// src/modules/businesses/business.service.ts
import { prisma } from "../../config/prisma";
import { BadRequestError, NotFoundError } from "../../utils/AppError";
import { CreateBusinessDto } from "./business.types";

export const createBusiness = async (
  ownerId: string,
  data: CreateBusinessDto,
) => {
  const existingBusiness = await prisma.business.findUnique({
    where: {
      ownerId,
    },
  });

  if (existingBusiness) {
    throw new BadRequestError("User already owns a business");
  }

  try {
    return await prisma.business.create({
  data: {
    name: data.name,
    slug: data.slug,
    currencyCode: data.currencyCode ?? "INR",
    gstNumber: data.gstNumber,
    ownerId,
  },
});
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new BadRequestError("Business slug already exists");
    }

    throw err;
  }
};

export const getMyBusiness = async (userId: string) => {
  const business = await prisma.business.findUnique({
    where: {
      ownerId: userId,
    },
    include: {
      _count: {
        select: {
          stores: true,
        },
      },
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  return business;
};

export const getBusinessById = async (businessId: string, userId: string) => {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId: userId,
    },
    include: {
      stores: true,
    },
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  return business;
};
