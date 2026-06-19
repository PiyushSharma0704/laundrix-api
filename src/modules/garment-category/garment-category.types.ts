export interface CreateGarmentCategoryDto {
  code?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateGarmentCategoryDto {
  code?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateGarmentCategoryStatusDto {
  isActive: boolean;
}