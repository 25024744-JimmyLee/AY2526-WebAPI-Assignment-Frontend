import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { updateFilmPreference } from "../api/account-api";
import { getFilm } from "../api/films-api";
import { createMessage } from "../api/messages-api";
import { useAuth } from "../store/auth-store";

export function FilmDetailsPage() {
  const { filmId } = useParams();
  const { isAuthenticated, token, user } = useAuth();
  const queryClient = useQueryClient();
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const filmQuery = useQuery({
    queryKey: ["film", filmId],
    queryFn: () => getFilm(filmId ?? ""),
    enabled: Boolean(filmId)
  });
  const preferenceMutation = useMutation({
    mutationFn: ({ isFavorite, watchStatus }: { isFavorite?: boolean; watchStatus?: "NONE" | "WATCHLIST" | "WATCHED" }) =>
      updateFilmPreference(token ?? "", filmId ?? "", {
        isFavorite,
        watchStatus
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["library"] });
    }
  });
  const messageMutation = useMutation({
    mutationFn: () =>
      createMessage(token ?? "", {
        filmId: filmId ?? "",
        subject: messageSubject,
        body: messageBody
      }),
    onSuccess: async () => {
      setMessageSubject("");
      setMessageBody("");
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    }
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
            {film.posterUrl ? (
              <img alt={film.title} className="detail-poster__image" src={film.posterUrl} />
            ) : (
              <>
                <span>Featured still</span>
                <strong>2.39:1</strong>
              </>
            )}
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

          {film.plot || film.cast || film.externalRating ? (
            <div className="detail-section">
              <h2>Extended metadata</h2>
              <div className="detail-metadata detail-metadata--stacked">
                {film.externalRating ? <span>IMDb {film.externalRating.toFixed(1)}</span> : null}
                {film.cast ? <span>Cast: {film.cast}</span> : null}
                {film.metadataSource ? <span>Source: {film.metadataSource}</span> : null}
              </div>
              {film.plot ? <p>{film.plot}</p> : null}
            </div>
          ) : null}

          {isAuthenticated ? (
            <div className="detail-section">
              <h2>Your library actions</h2>
              <div className="button-row">
                <button
                  className="button-link button-link--muted"
                  onClick={() => preferenceMutation.mutate({ isFavorite: true })}
                  type="button"
                >
                  Add to favourites
                </button>
                <button
                  className="button-link button-link--muted"
                  onClick={() => preferenceMutation.mutate({ watchStatus: "WATCHLIST" })}
                  type="button"
                >
                  Watchlist
                </button>
                <button
                  className="button-link button-link--muted"
                  onClick={() => preferenceMutation.mutate({ watchStatus: "WATCHED" })}
                  type="button"
                >
                  Mark watched
                </button>
              </div>
              {preferenceMutation.isPending ? <p className="status-inline">Saving preference...</p> : null}
            </div>
          ) : null}

          {isAuthenticated && user?.role === "USER" ? (
            <div className="detail-section">
              <h2>Message the administrator</h2>
              <p>Use this form to express interest in this title and start a direct conversation with the editorial team.</p>
              <div className="stack detail-form">
                <label>
                  <span>Subject</span>
                  <input
                    onChange={(event) => setMessageSubject(event.target.value)}
                    placeholder="Why this title matters to you"
                    type="text"
                    value={messageSubject}
                  />
                </label>
                <label>
                  <span>Message</span>
                  <textarea
                    onChange={(event) => setMessageBody(event.target.value)}
                    placeholder="Tell the administrators why you want this film highlighted, reviewed, or expanded."
                    rows={5}
                    value={messageBody}
                  />
                </label>
                <button
                  className="button-link"
                  disabled={messageMutation.isPending || messageSubject.trim().length < 4 || messageBody.trim().length < 10}
                  onClick={() => messageMutation.mutate()}
                  type="button"
                >
                  {messageMutation.isPending ? "Sending..." : "Send interest message"}
                </button>
                {messageMutation.isSuccess ? <p className="status-inline">Message sent to the administrator.</p> : null}
                {messageMutation.isError ? <p className="error-text">Could not send your message.</p> : null}
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </section>
  );
}
