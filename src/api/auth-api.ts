import { http } from "./http";
import type { AuthUser } from "../types/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type AdminRegisterPayload = {
  email: string;
  password: string;
  displayName: string;
  adminCode: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type CurrentUserResponse = {
  user: AuthUser;
};

export async function login(payload: LoginPayload) {
  const response = await http.post<AuthResponse>("/api/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await http.post<AuthResponse>("/api/auth/register", payload);
  return response.data;
}

export async function registerAdmin(payload: AdminRegisterPayload) {
  const response = await http.post<AuthResponse>("/api/auth/register-admin", {
    ...payload,
    adminRegistrationCode: payload.adminCode
  });
  return response.data;
}

export async function getCurrentUser(token: string) {
  const response = await http.get<CurrentUserResponse>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.user;
}
