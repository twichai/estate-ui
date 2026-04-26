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

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");

  const onSubmit = (data: RegisterSchema) => {
    setApiErrorMessage("");
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
      }),
    })
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => {
            throw new Error(d.errors?.join(", ") ?? "Registration failed.");
          });
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
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            <h1 className="text-xl font-semibold">Create an account</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-sm"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="text-sm"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.confirmPassword.message}</span>
                  </div>
                )}
              </div>

              {apiErrorMessage && (
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{apiErrorMessage}</span>
                </div>
              )}

              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>Already have an account?</p>
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
