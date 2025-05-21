import { GenericResponseType } from "./common";

export type ShippingAddress = {
  id: string;
  title:string;
  userId: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
}

export type ReqShippingAddress = {
  title:string;
  phone: string;
  address: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export class GetShippingAddresRequestParam {
  search?: string;
  page?: number = 1;
  perPage?: number = 10;
  order?: string;
}

export type GetShippingAddressResponse = GenericResponseType<ShippingAddress>;
