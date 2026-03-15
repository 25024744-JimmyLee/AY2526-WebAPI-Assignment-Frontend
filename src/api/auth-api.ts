import { http } from "./http";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export async function login(payload: LoginPayload) {
  const response = await http.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
}
