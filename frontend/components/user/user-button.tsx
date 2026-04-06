"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, School2, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/api.types";
import { useLogout } from "@/hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRedirect } from "@/hooks/use-redirect";
import { useIsMobile } from "@/hooks/use-mobile";

export const UserButton = ({
  user,
  schoolSlug,
}: {
  user: User | null;
  schoolSlug?: string;
}) => {
  const { mutate: logout, isPending: logingOut } = useLogout();
  const pathName = usePathname();
  const isMobile = useIsMobile();
  const { route } = useRedirect();
  const [userDashboard, setUserDashboard] = useState("/student");
  const router = useRouter();
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    router.push("/login");
  };

  useEffect(() => {
    if (user) {
      const path = route(user.role, schoolSlug);
      setUserDashboard(path);
    }
  }, [user]);

  if (isMobile && pathName !== userDashboard) {
    return (
      <Link
        href={userDashboard}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={(user?.image as string) || ""}
              alt={user.name || user.email.split("@")[0] || "User"}
            />
            <AvatarFallback className="text-primary bg-primary/10">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : (user.name?.charAt(0) ?? "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background font-sans">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-larger">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-primary">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={userDashboard}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "student" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={"/schools"}>
              <School2 className="w-4 h-4 mr-2" />
              <span>Find a school</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="cursor-pointer" disabled>
          <Link href={`/settings`}>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mt-2" />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:text-red-500"
          onClick={handleLogout}
          disabled={logingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
