import { Link } from "react-router-dom";

import type { Film } from "../types/film";

type FilmCardProps = {
  film: Film;
};

export function FilmCard({ film }: FilmCardProps) {
  return (
    <article className="film-card">
      <div className="film-card__topline">
        <p className="film-card__meta">{film.genre} · {film.releaseYear}</p>
        {film.rating ? <span className="film-card__rating">{film.rating.toFixed(1)}</span> : null}
      </div>

      <h3>{film.title}</h3>
      <p className="film-card__synopsis">{film.synopsis}</p>

      <div className="film-card__details">
        {film.runtimeMinutes ? <span>{film.runtimeMinutes} min</span> : null}
        {film.curatorNote ? <span>{film.curatorNote}</span> : null}
      </div>

      <Link className="film-card__link" to={`/films/${film.id}`}>
        Open archive
      </Link>
    </article>
  );
}
