// auth.service.ts
import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { UserRole } from "@prisma/client";
import { RegisterDto } from "./auth.types";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export const register = async (data: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  const existingStore = await prisma.store.findUnique({
    where: {
      slug: data.storeSlug,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  if (existingStore) {
    throw new Error("Store slug already exists");
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

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { passwordHash, refreshToken, ...safeUser } = user;

  return safeUser;
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
    },
  });

  return {
    success: true,
  };
};

export const refresh = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken) as {
    userId: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = signAccessToken(user.id);

  return {
    accessToken,
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isValid) throw new Error("Current password is incorrect");

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true };
};
