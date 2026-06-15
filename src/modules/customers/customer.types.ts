// src/modules/customers/customer.types.ts
export interface CreateCustomerDto {
  firstName: string;
  lastName?: string;

  phone: string;
  dialCode?: string;

  email?: string;
  notes?: string;

  storeId: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;

  email?: string;
  notes?: string;

  isActive?: boolean;
}

export interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
}