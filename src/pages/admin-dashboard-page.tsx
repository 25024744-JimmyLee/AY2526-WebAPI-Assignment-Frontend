import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { deleteFilm, listFilms } from "../api/films-api";
import { useAuth } from "../store/auth-store";

export function AdminDashboardPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const filmsQuery = useQuery({
    queryKey: ["admin-films"],
    queryFn: () => listFilms()
  });
  const deleteMutation = useMutation({
    mutationFn: (filmId: string) => deleteFilm(token ?? "", filmId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-films"] });
      await queryClient.invalidateQueries({ queryKey: ["films"] });
    }
  });

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
          <strong>{filmsQuery.data?.length ?? "..."}</strong>
          <p>Live catalogue count driven by the backend film list endpoint.</p>
        </article>
        <article className="dashboard-card">
          <span>Draft updates</span>
          <strong>{filmsQuery.data?.slice(0, 3).length ?? 0}</strong>
          <p>Use edit routes to refine synopsis, runtime, rating, and curator framing.</p>
        </article>
        <article className="dashboard-card">
          <span>Response health</span>
          <strong>{filmsQuery.isError ? "Check API" : "Connected"}</strong>
          <p>The dashboard reads real data and invalidates queries after create, update, and delete.</p>
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

      {filmsQuery.isLoading ? <section className="status-card">Loading current catalogue...</section> : null}
      {filmsQuery.isError ? <section className="status-card status-card--error">Could not load admin catalogue data.</section> : null}
      {!filmsQuery.isLoading && !filmsQuery.isError && filmsQuery.data?.length === 0 ? (
        <section className="status-card">No films are available yet.</section>
      ) : null}
      {!filmsQuery.isLoading && !filmsQuery.isError && filmsQuery.data && filmsQuery.data.length > 0 ? (
        <section className="dashboard-list">
          {filmsQuery.data.map((film) => (
            <article className="dashboard-list__item" key={film.id}>
              <div>
                <p className="dashboard-list__meta">{film.genre} · {film.releaseYear}</p>
                <h3>{film.title}</h3>
                <p>{film.curatorNote}</p>
              </div>

              <div className="button-row">
                <Link className="button-link button-link--muted" to={`/films/${film.id}`}>
                  View
                </Link>
                <Link className="button-link button-link--muted" to={`/admin/films/${film.id}/edit`}>
                  Edit
                </Link>
                <button
                  className="button-link"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(film.id)}
                  type="button"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
