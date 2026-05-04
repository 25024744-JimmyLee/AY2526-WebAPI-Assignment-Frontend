import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listFavourites, removeFavourite } from "../api/favourites-api";
import { deleteMessage, listMessages } from "../api/messages-api";
import { uploadProfilePhoto } from "../api/profile-api";
import { useAuth } from "../store/auth-store";
import { resolveAssetUrl } from "../utils/asset-url";

export function AccountPage() {
  const { setUser, token, user } = useAuth();
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: () => listMessages(token ?? ""),
    enabled: Boolean(token)
  });
  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(token ?? "", messageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    }
  });
  const favouritesQuery = useQuery({
    queryKey: ["favourites"],
    queryFn: () => listFavourites(token ?? ""),
    enabled: Boolean(token)
  });
  const removeFavouriteMutation = useMutation({
    mutationFn: (filmId: string) => removeFavourite(token ?? "", filmId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["favourites"] });
    }
  });
  const profilePhotoMutation = useMutation({
    mutationFn: (file: File) => uploadProfilePhoto(token ?? "", file),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    }
  });

  return (
    <section className="stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow eyebrow--dark">Member account</p>
          <h1>Your film message inbox.</h1>
          <p className="page-copy">
            Send enquiries from any film detail page, then return here to review administrator replies or remove old requests.
          </p>
        </div>
      </section>

      <section className="profile-card">
        <div className="profile-card__header">
          {user?.profilePhotoUrl ? (
            <img
              className="profile-card__avatar"
              src={resolveAssetUrl(user.profilePhotoUrl)}
              alt={`${user.displayName} profile`}
            />
          ) : (
            <div className="profile-card__avatar profile-card__avatar--placeholder">
              {user?.displayName?.slice(0, 1) ?? "?"}
            </div>
          )}
          <div>
            <p className="eyebrow eyebrow--dark">Signed in as</p>
            <h2>{user?.displayName ?? "Member"}</h2>
            <p className="profile-card__meta">{user?.email}</p>
          </div>
        </div>
        <label className="upload-field">
          <span>Profile photo</span>
          <input
            accept="image/png,image/jpeg,image/webp"
            disabled={profilePhotoMutation.isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                profilePhotoMutation.mutate(file);
              }
            }}
            type="file"
          />
        </label>
        {profilePhotoMutation.isSuccess ? <p className="status-inline">Profile photo updated.</p> : null}
        {profilePhotoMutation.isError ? <p className="error-text">Could not upload this profile photo.</p> : null}
      </section>

      <section className="stack">
        <section className="section-header">
          <div>
            <p className="eyebrow eyebrow--dark">Favourites</p>
            <h2>Your watchlist</h2>
          </div>
        </section>
        {favouritesQuery.isLoading ? <section className="status-card">Loading favourites...</section> : null}
        {favouritesQuery.isError ? (
          <section className="status-card status-card--error">Could not load your favourites.</section>
        ) : null}
        {!favouritesQuery.isLoading && !favouritesQuery.isError && favouritesQuery.data?.length ? (
          <section className="dashboard-list">
            {favouritesQuery.data.map((favourite) => (
              <article className="dashboard-list__item" key={favourite.id}>
                <div>
                  <p className="dashboard-list__meta">
                    {favourite.film.genre} · {favourite.film.releaseYear}
                  </p>
                  <h3>{favourite.film.title}</h3>
                  <p>{favourite.film.curatorNote}</p>
                </div>
                <button
                  className="button-link button-link--muted"
                  disabled={removeFavouriteMutation.isPending}
                  onClick={() => removeFavouriteMutation.mutate(favourite.film.id)}
                  type="button"
                >
                  Remove
                </button>
              </article>
            ))}
          </section>
        ) : null}
        {!favouritesQuery.isLoading && !favouritesQuery.isError && !favouritesQuery.data?.length ? (
          <section className="status-card">No favourite films yet.</section>
        ) : null}
      </section>

      <section className="stack">
        <section className="section-header">
          <div>
            <p className="eyebrow eyebrow--dark">Message history</p>
            <h2>Your conversation with the administrators</h2>
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
                      {message.film.title} · {message.status}
                    </p>
                    <h3>{message.subject}</h3>
                  </div>
                  <span className="message-card__stamp">{new Date(message.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{message.body}</p>
                {message.adminResponse ? (
                  <div className="reply-card">
                    <p className="eyebrow eyebrow--dark">Admin response</p>
                    <p>{message.adminResponse}</p>
                  </div>
                ) : null}
                <div className="button-row">
                  <button
                    className="button-link button-link--muted"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(message.id)}
                    type="button"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : null}
        {!messagesQuery.isLoading && !messagesQuery.isError && !messagesQuery.data?.length ? (
          <section className="status-card">You have not sent any messages yet.</section>
        ) : null}
      </section>
    </section>
  );
}
