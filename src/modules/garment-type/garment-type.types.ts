export interface CreateGarmentTypeDto {
  categoryId: string;
  code?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateGarmentTypeDto {
  categoryId?: string;
  code?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface GarmentTypeFilters {
  categoryId?: string;
  search?: string;
  isActive?: boolean;
}