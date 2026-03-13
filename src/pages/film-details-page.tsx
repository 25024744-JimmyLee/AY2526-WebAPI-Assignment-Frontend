import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getFilm } from "../api/films-api";

export function FilmDetailsPage() {
  const { filmId } = useParams();
  const filmQuery = useQuery({
    queryKey: ["film", filmId],
    queryFn: () => getFilm(filmId ?? ""),
    enabled: Boolean(filmId)
  });

  if (filmQuery.isLoading) {
    return <section className="status-card">Loading film details...</section>;
  }

  if (filmQuery.isError || !filmQuery.data) {
    return <section className="status-card status-card--error">Could not load this film record.</section>;
  }

  const film = filmQuery.data;

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Film detail</p>
          <h1>{film.title}</h1>
          <p className="page-copy">{film.synopsis}</p>
        </div>
        <div className="page-hero__badge">ID: {film.id}</div>
      </section>

      <section className="detail-layout">
        <article className="detail-poster">
          <div className="detail-poster__frame">
            <span>Featured still</span>
            <strong>2.39:1</strong>
          </div>
        </article>

        <article className="detail-content">
          <div className="detail-metadata">
            <span>{film.genre}</span>
            <span>{film.releaseYear}</span>
            <span>{film.runtimeMinutes} min</span>
            <span>{film.rating.toFixed(1)} rating</span>
          </div>

          <div className="detail-section">
            <h2>Synopsis</h2>
            <p>{film.synopsis}</p>
          </div>

          <div className="detail-section">
            <h2>Curator note</h2>
            <p>{film.curatorNote}</p>
          </div>
        </article>
      </section>
    </section>
  );
}
