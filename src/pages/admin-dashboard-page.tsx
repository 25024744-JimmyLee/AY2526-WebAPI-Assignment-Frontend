import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { deleteFilm, listFilms } from "../api/films-api";
import { deleteMessage, listMessages, replyToMessage } from "../api/messages-api";
import { useAuth } from "../store/auth-store";

export function AdminDashboardPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
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
  const messagesQuery = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => listMessages(token ?? ""),
    enabled: Boolean(token)
  });
  const replyMutation = useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: string }) =>
      replyToMessage(token ?? "", messageId, { body }),
    onSuccess: async (message) => {
      setReplyDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[message.id];
        return nextDrafts;
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    }
  });
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(token ?? "", messageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    }
  });
  const featuredEditFilm = filmsQuery.data?.[0];

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Admin dashboard</p>
          <h1>Catalogue operations in one surface.</h1>
          <p className="page-copy">
            This dashboard focuses on the required management flow: review the catalogue, create records, edit entries, and remove films.
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
          <p>
            Jump straight into the first available catalogue record, or create a new one if the archive is still empty.
          </p>
          <Link className="button-link" to={featuredEditFilm ? `/admin/films/${featuredEditFilm.id}/edit` : "/admin/films/new"}>
            {featuredEditFilm ? "Edit latest title" : "Create first title"}
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

      <section className="stack">
        <section className="section-header">
          <div>
            <p className="eyebrow eyebrow--dark">Member messages</p>
            <h2>Inbox for film enquiries</h2>
          </div>
        </section>
        {messagesQuery.isLoading ? <section className="status-card">Loading inbox...</section> : null}
        {messagesQuery.isError ? <section className="status-card status-card--error">Could not load member messages.</section> : null}
        {!messagesQuery.isLoading && !messagesQuery.isError && messagesQuery.data?.length ? (
          <section className="dashboard-list">
            {messagesQuery.data.map((message) => (
              <article className="message-card" key={message.id}>
                <div className="message-card__header">
                  <div>
                    <p className="dashboard-list__meta">
                      {message.sender.displayName} · {message.film.title}
                    </p>
                    <h3>{message.subject}</h3>
                  </div>
                  <span className="message-card__stamp">{message.status}</span>
                </div>
                <p>{message.body}</p>
                {message.adminResponse ? (
                  <div className="reply-card">
                    <p className="eyebrow eyebrow--dark">Response sent</p>
                    <p>{message.adminResponse}</p>
                  </div>
                ) : (
                  <div className="reply-form">
                    <label>
                      <span>Admin response</span>
                      <textarea
                        onChange={(event) =>
                          setReplyDrafts((currentDrafts) => ({
                            ...currentDrafts,
                            [message.id]: event.target.value
                          }))
                        }
                        placeholder="Write a response for this member"
                        rows={4}
                        value={replyDrafts[message.id] ?? ""}
                      />
                    </label>
                    <button
                      className="button-link button-link--muted"
                      disabled={replyMutation.isPending || (replyDrafts[message.id] ?? "").trim().length < 4}
                      onClick={() =>
                        replyMutation.mutate({
                          messageId: message.id,
                          body: (replyDrafts[message.id] ?? "").trim()
                        })
                      }
                      type="button"
                    >
                      {replyMutation.isPending ? "Replying..." : "Send response"}
                    </button>
                  </div>
                )}
                <div className="button-row">
                  <button
                    className="button-link button-link--muted"
                    disabled={deleteMessageMutation.isPending}
                    onClick={() => deleteMessageMutation.mutate(message.id)}
                    type="button"
                  >
                    {deleteMessageMutation.isPending ? "Deleting..." : "Delete message"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : null}
        {!messagesQuery.isLoading && !messagesQuery.isError && !messagesQuery.data?.length ? (
          <section className="status-card">No member messages have arrived yet.</section>
        ) : null}
      </section>
    </section>
  );
}
