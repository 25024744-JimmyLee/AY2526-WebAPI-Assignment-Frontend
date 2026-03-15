import { useState } from "react";
import { Link } from "react-router-dom";

import { FilmCard } from "../components/film-card";
import type { Film } from "../types/film";

const sampleFilms: Film[] = [
  {
    id: "film-1",
    title: "In the Mood for Noir",
    synopsis: "A quiet city mystery told through fragmented memories and vanished reels.",
    genre: "Mystery",
    releaseYear: 2024,
    rating: 8.8,
    runtimeMinutes: 118,
    curatorNote: "Slow-burn atmosphere"
  },
  {
    id: "film-2",
    title: "Skyline Archive",
    synopsis: "An archivist uncovers a hidden catalogue of banned science-fiction classics.",
    genre: "Sci-Fi",
    releaseYear: 2023,
    rating: 8.4,
    runtimeMinutes: 132,
    curatorNote: "World-building standout"
  },
  {
    id: "film-3",
    title: "Red Lantern District",
    synopsis: "A stylised crime drama where every witness remembers the night differently.",
    genre: "Crime",
    releaseYear: 2022,
    rating: 8.1,
    runtimeMinutes: 124,
    curatorNote: "Visual signature"
  },
  {
    id: "film-4",
    title: "Glass Harbor",
    synopsis: "A coastal family saga about inheritance, ambition, and a cinema about to disappear.",
    genre: "Drama",
    releaseYear: 2021,
    rating: 7.9,
    runtimeMinutes: 109,
    curatorNote: "Festival favourite"
  }
];

const genreOptions = ["All", "Mystery", "Sci-Fi", "Crime", "Drama"];

export function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleFilms = sampleFilms.filter((film) => {
    const matchesKeyword =
      !normalizedKeyword ||
      film.title.toLowerCase().includes(normalizedKeyword) ||
      film.genre.toLowerCase().includes(normalizedKeyword);
    const matchesGenre = activeGenre === "All" || film.genre === activeGenre;

    return matchesKeyword && matchesGenre;
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
              <strong>240+</strong>
              <p>Archive-ready titles across public and editorial views.</p>
            </article>
            <article className="stat-card">
              <span>Discovery</span>
              <strong>Fast search</strong>
              <p>Keyword and genre entry points for a cleaner first impression.</p>
            </article>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="hero-panel__label">Tonight's spotlight</p>
          <h2>Skyline Archive</h2>
          <p>
            An elegant sci-fi indexer with enough intrigue to suggest the product already knows how to curate, not just store.
          </p>
          <div className="hero-panel__meta">
            <span>8.4 rating</span>
            <span>132 min</span>
            <span>Admin-ready</span>
          </div>
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
        <p>{visibleFilms.length} visible title(s)</p>
      </section>

      <div className="grid">
        {visibleFilms.map((film) => (
          <FilmCard film={film} key={film.id} />
        ))}
      </div>

      <section className="spotlight-strip">
        <article className="spotlight-strip__card">
          <p className="eyebrow eyebrow--dark">Admin flow</p>
          <h3>Protected routes are already in place</h3>
          <p>The visual shell makes the management area feel like part of the same product, not a disconnected back office.</p>
        </article>
        <article className="spotlight-strip__card">
          <p className="eyebrow eyebrow--dark">Next step</p>
          <h3>Connect live catalogue data</h3>
          <p>Once `/api/films` is implemented, this layout can switch from sample records to live query-driven cards with minimal rework.</p>
        </article>
      </section>
    </section>
  );
}
