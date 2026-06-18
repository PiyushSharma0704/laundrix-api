// src/middleware/access-scope.ts

import { prisma } from "@/config/prisma";
import { UserRole } from "@prisma/client";

export const getAccessibleStoreIds = async (
  userId: string,
  role: UserRole
): Promise<string[] | null> => {
  if (
    role === UserRole.PLATFORM_SUPER_ADMIN ||
    role === UserRole.PLATFORM_ADMIN ||
    role === UserRole.PLATFORM_SUPPORT
  ) {
    return null;
  }

  if (role === UserRole.BUSINESS_OWNER) {
    const stores = await prisma.store.findMany({
      where: {
        business: {
          ownerId: userId,
        },
      },
      select: {
        id: true,
      },
    });

    return stores.map((store) => store.id);
  }

  const assignments = await prisma.storeEmployee.findMany({
    where: {
      userId,
    },
    select: {
      storeId: true,
    },
  });

  return assignments.map((a) => a.storeId);
};