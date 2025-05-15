import { GenericResponseType } from "./common";

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
}

export type GetProductsResponse = GenericResponseType<Product>;
