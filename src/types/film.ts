export type Film = {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  genre: string;
  releaseYear: number;
  rating: number;
  runtimeMinutes: number;
  curatorNote: string;
  posterUrl?: string | null;
  omdbId?: string | null;
  cast?: string | null;
  externalRating?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FilmFilters = {
  title?: string;
  genre?: string;
  year?: number;
  rating?: number;
};

export type FilmPayload = {
  title: string;
  synopsis: string;
  genre: string;
  releaseYear: number;
  rating: number;
  runtimeMinutes: number;
  curatorNote: string;
  posterUrl?: string | null;
  omdbId?: string | null;
  cast?: string | null;
  externalRating?: string | null;
};
