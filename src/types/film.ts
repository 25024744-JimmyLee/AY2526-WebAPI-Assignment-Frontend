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
  plot?: string | null;
  cast?: string | null;
  omdbId?: string | null;
  externalRating?: number | null;
  metadataSource?: string | null;
  metadataSyncedAt?: string | null;
  announcementStatus?: "SENT" | "SKIPPED" | "FAILED" | null;
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
};
