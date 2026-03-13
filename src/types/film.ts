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
  createdAt: string;
  updatedAt: string;
};

export type FilmFilters = {
  title?: string;
  genre?: string;
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
