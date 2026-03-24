import type { AuthUser } from "./auth";

export type MessageRecord = {
  id: string;
  subject: string;
  body: string;
  status: "OPEN" | "RESPONDED";
  adminResponse: string | null;
  createdAt: string;
  respondedAt: string | null;
  updatedAt: string;
  film: {
    id: string;
    title: string;
    slug: string;
  };
  sender: Pick<AuthUser, "id" | "email" | "displayName">;
  responder: Pick<AuthUser, "id" | "email" | "displayName"> | null;
};

export type CreateMessagePayload = {
  filmId: string;
  subject: string;
  body: string;
};
