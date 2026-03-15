export function AddFilmPage() {
  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Create record</p>
          <h1>Add a new film to the archive.</h1>
          <p className="page-copy">
            The layout is already structured like a real editorial form so the final CRUD integration can drop into place without redesign work.
          </p>
        </div>
      </section>

      <form className="editor-form">
        <section className="editor-panel">
          <h2>Primary information</h2>
          <label>
            <span>Title</span>
            <input placeholder="Enter film title" type="text" />
          </label>
          <label>
            <span>Genre</span>
            <input placeholder="Mystery, Drama, Sci-Fi..." type="text" />
          </label>
          <label>
            <span>Release year</span>
            <input placeholder="2026" type="number" />
          </label>
        </section>

        <section className="editor-panel">
          <h2>Editorial summary</h2>
          <label>
            <span>Synopsis</span>
            <textarea placeholder="Write a concise public synopsis" rows={6} />
          </label>
          <label>
            <span>Curator note</span>
            <textarea placeholder="Internal tone or positioning note" rows={4} />
          </label>
        </section>

        <div className="button-row">
          <button className="button-link" type="button">
            Save draft
          </button>
          <button className="button-link button-link--muted" type="button">
            Preview layout
          </button>
        </div>
      </form>
    </section>
  );
}
