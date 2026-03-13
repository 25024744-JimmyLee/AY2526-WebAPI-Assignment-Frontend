import { createAuthorizedConfig, http } from "./http";
import type { Film } from "../types/film";
import type { SocialPostRecord } from "../types/social";

type SocialPostsResponse = {
  items: SocialPostRecord[];
};

type FilmResponse = {
  item: Film;
};

export async function listSocialPosts(token: string) {
  const response = await http.get<SocialPostsResponse>("/api/social-posts", createAuthorizedConfig(token));
  return response.data.items;
}

export async function syncFilmFromOmdb(token: string, filmId: string) {
  const response = await http.post<FilmResponse>(
    `/api/films/${filmId}/sync-omdb`,
    {},
    createAuthorizedConfig(token)
  );
  return response.data.item;
}
