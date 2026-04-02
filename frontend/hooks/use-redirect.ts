import { Roles } from "@/types/api.types";
import { useRouter } from "next/navigation";

export function useRedirect() {
  const router = useRouter();

  function redirectTo(role: Roles) {
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
        router.push("/admin");
        break;
      case "student":
        router.push("/student");
        break;
      default:
        router.push("/");
        break;
    }
  }

  return {
    redirectTo,
  };
}
