import { http } from "./http";
import type { AuthUser } from "../types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type CurrentUserResponse = {
  user: AuthUser;
};

export async function login(payload: LoginPayload) {
  const response = await http.post<LoginResponse>("/api/auth/login", payload);
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
