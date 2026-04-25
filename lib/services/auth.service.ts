export interface AuthUser {
  id: number;
  email: string;
  roles?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

const AUTH_COOKIE = "auth_user";

export const authCookies = {
  save(user: AuthUser) {
    document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; SameSite=Lax`;
  },
  clear() {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  },
};

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      (data as { message?: string; errors?: string[] }).message ??
      (data as { errors?: string[] }).errors?.join(", ") ??
      "Something went wrong.";
    throw new Error(message);
  }

  return data as T;
}

export const authService = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/api/users/sign_in", {
      method: "POST",
      body: JSON.stringify({ user: payload }),
    });
  },

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/api/users", {
      method: "POST",
      body: JSON.stringify({ user: payload }),
    });
  },

  logout(): Promise<{ message: string }> {
    return request<{ message: string }>("/api/users/sign_out", {
      method: "DELETE",
    });
  },
};
