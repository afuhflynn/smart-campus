import { JSONValue } from "next/dist/server/config-shared";

export interface SignUpTypes {
  name: string;
  email: string;
  password: string;
}

export interface LogInTypes {
  email: string;
  password: string;
}

export type Roles =
  | "platform_admin"
  | "school_admin"
  | "lecturer"
  | "finance"
  | "librarian"
  | "student"
  | "applicant";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Roles;
  phone: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

export type PricingTier = "basic" | "standard" | "premium";
export type SchoolType = "public" | "private" | "professional" | "vocational";

export interface School {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  region: string;
  country: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  website?: string;
  pricing_tier: PricingTier;
  registration_fields: JSONValue;
  authorization_number: string;
  issuing_authority: string;
  authorization_date: Date;
  school_type: SchoolType;
  created_at: Date;
  updated_at: Date;
  banner?: string;
  abbriviation?: string;
}
export interface LoginRespond {
  success: boolean;
  user: User;
}

export interface ProfileRespond {
  success: boolean;
  user: User;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface ListSchoolsPaginationParams extends PaginationParams {
  city?: string;
}

export interface ResponsePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
