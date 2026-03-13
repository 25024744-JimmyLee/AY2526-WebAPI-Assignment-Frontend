import { createAuthorizedConfig, http } from "./http";
import type { Film, FilmFilters, FilmPayload } from "../types/film";

type FilmListResponse = {
  items: Film[];
};

type FilmItemResponse = {
  item: Film;
};

export async function listFilms(filters: FilmFilters = {}) {
  const response = await http.get<FilmListResponse>("/api/films", {
    params: {
      title: filters.title || undefined,
      genre: filters.genre && filters.genre !== "All" ? filters.genre : undefined,
      year: filters.year || undefined,
      rating: filters.rating || undefined
    }
  });
  return response.data.items;
}

export async function getFilm(id: string) {
  const response = await http.get<FilmItemResponse>(`/api/films/${id}`);
  return response.data.item;
}

export async function createFilm(token: string, payload: FilmPayload) {
  const response = await http.post<FilmItemResponse>("/api/films", payload, createAuthorizedConfig(token));
  return response.data.item;
}

export async function updateFilm(token: string, id: string, payload: FilmPayload) {
  const response = await http.put<FilmItemResponse>(`/api/films/${id}`, payload, createAuthorizedConfig(token));
  return response.data.item;
}

export async function deleteFilm(token: string, id: string) {
  const response = await http.delete<FilmItemResponse>(`/api/films/${id}`, createAuthorizedConfig(token));
  return response.data.item;
}
