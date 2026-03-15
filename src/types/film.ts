export type Film = {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  releaseYear: number;
  rating?: number;
  runtimeMinutes?: number;
  curatorNote?: string;
};
