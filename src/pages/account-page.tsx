import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangeEvent } from "react";

import { getLibrary, updateProfilePhoto } from "../api/account-api";
import { listMessages } from "../api/messages-api";
import { FilmCard } from "../components/film-card";
import { useAuth } from "../store/auth-store";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AccountPage() {
  const { token, user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const libraryQuery = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(token ?? ""),
    enabled: Boolean(token)
  });
  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: () => listMessages(token ?? ""),
    enabled: Boolean(token)
  });
  const photoMutation = useMutation({
    mutationFn: (imageDataUrl: string) => updateProfilePhoto(token ?? "", imageDataUrl),
    onSuccess: async (nextUser) => {
      updateUser(nextUser);
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    }
  });

  const onPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageDataUrl = await readFileAsDataUrl(file);
    await photoMutation.mutateAsync(imageDataUrl);
    event.target.value = "";
  };

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Member account</p>
          <h1>Track your viewing path and keep the editorial desk informed.</h1>
          <p className="page-copy">
            This area combines identity, saved lists, and direct film-interest messages so the SPA demonstrates more than a public catalogue.
          </p>
        </div>
      </section>

      <section className="account-grid">
        <article className="profile-card">
          <div className="profile-card__header">
            {user?.profilePhotoDataUrl ? (
              <img alt={user.displayName} className="profile-card__avatar" src={user.profilePhotoDataUrl} />
            ) : (
              <div className="profile-card__avatar profile-card__avatar--placeholder">
                {user?.displayName?.slice(0, 1) ?? "?"}
              </div>
            )}

            <div>
              <p className="eyebrow eyebrow--dark">Signed in as</p>
              <h2>{user?.displayName ?? "Member"}</h2>
              <p className="profile-card__meta">
                {user?.email} · {user?.role === "ADMIN" ? "Administrator" : "Member"}
              </p>
            </div>
          </div>

          <label className="upload-field">
            <span>Upload profile photo</span>
            <input accept="image/*" onChange={(event) => void onPhotoChange(event)} type="file" />
          </label>
          {photoMutation.isPending ? <p className="status-inline">Uploading profile photo...</p> : null}
          {photoMutation.isError ? <p className="error-text">Profile photo upload failed.</p> : null}
        </article>

        <article className="dashboard-card dashboard-card--accent">
          <span>Saved favourites</span>
          <strong>{libraryQuery.data?.favourites.length ?? "..."}</strong>
          <p>Keep a shortlist of titles worth revisiting or recommending.</p>
        </article>

        <article className="dashboard-card">
          <span>Watchlist queue</span>
          <strong>{libraryQuery.data?.watchlist.length ?? "..."}</strong>
          <p>Promote interesting catalogue entries into a personal watch queue.</p>
        </article>

        <article className="dashboard-card">
          <span>Watched log</span>
          <strong>{libraryQuery.data?.watched.length ?? "..."}</strong>
          <p>Use watched markers to show that the SPA handles long-lived user state.</p>
        </article>
      </section>

      {libraryQuery.isLoading ? <section className="status-card">Loading your member library...</section> : null}
      {libraryQuery.isError ? (
        <section className="status-card status-card--error">Could not load your favourites and watch progress.</section>
      ) : null}

      {!libraryQuery.isLoading && !libraryQuery.isError && libraryQuery.data ? (
        <section className="stack">
          <section className="section-header">
            <div>
              <p className="eyebrow eyebrow--dark">Favourites</p>
              <h2>Saved because they deserve a second look</h2>
            </div>
          </section>
          {libraryQuery.data.favourites.length > 0 ? (
            <div className="grid">
              {libraryQuery.data.favourites.map((film) => (
                <FilmCard film={film} key={film.id} />
              ))}
            </div>
          ) : (
            <section className="status-card">No favourites yet. Open a film and pin one to this shelf.</section>
          )}

          <section className="split-grid">
            <article className="dashboard-list">
              <div className="section-header">
                <div>
                  <p className="eyebrow eyebrow--dark">Watchlist</p>
                  <h2>Queued for later</h2>
                </div>
              </div>
              {libraryQuery.data.watchlist.length > 0 ? (
                libraryQuery.data.watchlist.map((film) => (
                  <article className="dashboard-list__item" key={film.id}>
                    <div>
                      <p className="dashboard-list__meta">{film.genre} · {film.releaseYear}</p>
                      <h3>{film.title}</h3>
                    </div>
                  </article>
                ))
              ) : (
                <section className="status-card">Your watchlist is empty.</section>
              )}
            </article>

            <article className="dashboard-list">
              <div className="section-header">
                <div>
                  <p className="eyebrow eyebrow--dark">Watched</p>
                  <h2>Seen and logged</h2>
                </div>
              </div>
              {libraryQuery.data.watched.length > 0 ? (
                libraryQuery.data.watched.map((film) => (
                  <article className="dashboard-list__item" key={film.id}>
                    <div>
                      <p className="dashboard-list__meta">{film.genre} · {film.releaseYear}</p>
                      <h3>{film.title}</h3>
                    </div>
                  </article>
                ))
              ) : (
                <section className="status-card">No watched titles have been recorded yet.</section>
              )}
            </article>
          </section>
        </section>
      ) : null}

      <section className="stack">
        <section className="section-header">
          <div>
            <p className="eyebrow eyebrow--dark">Message history</p>
            <h2>Your requests to the administrators</h2>
          </div>
        </section>
        {messagesQuery.isLoading ? <section className="status-card">Loading message history...</section> : null}
        {messagesQuery.isError ? (
          <section className="status-card status-card--error">Could not load your message history.</section>
        ) : null}
        {!messagesQuery.isLoading && !messagesQuery.isError && messagesQuery.data?.length ? (
          <section className="dashboard-list">
            {messagesQuery.data.map((message) => (
              <article className="message-card" key={message.id}>
                <div className="message-card__header">
                  <div>
                    <p className="dashboard-list__meta">
                      {message.film?.title ?? "General request"} · {message.status}
                    </p>
                    <h3>{message.subject}</h3>
                  </div>
                  <span className="message-card__stamp">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{message.body}</p>
                {message.adminResponse ? (
                  <div className="reply-card">
                    <p className="eyebrow eyebrow--dark">Admin response</p>
                    <p>{message.adminResponse}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}
        {!messagesQuery.isLoading && !messagesQuery.isError && !messagesQuery.data?.length ? (
          <section className="status-card">You have not contacted the editorial team yet.</section>
        ) : null}
      </section>
    </section>
  );
}
