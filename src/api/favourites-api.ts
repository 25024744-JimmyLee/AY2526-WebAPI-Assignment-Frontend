import { createAuthorizedConfig, http } from "./http";
import type { FavouriteFilm } from "../types/favourite";

type FavouritesResponse = {
  items: FavouriteFilm[];
};

type FavouriteResponse = {
  item: FavouriteFilm;
};

export async function listFavourites(token: string) {
  const response = await http.get<FavouritesResponse>("/api/favourites", createAuthorizedConfig(token));
  return response.data.items;
}

export async function addFavourite(token: string, filmId: string) {
  const response = await http.post<FavouriteResponse>(`/api/favourites/${filmId}`, undefined, createAuthorizedConfig(token));
  return response.data.item;
}

export async function removeFavourite(token: string, filmId: string) {
  await http.delete(`/api/favourites/${filmId}`, createAuthorizedConfig(token));
}
