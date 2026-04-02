/**
 * =================================
 * Smart Campus API Client
 * Centralized API interface for all backend calls
 * =================================
 */
import { privateAxios, publicAxios } from "@/config/axios.config";
import {
  ListSchoolsPaginationParams,
  LoginRespond,
  LogInTypes,
  PaginationParams,
  ProfileRespond,
  ResponsePagination,
  School,
  SignUpTypes,
} from "@/types/api.types";

// ===========================================
// API Request Helper
// ===========================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function apiRequest<T>(
  endpoint: string,
  options: {
    method: HttpMethod;
    body?: unknown;
    isPublic?: boolean;
  },
): Promise<T> {
  const axios = options.isPublic ? publicAxios : privateAxios;

  try {
    let response: { data: T };

    switch (options.method) {
      case "GET":
        response = await axios.get<T>(endpoint);
        break;
      case "DELETE":
        response = await axios.delete<T>(endpoint, {
          data: options.body ?? undefined,
        });
        break;
      case "POST":
        response = await axios.post<T>(endpoint, options.body ?? {});
        break;
      case "PUT":
        response = await axios.put<T>(endpoint, options.body ?? {});
        break;
      case "PATCH":
        response = await axios.patch<T>(endpoint, options.body ?? {});
        break;
      default:
        throw new Error(`Invalid HTTP method: ${options.method}`);
    }

    return response.data;
  } catch (error: unknown) {
    console.log({ error });
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
    }
    throw new Error("An unexpected error occurred");
  }
}

export const api = {
  queries: {
    auth: {
      me: (): Promise<ProfileRespond | null> =>
        apiRequest("/auth/profile", {
          method: "GET",
        }),
    },
    schools: {
      list: (
        params?: ListSchoolsPaginationParams,
      ): Promise<{
        data: School[];
        success: boolean;
        pagination: ResponsePagination;
      } | null> =>
        apiRequest(
          `/schools?q=${params?.q}&limit=${params?.limit}&city=${params?.city}&page=${params?.page}`,
          {
            method: "GET",
            isPublic: true,
          },
        ),
    },
  },
  mutations: {
    auth: {
      signup: (data: SignUpTypes) =>
        apiRequest("/auth/signup", {
          method: "POST",
          isPublic: true,
          body: data,
        }),
      login: (data: LogInTypes): Promise<LoginRespond | null> =>
        apiRequest("/auth/login", {
          method: "POST",
          body: data,
        }),
      logout: () =>
        apiRequest("/auth/logout", {
          method: "GET",
        }),
    },
  },
};
