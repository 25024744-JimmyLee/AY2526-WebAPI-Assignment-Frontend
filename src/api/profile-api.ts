import { createAuthorizedConfig, http } from "./http";
import type { AuthUser } from "../types/auth";

type ProfilePhotoResponse = {
  user: AuthUser;
};

export async function uploadProfilePhoto(token: string, file: File) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await http.post<ProfilePhotoResponse>("/api/profile/photo", formData, {
    ...createAuthorizedConfig(token),
    headers: {
      ...createAuthorizedConfig(token).headers,
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data.user;
}
