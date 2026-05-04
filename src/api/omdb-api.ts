import { createAuthorizedConfig, http } from "./http";
import type { OmdbFilmMetadata } from "../types/omdb";

type OmdbResponse = {
  item: OmdbFilmMetadata;
};

export async function lookupOmdbFilm(token: string, title: string) {
  const response = await http.get<OmdbResponse>("/api/omdb/lookup", {
    ...createAuthorizedConfig(token),
    params: {
      title
    }
  });

  return response.data.item;
}
