import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { addFavourite, listFavourites, removeFavourite } from "../api/favourites-api";
import { getFilm } from "../api/films-api";
import { createMessage } from "../api/messages-api";
import { useAuth } from "../store/auth-store";
import { resolveAssetUrl } from "../utils/asset-url";

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
  const favouritesQuery = useQuery({
    queryKey: ["favourites"],
    queryFn: () => listFavourites(token ?? ""),
    enabled: Boolean(token && user?.role === "USER")
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
  const favouriteMutation = useMutation({
    mutationFn: async () => {
      if (!filmId) {
        return;
      }

      const isFavourite = favouritesQuery.data?.some((favourite) => favourite.film.id === filmId);
      if (isFavourite) {
        await removeFavourite(token ?? "", filmId);
      } else {
        await addFavourite(token ?? "", filmId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["favourites"] });
    }
  });

  if (filmQuery.isLoading) {
    return <section className="status-card">Loading film details...</section>;
  }

  if (filmQuery.isError || !filmQuery.data) {
    return <section className="status-card status-card--error">Could not load this film record.</section>;
  }

  const film = filmQuery.data;
  const isFavourite = favouritesQuery.data?.some((favourite) => favourite.film.id === film.id) ?? false;

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Film detail</p>
          <h1>{film.title}</h1>
          <p className="page-copy">{film.synopsis}</p>
        </div>
        <div className="page-hero__badge">{film.externalRating ?? `ID: ${film.id}`}</div>
      </section>

      <section className="detail-layout">
        <article className="detail-poster">
          {film.posterUrl ? (
            <img className="detail-poster__image" src={resolveAssetUrl(film.posterUrl)} alt={`${film.title} poster`} />
          ) : (
            <div className="detail-poster__frame">
              <span>Featured still</span>
              <strong>2.39:1</strong>
            </div>
          )}
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

          {film.cast ? (
            <div className="detail-section">
              <h2>Cast</h2>
              <p>{film.cast}</p>
            </div>
          ) : null}

          {isAuthenticated && user?.role === "USER" ? (
            <div className="detail-section">
              <h2>Watchlist</h2>
              <button
                className="button-link button-link--muted"
                disabled={favouriteMutation.isPending || favouritesQuery.isLoading}
                onClick={() => favouriteMutation.mutate()}
                type="button"
              >
                {isFavourite ? "Remove from favourites" : "Add to favourites"}
              </button>
            </div>
          ) : null}

          {isAuthenticated && user?.role === "USER" ? (
            <div className="detail-section">
              <h2>Message the administrator</h2>
              <p>Use this form to ask the editorial team about this film or request more coverage.</p>
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
                    placeholder="Tell the administrators what you want to know or why this film deserves attention."
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
                  {messageMutation.isPending ? "Sending..." : "Send message"}
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
