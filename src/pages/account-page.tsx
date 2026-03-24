import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteMessage, listMessages } from "../api/messages-api";
import { useAuth } from "../store/auth-store";

export function AccountPage() {
  const { token, user } = useAuth();
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
          <div className="profile-card__avatar profile-card__avatar--placeholder">
            {user?.displayName?.slice(0, 1) ?? "?"}
          </div>
          <div>
            <p className="eyebrow eyebrow--dark">Signed in as</p>
            <h2>{user?.displayName ?? "Member"}</h2>
            <p className="profile-card__meta">{user?.email}</p>
          </div>
        </div>
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
