import { http } from "./http";
import type { Film } from "../types/film";

export async function listFilms() {
  const response = await http.get<Film[]>("/api/films");
  return response.data;
}

export async function getFilm(id: string) {
  const response = await http.get<Film>(`/api/films/${id}`);
  return response.data;
}
