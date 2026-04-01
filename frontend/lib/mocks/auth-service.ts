import usersData from "@/data/users.json";
import { User } from "@/store/use-auth-store";

export const authService = {
  login: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const user = (usersData as User[]).find((u) => u.email === email);
    if (user) {
      return { user, token: "mock-jwt-token" };
    }
    throw new Error("Invalid credentials");
  },
};
