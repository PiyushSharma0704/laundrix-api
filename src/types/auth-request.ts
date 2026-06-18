// types/auth-request.ts

import { Request } from "express";
import { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  role: UserRole;

  business?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}