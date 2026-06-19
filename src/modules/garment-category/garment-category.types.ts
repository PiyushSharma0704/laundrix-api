export interface CreateGarmentCategoryDto {
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateGarmentCategoryDto {
  name?: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateGarmentCategoryStatusDto {
  isActive: boolean;
}