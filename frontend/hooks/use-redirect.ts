import { Roles } from "@/types/api.types";
import { useRouter } from "next/navigation";

export function useRedirect() {
  const router = useRouter();

  function redirectTo(role: Roles, schoolSlug?: string) {
    switch (role) {
      case "applicant":
        router.push("/student"); // @note: On student dashboard, display based on if applicant or student of a school
        break;
      case "finance":
        router.push("/finance");
        break;
      case "lecturer":
        router.push("/lecturer");
        break;
      case "librarian":
        router.push("/library");
        break;
      case "platform_admin":
        router.push("/platform/admin");
        break;
      case "school_admin":
        if (!schoolSlug) router.push("/login");
        router.push(`/school/${schoolSlug}`);
        break;
      case "student":
        router.push("/student");
        break;
      default:
        router.push("/");
        break;
    }
  }

  function route(role: Roles, schoolSlug?: string) {
    switch (role) {
      case "applicant":
        return "/student"; // @note: On student dashboard, display based on if applicant or student of a school
        break;
      case "finance":
        return "/finance";
        break;
      case "lecturer":
        return "/lecturer";
        break;
      case "librarian":
        return "/library";
        break;
      case "platform_admin":
        return "/platform/admin";
        break;
      case "school_admin":
        if (!schoolSlug) return "/login";
        return `/school/${schoolSlug}`;
        break;
      case "student":
        return "/student";
        break;
      default:
        return "/";
        break;
    }
  }

  return {
    redirectTo,
    route,
  };
}
