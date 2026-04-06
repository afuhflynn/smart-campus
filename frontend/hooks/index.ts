/**
 * =================================
 * Smart Campus React Query Hooks
 * Type-safe data fetching with caching
 * =================================
 */

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import {
  ApplicationStatus,
  ListSchoolsPaginationParams,
  LogInTypes,
  SignUpTypes,
} from "@/types/api.types";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect } from "react";
import { useRedirect } from "./use-redirect";

export function useSignUp() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: SignUpTypes) => api.mutations.auth.signup(data),
    onSuccess() {
      toast.success("Signup successful");
      router.push("/login");
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}

export function useLogIn() {
  const { redirectTo } = useRedirect();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: LogInTypes) => api.mutations.auth.login(data),
    onSuccess(data) {
      toast.success("Login successful");

      if (!data?.user) return toast.error("Signin failed");
      redirectTo(data.user.role, data.school.slug);
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}

export function useUserProfile(location?: string) {
  const router = useRouter();
  const result = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => {
      return api.queries.auth.me();
    },
    staleTime: 24 * 60 * 60 * 100, // 24 hours (1 day)
    gcTime: 0,
  });

  useEffect(() => {
    if (
      result.error &&
      !result.isPending &&
      location !== "/login" &&
      location !== "/signup" &&
      !["/", "/schools", "/how-it-works", "/pricing", "/about"].includes(
        location!,
      )
    ) {
      router.push("/login");
    }
  }, [result.error]);

  return result;
}

export function useLogout() {
  const queryClient = new QueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await api.mutations.auth.logout();
    },
    onSuccess() {
      setUser(null);
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
      queryClient.cancelQueries({
        queryKey: ["user-profile"],
      });
      window.location.href = "/login";
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}

export function useListSchools(params?: ListSchoolsPaginationParams) {
  return useQuery({
    queryKey: ["schools", params?.q, params?.city, params?.limit, params?.page],
    queryFn: () => api.queries.schools.list(params),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 0,
  });
}

export function useSchool(slug: string) {
  const result = useQuery({
    queryKey: ["school", slug],
    queryFn: () => api.queries.schools.getBySlug(slug),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 0,
  });

  useEffect(() => {
    console.log({ data: result.data });
  }, [result.data]);

  return result;
}

export function useApply(school_id: number) {
  return useMutation({
    mutationKey: ["apply-to", school_id],
    mutationFn: (data: {
      applicant_user_id: number | null;
      applicant_email: string;
      applicant_name: string;
      payload: Record<string, unknown>;
    }) => {
      return api.mutations.schools.apply({
        school_id,
        ...data,
      });
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useApplications(
  school_id: number,
  limit: number = 4,
  statusFilter?: ApplicationStatus,
  search?: string,
  page?: number,
) {
  return useQuery({
    queryKey: ["applications", school_id, statusFilter, search, page],
    queryFn: () =>
      api.queries.applications.list(school_id, {
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as ApplicationStatus),
        q: search || undefined,
        page,
        limit,
      }),
    enabled: !!school_id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 0,
  });
}

export function useApplication() {
  return useQuery({
    queryKey: ["my-application"],
    queryFn: api.queries.applications.myApplication,
    staleTime: Date.now() + 60 * 60 * 1000, // 1 hour
    gcTime: 0,
  });
}
