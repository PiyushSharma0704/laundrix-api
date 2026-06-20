import { PricingUnit } from "@prisma/client";

export interface CreateServiceTypeDto {
  code?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateServiceTypeDto {
  code?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateServiceTypeStatusDto {
  isActive: boolean;
}

export interface ServiceTypeFilters {
  search?: string;
  isActive?: boolean;
}

export interface ServiceCatalogItem {
  id: string;
  businessId: string;
  serviceTypeId: string;
  garmentTypeId: string;
  code: string | null;
  description: string | null;
  pricingUnit: PricingUnit;
  basePrice: number;
  minimumPrice: number | null;
  gstRate: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}