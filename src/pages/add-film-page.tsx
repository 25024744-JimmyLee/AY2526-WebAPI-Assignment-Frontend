import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createFilm } from "../api/films-api";
import { useAuth } from "../store/auth-store";
import { emptyFilmFormValues, filmFormSchema, type FilmFormValues } from "../utils/film-form";

export function AddFilmPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<FilmFormValues>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: emptyFilmFormValues
  });
  const createMutation = useMutation({
    mutationFn: (values: FilmFormValues) => createFilm(token ?? "", values),
    onSuccess: (film) => {
      navigate(`/admin/films/${film.id}/edit`);
    }
  });
  const onSubmit = handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
  });

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Create record</p>
          <h1>Add a new film to the archive.</h1>
          <p className="page-copy">
            Fill in the core catalogue fields, save the record, and continue with metadata sync or editorial refinement from the admin workspace.
          </p>
        </div>
      </section>

      <form className="editor-form" onSubmit={onSubmit}>
        <section className="editor-panel">
          <h2>Primary information</h2>
          <label>
            <span>Title</span>
            <input {...register("title")} placeholder="Enter film title" type="text" />
            {errors.title ? <small>{errors.title.message}</small> : null}
          </label>
          <label>
            <span>Genre</span>
            <input {...register("genre")} placeholder="Mystery, Drama, Sci-Fi..." type="text" />
            {errors.genre ? <small>{errors.genre.message}</small> : null}
          </label>
          <label>
            <span>Release year</span>
            <input {...register("releaseYear")} placeholder="2026" type="number" />
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
          <h2>Editorial summary</h2>
          <label>
            <span>Synopsis</span>
            <textarea {...register("synopsis")} placeholder="Write a concise public synopsis" rows={6} />
            {errors.synopsis ? <small>{errors.synopsis.message}</small> : null}
          </label>
          <label>
            <span>Curator note</span>
            <textarea {...register("curatorNote")} placeholder="Internal tone or positioning note" rows={4} />
            {errors.curatorNote ? <small>{errors.curatorNote.message}</small> : null}
          </label>
        </section>

        <div className="button-row">
          <button className="button-link" disabled={isSubmitting || createMutation.isPending} type="submit">
            {createMutation.isPending ? "Saving..." : "Save draft"}
          </button>
          {createMutation.isError ? <p className="error-text">Could not create the film record.</p> : null}
        </div>
      </form>
    </section>
  );
}
