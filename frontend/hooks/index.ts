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
      redirectTo(data.user.role);
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
      location !== "/signup"
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
