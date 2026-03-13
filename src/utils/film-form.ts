import { z } from "zod";

import type { FilmPayload } from "../types/film";

export const filmFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  synopsis: z.string().min(10, "Synopsis should be at least 10 characters"),
  genre: z.string().min(2, "Genre is required"),
  releaseYear: z.coerce.number().int().min(1888).max(2100),
  rating: z.coerce.number().min(0).max(10),
  runtimeMinutes: z.coerce.number().int().min(1).max(500),
  curatorNote: z.string().min(2, "Curator note is required")
});

export type FilmFormValues = z.infer<typeof filmFormSchema>;

export const emptyFilmFormValues: FilmFormValues = {
  title: "",
  synopsis: "",
  genre: "",
  releaseYear: new Date().getFullYear(),
  rating: 8,
  runtimeMinutes: 120,
  curatorNote: ""
};

export function mapFilmToFormValues(payload: FilmPayload): FilmFormValues {
  return {
    title: payload.title,
    synopsis: payload.synopsis,
    genre: payload.genre,
    releaseYear: payload.releaseYear,
    rating: payload.rating,
    runtimeMinutes: payload.runtimeMinutes,
    curatorNote: payload.curatorNote
  };
}
