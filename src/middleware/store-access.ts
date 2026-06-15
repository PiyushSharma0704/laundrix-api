import { prisma } from "@/config/prisma";
import { ForbiddenError } from "@/utils/AppError";

export const validateStoreAccess = async (
  userId: string,
  storeId: string,
) => {
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
    select: {
      id: true,
    },
  });

  if (!store) {
    throw new ForbiddenError(
      "You do not have access to this store",
    );
  }

  return true;
};