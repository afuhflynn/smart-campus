"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/store/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  user: User;
}

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="h-10 rounded-xl pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <Badge
              variant="secondary"
              className="mt-1 h-5 text-[10px] uppercase tracking-wider font-bold"
            >
              {user.role.replace("_", " ")}
            </Badge>
          </div>
          <Avatar className="h-10 w-10 rounded-xl border-2 border-primary/10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
