import { PricingUnit } from "@prisma/client";

export interface CreateServiceCatalogItemDto {
  serviceTypeId: string;

  garmentTypeId: string;

  code?: string;

  description?: string;

  pricingUnit: PricingUnit;

  basePrice: number;

  minimumPrice?: number;

  gstRate?: number;
}

export interface UpdateServiceCatalogItemDto {
  serviceTypeId?: string;

  garmentTypeId?: string;

  code?: string;

  description?: string;

  pricingUnit?: PricingUnit;

  basePrice?: number;

  minimumPrice?: number;

  gstRate?: number;
}

export interface UpdateServiceCatalogItemStatusDto {
  isActive: boolean;
}

export interface ServiceCatalogItemFilters {
  serviceTypeId?: string;

  garmentTypeId?: string;

  pricingUnit?: PricingUnit;

  isActive?: boolean;

  search?: string;
}