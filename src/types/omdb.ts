export type OmdbFilmMetadata = {
  omdbId: string;
  title: string;
  releaseYear: number | null;
  genre: string | null;
  runtimeMinutes: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  cast: string | null;
  externalRating: string | null;
};
