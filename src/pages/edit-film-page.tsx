import { useParams } from "react-router-dom";

export function EditFilmPage() {
  const { filmId } = useParams();

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Edit record</p>
          <h1>Refine catalogue entry</h1>
          <p className="page-copy">
            Current record id: {filmId}. This page is designed for structured editing once film data is fetched from the backend.
          </p>
        </div>
      </section>

      <form className="editor-form">
        <section className="editor-panel">
          <h2>Current metadata</h2>
          <label>
            <span>Title</span>
            <input defaultValue="Skyline Archive" type="text" />
          </label>
          <label>
            <span>Genre</span>
            <input defaultValue="Sci-Fi" type="text" />
          </label>
          <label>
            <span>Release year</span>
            <input defaultValue="2023" type="number" />
          </label>
        </section>

        <section className="editor-panel">
          <h2>Editorial notes</h2>
          <label>
            <span>Synopsis</span>
            <textarea
              defaultValue="An archivist uncovers a hidden catalogue of banned science-fiction classics."
              rows={6}
            />
          </label>
          <label>
            <span>Curator note</span>
            <textarea defaultValue="Lean into the premium archive language on the public detail page." rows={4} />
          </label>
        </section>

        <div className="button-row">
          <button className="button-link" type="button">
            Update record
          </button>
          <button className="button-link button-link--muted" type="button">
            Compare changes
          </button>
        </div>
      </form>
    </section>
  );
}
