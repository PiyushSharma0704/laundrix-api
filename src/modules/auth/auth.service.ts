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
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "@/utils/AppError";

export const register = async (data: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.OWNER,
    },
  });

  const { passwordHash: _, refreshToken: __, ...safeUser } = user;

  return { user: safeUser };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new ForbiddenError("Account is deactivated");
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { passwordHash, refreshToken: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { passwordHash, refreshToken, ...safeUser } = user;

  return safeUser;
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { success: true };
};

export const refresh = async (refreshToken: string) => {
  let payload: { userId: string };

  try {
    payload = verifyRefreshToken(refreshToken) as { userId: string };
  } catch {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (!user.isActive) {
    throw new ForbiddenError("Account is deactivated");
  }

  const accessToken = signAccessToken(user.id);
  const newRefreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new NotFoundError("User not found");

  const isValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isValid) throw new BadRequestError("Current password is incorrect");

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, refreshToken: null },
  });

  return { success: true };
};
