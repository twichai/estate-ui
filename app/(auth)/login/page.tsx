"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const AUTH_COOKIE = "auth_user";

function saveAuthCookie(user: object) {
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; SameSite=Lax`;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    defaultValues: {
      email: "owner@example.com",
      password: "password123",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");

  const onSubmit = (data: LoginSchemaType) => {
    setApiErrorMessage("");
    fetch("/api/users/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid email or password.");
        return res.json();
      })
      .then((res) => {
        saveAuthCookie(res.user);
        router.push("/");
      })
      .catch((err: Error) => setApiErrorMessage(err.message));
  };

  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
              <h1 className="text-xl font-semibold">Login</h1>
              <div className="w-full max-w-sm space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-sm"
                  required
                  {...register("email")}
                />
                {/* if has error */}
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              <div className="w-full max-w-sm space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-sm"
                  required
                  {...register("password")}
                />
                {/* if has error */}
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
              {apiErrorMessage && (
                <div className="flex gap-2 text-sm text-orange-600 dark:text-orange-400 w-full">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{apiErrorMessage}</span>
                </div>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Don't have an account?</p>
              <a
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
