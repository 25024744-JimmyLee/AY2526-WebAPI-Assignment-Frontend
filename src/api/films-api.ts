import { createAuthorizedConfig, http } from "./http";
import type { Film, FilmFilters, FilmPayload } from "../types/film";

type FilmListResponse = {
  items: Film[];
};

type FilmItemResponse = {
  item: Film;
};

const etagCache = new Map<string, { etag: string; data: unknown }>();

function normalizeFilmPayload(payload: FilmPayload): FilmPayload {
  return {
    ...payload,
    posterUrl: payload.posterUrl || null,
    omdbId: payload.omdbId || null,
    cast: payload.cast || null,
    externalRating: payload.externalRating || null
  };
}

/**
 * Keeps the public film list cache-aware by replaying ETag values through
 * If-None-Match and returning cached data for 304 responses.
 */
export async function listFilms(filters: FilmFilters = {}) {
  const cacheKey = `films:${JSON.stringify(filters)}`;
  const cached = etagCache.get(cacheKey);
  const response = await http.get<FilmListResponse>("/api/films", {
    headers: cached ? { "If-None-Match": cached.etag } : undefined,
    params: {
      title: filters.title || undefined,
      genre: filters.genre && filters.genre !== "All" ? filters.genre : undefined,
      year: filters.year || undefined,
      rating: filters.rating || undefined
    },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304
  });

  if (response.status === 304 && cached) {
    return cached.data as Film[];
  }

  const etag = response.headers.etag;
  if (etag) {
    etagCache.set(cacheKey, {
      etag,
      data: response.data.items
    });
  }

  return response.data.items;
}

export async function getFilm(id: string) {
  const cacheKey = `film:${id}`;
  const cached = etagCache.get(cacheKey);
  const response = await http.get<FilmItemResponse>(`/api/films/${id}`, {
    headers: cached ? { "If-None-Match": cached.etag } : undefined,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304
  });

  if (response.status === 304 && cached) {
    return cached.data as Film;
  }

  const etag = response.headers.etag;
  if (etag) {
    etagCache.set(cacheKey, {
      etag,
      data: response.data.item
    });
  }

  return response.data.item;
}

export async function createFilm(token: string, payload: FilmPayload) {
  const response = await http.post<FilmItemResponse>("/api/films", normalizeFilmPayload(payload), createAuthorizedConfig(token));
  etagCache.clear();
  return response.data.item;
}

export async function updateFilm(token: string, id: string, payload: FilmPayload) {
  const response = await http.put<FilmItemResponse>(`/api/films/${id}`, normalizeFilmPayload(payload), createAuthorizedConfig(token));
  etagCache.clear();
  return response.data.item;
}

export async function deleteFilm(token: string, id: string) {
  const response = await http.delete<FilmItemResponse>(`/api/films/${id}`, createAuthorizedConfig(token));
  etagCache.clear();
  return response.data.item;
}
