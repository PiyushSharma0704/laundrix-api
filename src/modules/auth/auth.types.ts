// auth.types.ts

export interface RegisterDto {
  storeName: string;
  storeSlug: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}