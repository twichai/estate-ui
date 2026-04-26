"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const AUTH_COOKIE = "auth_user";

interface AuthUser {
  id: number;
  email: string;
  roles?: string[];
}

function getAuthUser(): AuthUser | null {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(
      decodeURIComponent(match.split("=").slice(1).join("=")),
    ) as AuthUser;
  } catch {
    return null;
  }
}

const PUBLIC_ROUTES = ["/login", "/register"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
    const currentUser = getAuthUser();

    if (!isPublicRoute && !currentUser) {
      router.replace("/login");
      return;
    }

    if (isPublicRoute && currentUser) {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [pathname, isPublicRoute, router]);

  // Show loading spinner on protected routes while resolving auth
  if (!isPublicRoute && !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking auth...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
