/**
 * =================================
 * Smart Campus React Query Hooks
 * Type-safe data fetching with caching
 * =================================
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const router = useRouter();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: LogInTypes) => api.mutations.auth.login(data),
    onSuccess(data) {
      toast.success("Login successful");

      if (!data?.user) return toast.error("Signin failed");

      // @todo: make this better later
      if (data?.user.role === "student") {
        router.push("/");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}

export function useUserProfile() {
  const { setUser, user } = useAuthStore();
  const result = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => {
      // fetch if only the user data does not exist in local storage
      return user
        ? {
            user,
            success: true,
          }
        : api.queries.auth.me();
    },
    staleTime: 24 * 60 * 60 * 100, // 24 hours (1 day)
    gcTime: 0,
  });

  useEffect(() => {
    if (!result.isPending && result.data) {
      setUser(result.data.user);
    }
  }, [result.data?.user]);

  return result;
}

export function useLogout() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await api.mutations.auth.logout();
    },
    onSuccess() {
      setUser(null);
      router.push("/login");
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
