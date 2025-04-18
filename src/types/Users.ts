import { GenericResponseType } from "./common";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum RoleType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type User = {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email: string;
  location?: string;
  dob?: string;
  gender: Gender;
  role: RoleType;
  createdAt: string;
};

export class GetUsersRequestParam {
  search?: string;
  genders?: Gender[];
  roleTypes?: RoleType[];
  page?: number = 1;
  perPage?: number = 10;
  order?: string;
}

export type GetUsersResponse = GenericResponseType<User>;
export type UserInfo = Omit<User, "id" | "createdAt">;
export type UserFormData = UserInfo & {
  id?: string;
  isCreate: boolean;
};
