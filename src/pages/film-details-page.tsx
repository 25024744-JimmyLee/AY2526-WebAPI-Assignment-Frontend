import { useParams } from "react-router-dom";

export function FilmDetailsPage() {
  const { filmId } = useParams();

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Film detail</p>
          <h1>Skyline Archive</h1>
          <p className="page-copy">
            A future-facing catalogue page with space for synopsis, editorial framing, and metadata that feels intentionally composed.
          </p>
        </div>
        <div className="page-hero__badge">ID: {filmId}</div>
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
            <span>Science fiction</span>
            <span>2023</span>
            <span>132 min</span>
            <span>8.4 rating</span>
          </div>

          <div className="detail-section">
            <h2>Synopsis</h2>
            <p>
              An archivist discovers a sealed skyline vault containing banned cinema logs, incomplete reels, and evidence of a city that edits its own memory.
            </p>
          </div>

          <div className="detail-section">
            <h2>Curator note</h2>
            <p>
              This page is styled as a premium archive entry so the portfolio communicates atmosphere as well as CRUD capability. It is ready to map onto `/api/films/:id`.
            </p>
          </div>
        </article>
      </section>
    </section>
  );
}
