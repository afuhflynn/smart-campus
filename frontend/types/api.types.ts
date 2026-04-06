import type { JSONValue } from "next/dist/server/config-shared";

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
  abbreviation?: string;
}

export interface LoginRespond {
  success: boolean;
  user: User;
  school: School;
}

export interface ProfileRespond {
  success: boolean;
  user: User;
  school: School;
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

export type SchoolTypeEnum =
  | "public"
  | "private"
  | "professional"
  | "vocational";

export type CameroonRegion =
  | "Adamaoua"
  | "Centre"
  | "East"
  | "Far North"
  | "Littoral"
  | "North"
  | "North West"
  | "South"
  | "South West"
  | "West";

export interface SchoolRegisterPayload {
  name: string;
  slug: string;
  abbreviation?: string;
  school_type: SchoolTypeEnum;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  authorization_number: string;
  issuing_authority: string;
  authorization_date: string;
}

export interface SlugCheckResponse {
  available: boolean;
  slug: string;
  success: boolean;
}

export interface SchoolRegisterResponse {
  success: boolean;
  message: string;
  school: School;
}

export interface ApplicationField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "select"
    | "number"
    | "textarea"
    | "date"
    | "phone"
    | "checkbox";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ApplicationPayload {
  applicant_user_id: number | null;
  applicant_email: string;
  applicant_name: string;
  payload: Record<string, unknown>;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
}

export interface ApplicationSubmitData {
  school_id: number;
  applicant_user_id: number | null;
  applicant_email: string;
  applicant_name: string;
  payload: Record<string, unknown>;
}

export type ApplicationStatus = "pending" | "approved" | "rejected" | "all";

export interface Application {
  id: number;
  school_id: number;
  applicant_user_id: number | null;
  applicant_email: string;
  applicant_name: string;
  applicant_phone?: string;
  payload: Record<string, unknown>;
  status: ApplicationStatus;
  notes?: string;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApplicationListParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: ApplicationStatus;
}

export interface ApplicationListResponse {
  applications: Application[];
  school: School;
  success: boolean;
  pagination: ResponsePagination;
}

export interface StudentRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  student_number?: string;
  programme: string;
  level: string;
  academic_year: string;
  school_id: number;
}

export interface StudentRegisterResponse {
  success: boolean;
  message: string;
  user: User;
  temporary_password: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  student_number: string;
  programme: string;
  level: string;
  academic_year: string;
  school_id: number;
  created_at: Date;
  updated_at: Date;
}
