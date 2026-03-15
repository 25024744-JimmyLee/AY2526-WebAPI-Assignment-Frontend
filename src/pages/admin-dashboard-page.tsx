import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Admin dashboard</p>
          <h1>Catalogue operations in one surface.</h1>
          <p className="page-copy">
            This dashboard is positioned as a calm editorial workspace instead of a generic admin table. It is ready for live counts and recent activity once the backend is connected.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card--accent">
          <span>Titles tracked</span>
          <strong>240</strong>
          <p>Current archive size shown here with a placeholder metric for the final API count.</p>
        </article>
        <article className="dashboard-card">
          <span>Draft updates</span>
          <strong>12</strong>
          <p>Pending metadata revisions and content adjustments across the collection.</p>
        </article>
        <article className="dashboard-card">
          <span>Response health</span>
          <strong>API ready</strong>
          <p>Current frontend shell already aligns with the planned auth and films endpoints.</p>
        </article>
      </section>

      <section className="admin-actions">
        <article className="admin-action-card">
          <h2>Create a new film record</h2>
          <p>Open the editorial form to add title metadata, synopsis, runtime, and public catalogue fields.</p>
          <Link className="button-link" to="/admin/films/new">
            Add film
          </Link>
        </article>

        <article className="admin-action-card">
          <h2>Refine an existing entry</h2>
          <p>Use the edit flow to update archive information once the real record id is provided by the backend.</p>
          <Link className="button-link" to="/admin/films/sample/edit">
            Edit sample
          </Link>
        </article>
      </section>
    </section>
  );
}
