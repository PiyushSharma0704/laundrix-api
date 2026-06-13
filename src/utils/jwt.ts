import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (
  payload: object
) => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (
  payload: object
) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const signAccessToken = (
  userId: string
) => {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

export const signRefreshToken = (
  userId: string
) => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (
token: string
) => {
return jwt.verify(
token,
env.JWT_ACCESS_SECRET
);
};

export const verifyRefreshToken = (
token: string
) => {
return jwt.verify(
token,
env.JWT_REFRESH_SECRET
);
};
