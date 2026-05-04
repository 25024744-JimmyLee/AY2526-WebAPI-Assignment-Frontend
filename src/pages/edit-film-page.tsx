import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { getFilm, updateFilm } from "../api/films-api";
import { lookupOmdbFilm } from "../api/omdb-api";
import { useAuth } from "../store/auth-store";
import { filmFormSchema, mapFilmToFormValues, type FilmFormValues } from "../utils/film-form";

export function EditFilmPage() {
  const { filmId } = useParams();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const filmQuery = useQuery({
    queryKey: ["film", filmId],
    queryFn: () => getFilm(filmId ?? ""),
    enabled: Boolean(filmId)
  });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<FilmFormValues>({
    resolver: zodResolver(filmFormSchema)
  });
  const updateMutation = useMutation({
    mutationFn: (values: FilmFormValues) => updateFilm(token ?? "", filmId ?? "", values),
    onSuccess: async (film) => {
      reset(mapFilmToFormValues(film));
      await queryClient.invalidateQueries({ queryKey: ["film", filmId] });
      await queryClient.invalidateQueries({ queryKey: ["films"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-films"] });
    }
  });
  const lookupTitle = watch("title") ?? "";
  const omdbMutation = useMutation({
    mutationFn: () => lookupOmdbFilm(token ?? "", lookupTitle),
    onSuccess: (metadata) => {
      setValue("title", metadata.title, { shouldValidate: true });
      if (metadata.genre) {
        setValue("genre", metadata.genre, { shouldValidate: true });
      }
      if (metadata.releaseYear) {
        setValue("releaseYear", metadata.releaseYear, { shouldValidate: true });
      }
      if (metadata.runtimeMinutes) {
        setValue("runtimeMinutes", metadata.runtimeMinutes, { shouldValidate: true });
      }
      if (metadata.synopsis) {
        setValue("synopsis", metadata.synopsis, { shouldValidate: true });
      }
      setValue("posterUrl", metadata.posterUrl ?? "", { shouldValidate: true });
      setValue("omdbId", metadata.omdbId, { shouldValidate: true });
      setValue("cast", metadata.cast ?? "", { shouldValidate: true });
      setValue("externalRating", metadata.externalRating ?? "", { shouldValidate: true });
    }
  });

  useEffect(() => {
    if (filmQuery.data) {
      reset(mapFilmToFormValues(filmQuery.data));
    }
  }, [filmQuery.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateMutation.mutateAsync(values);
  });

  if (filmQuery.isLoading) {
    return <section className="status-card">Loading editable record...</section>;
  }

  if (filmQuery.isError || !filmQuery.data) {
    return <section className="status-card status-card--error">Could not load the film record for editing.</section>;
  }

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Edit record</p>
          <h1>Refine catalogue entry</h1>
          <p className="page-copy">
            Current record id: {filmId}. Update the live record here, then return to the dashboard to continue catalogue management.
          </p>
        </div>
      </section>

      <form className="editor-form" onSubmit={onSubmit}>
        <section className="editor-panel">
          <h2>Current metadata</h2>
          <button
            className="button-link button-link--muted"
            disabled={omdbMutation.isPending || lookupTitle.trim().length < 2}
            onClick={() => omdbMutation.mutate()}
            type="button"
          >
            {omdbMutation.isPending ? "Fetching OMDB..." : "Refresh from OMDB"}
          </button>
          {omdbMutation.isError ? <p className="error-text">Could not fetch OMDB metadata. Check the API key.</p> : null}
          <label>
            <span>Title</span>
            <input {...register("title")} type="text" />
            {errors.title ? <small>{errors.title.message}</small> : null}
          </label>
          <label>
            <span>Genre</span>
            <input {...register("genre")} type="text" />
            {errors.genre ? <small>{errors.genre.message}</small> : null}
          </label>
          <label>
            <span>Release year</span>
            <input {...register("releaseYear")} type="number" />
            {errors.releaseYear ? <small>{errors.releaseYear.message}</small> : null}
          </label>
          <label>
            <span>Rating</span>
            <input {...register("rating")} max="10" min="0" step="0.1" type="number" />
            {errors.rating ? <small>{errors.rating.message}</small> : null}
          </label>
          <label>
            <span>Runtime</span>
            <input {...register("runtimeMinutes")} min="1" type="number" />
            {errors.runtimeMinutes ? <small>{errors.runtimeMinutes.message}</small> : null}
          </label>
        </section>

        <section className="editor-panel">
          <h2>Editorial notes</h2>
          <label>
            <span>Synopsis</span>
            <textarea {...register("synopsis")} rows={6} />
            {errors.synopsis ? <small>{errors.synopsis.message}</small> : null}
          </label>
          <label>
            <span>Curator note</span>
            <textarea {...register("curatorNote")} rows={4} />
            {errors.curatorNote ? <small>{errors.curatorNote.message}</small> : null}
          </label>
          <label>
            <span>Poster URL</span>
            <input {...register("posterUrl")} type="url" />
            {errors.posterUrl ? <small>{errors.posterUrl.message}</small> : null}
          </label>
          <label>
            <span>OMDB ID</span>
            <input {...register("omdbId")} type="text" />
          </label>
          <label>
            <span>Cast</span>
            <textarea {...register("cast")} rows={3} />
          </label>
          <label>
            <span>External rating</span>
            <input {...register("externalRating")} type="text" />
          </label>
        </section>

        <div className="button-row">
          <button className="button-link" disabled={isSubmitting || updateMutation.isPending} type="submit">
            {updateMutation.isPending ? "Updating..." : "Update record"}
          </button>
          {updateMutation.isSuccess ? <p className="status-inline">Record updated.</p> : null}
          {updateMutation.isError ? <p className="error-text">Could not update this film record.</p> : null}
        </div>
      </form>
    </section>
  );
}
