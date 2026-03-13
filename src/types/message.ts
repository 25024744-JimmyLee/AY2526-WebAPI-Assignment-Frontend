import type { AuthUser } from "./auth";
import type { Film } from "./film";

export type MessageRecord = {
  id: string;
  subject: string;
  body: string;
  adminResponse?: string | null;
  respondedAt?: string | null;
  status: "OPEN" | "RESPONDED";
  createdAt: string;
  sender: Pick<AuthUser, "id" | "email" | "displayName" | "profilePhotoDataUrl">;
  responder?: Pick<AuthUser, "id" | "email" | "displayName" | "profilePhotoDataUrl"> | null;
  film: Pick<Film, "id" | "title" | "slug">;
};

export type MessagePayload = {
  filmId: string;
  subject: string;
  body: string;
};

export type MessageReplyPayload = {
  body: string;
};
