import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { listFilms } from "../api/films-api";
import { FilmCard } from "../components/film-card";

const genreOptions = ["All", "Mystery", "Sci-Fi", "Crime", "Drama"];

export function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const normalizedKeyword = keyword.trim();
  const filmsQuery = useQuery({
    queryKey: ["films", normalizedKeyword, activeGenre],
    queryFn: () =>
      listFilms({
        title: normalizedKeyword || undefined,
        genre: activeGenre
      })
  });

  return (
    <section className="stack">
      <section className="hero hero--cinematic">
        <div className="hero__content">
          <p className="eyebrow">CinemaVault Archive</p>
          <h1>A sharper frontend for a curated film platform, not just a CRUD dashboard.</h1>
          <p className="hero__lead">
            Public visitors browse a refined catalogue while administrators step into a protected editorial workspace. The visual direction leans cinematic, warm, and premium without becoming heavy.
          </p>

          <div className="hero__actions">
            <a className="button-link" href="#collection">
              Browse collection
            </a>
            <Link className="button-link button-link--ghost" to="/login">
              Enter admin
            </Link>
          </div>

          <div className="hero__stats">
            <article className="stat-card">
              <span>Collection</span>
              <strong>{filmsQuery.data?.length ?? "..."}</strong>
              <p>Live catalogue entries coming directly from the backend film index.</p>
            </article>
            <article className="stat-card">
              <span>Discovery</span>
              <strong>Fast search</strong>
              <p>Keyword and genre filters now query the real `/api/films` endpoint.</p>
            </article>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="hero-panel__label">Tonight's spotlight</p>
          {filmsQuery.data?.[0] ? (
            <>
              <h2>{filmsQuery.data[0].title}</h2>
              <p>{filmsQuery.data[0].synopsis}</p>
              <div className="hero-panel__meta">
                <span>{filmsQuery.data[0].rating.toFixed(1)} rating</span>
                <span>{filmsQuery.data[0].runtimeMinutes} min</span>
                <span>{filmsQuery.data[0].genre}</span>
              </div>
            </>
          ) : (
            <>
              <h2>Archive offline</h2>
              <p>Start the backend API to surface the current catalogue here.</p>
            </>
          )}
        </aside>
      </section>

      <section className="control-panel">
        <label className="search-box">
          <span>Search films</span>
          <input
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search by title or genre"
            type="search"
            value={keyword}
          />
        </label>

        <div className="chip-row" role="tablist" aria-label="Genre filters">
          {genreOptions.map((genre) => (
            <button
              aria-pressed={activeGenre === genre}
              className={activeGenre === genre ? "filter-chip filter-chip--active" : "filter-chip"}
              key={genre}
              onClick={() => setActiveGenre(genre)}
              type="button"
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className="section-header" id="collection">
        <div>
          <p className="eyebrow eyebrow--dark">Featured collection</p>
          <h2>Public browsing with stronger visual hierarchy</h2>
        </div>
        <p>{filmsQuery.data?.length ?? 0} visible title(s)</p>
      </section>

      {filmsQuery.isLoading ? <section className="status-card">Loading current collection...</section> : null}
      {filmsQuery.isError ? (
        <section className="status-card status-card--error">
          Could not load films from the API. Check that the backend is running on `http://127.0.0.1:4000`.
        </section>
      ) : null}
      {!filmsQuery.isLoading && !filmsQuery.isError && filmsQuery.data?.length === 0 ? (
        <section className="status-card">No films match the current filters.</section>
      ) : null}
      {!filmsQuery.isLoading && !filmsQuery.isError && filmsQuery.data && filmsQuery.data.length > 0 ? (
        <div className="grid">
          {filmsQuery.data.map((film) => (
            <FilmCard film={film} key={film.id} />
          ))}
        </div>
      ) : null}

      <section className="spotlight-strip">
        <article className="spotlight-strip__card">
          <p className="eyebrow eyebrow--dark">Admin flow</p>
          <h3>Protected routes now sit on top of a live login flow</h3>
          <p>The admin area opens after real authentication instead of a token-only shell.</p>
        </article>
        <article className="spotlight-strip__card">
          <p className="eyebrow eyebrow--dark">Next step</p>
          <h3>Editorial forms are wired for create and edit</h3>
          <p>The remaining work is mostly backend persistence, not frontend plumbing.</p>
        </article>
      </section>
    </section>
  );
}
