import { GenericResponseType } from "./common";
import { E_SkincareConcern } from "./SkincareConcern.ts";
import { E_Currency } from "./Currency.ts";

export type Product = {
  id: string;
  title: string;
  thumbnail: string;
  additionalImages: string[];
  price: number;
  currency: string;
  averageRating: number;
  description:string;
  howToUse: string;
  ingredientBenefits: string;
  fullIngredientsList: string;
  skincareConcerns: string[];
  sold: number;
  createdAt: string
}

export class GetProductRequestParam {
  search?: string;
  page?: number = 1;
  perPage?: number = 10;
  order?: string;
  skincareConcerns?: string[];
}


export enum ProductStatus {
  DRAF = "DRAF",
  ACTIVE = "ACTIVE",
  ACHIVE = "ARCHIVE",
}

export class GetProductsRequestParam {
  search?: string;
  categories?: string[];
  status?: ProductStatus[];
  page?: number = 1;
  perPage?: number = 10;
  order?: string;
}

export type GetProductsResponse = GenericResponseType<Product>;


export type ReqCreateProduct = {
  thumbnail: string;
  additionalImages: string[];
  title: string;
  price: number;
  totalQuantity: number;
  currency: string;
  description: string;
  howToUse: string;
  ingredientBenefits: string;
  fullIngredientsList: string;
  skincareConcerns: string[];
}

export type ResCreateProduct = {
  id: string;
  title: string;
  thumbnail: string;
  additionalImages: string[];
  price: number;
  currency: E_Currency;
  description: string;
  howToUse: string;
  ingredientBenefits: string;
  fullIngredientsList: string;
  skincareConcerns: E_SkincareConcern[];
  totalQuantity: number;
  createdAt: string;

};

