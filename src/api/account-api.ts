import { createAuthorizedConfig, http } from "./http";
import type { AuthUser } from "../types/auth";
import type { FilmPreference, LibraryCollections, PreferenceUpdatePayload } from "../types/library";

type UserResponse = {
  user: AuthUser;
};

type LibraryResponse = LibraryCollections;

type PreferenceResponse = {
  item: FilmPreference;
};

export async function updateProfilePhoto(token: string, imageDataUrl: string) {
  const response = await http.patch<UserResponse>(
    "/api/users/me/profile-photo",
    {
      imageDataUrl
    },
    createAuthorizedConfig(token)
  );

  return response.data.user;
}

export async function getLibrary(token: string) {
  const response = await http.get<LibraryResponse>("/api/users/me/preferences", createAuthorizedConfig(token));
  return response.data;
}

export async function updateFilmPreference(
  token: string,
  filmId: string,
  payload: PreferenceUpdatePayload
) {
  const normalizedPayload = {
    ...payload,
    watchStatus: payload.watchStatus === "NONE" ? null : payload.watchStatus
  };
  const response = await http.put<PreferenceResponse>(
    `/api/users/me/preferences/${filmId}`,
    normalizedPayload,
    createAuthorizedConfig(token)
  );

  return response.data.item;
}
