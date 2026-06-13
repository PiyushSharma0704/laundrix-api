import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { UserRole } from "@prisma/client";
import { RegisterDto } from "./auth.types";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export const register = async (data: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const store = await prisma.store.create({
    data: {
      name: data.storeName,
      slug: data.storeSlug,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.OWNER,
      storeId: store.id,
    },
  });

  const { passwordHash: _, ...safeUser } = user;
  return {
    user: safeUser,
    store,
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { passwordHash, refreshToken: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
