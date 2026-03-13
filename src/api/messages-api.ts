import { createAuthorizedConfig, http } from "./http";
import type { CreateMessagePayload, MessageRecord } from "../types/message";

type MessagesResponse = {
  items: MessageRecord[];
};

type MessageResponse = {
  item: MessageRecord;
};

export async function listMessages(token: string) {
  const response = await http.get<MessagesResponse>("/api/messages", createAuthorizedConfig(token));
  return response.data.items;
}

export async function createMessage(token: string, payload: CreateMessagePayload) {
  const response = await http.post<MessageResponse>("/api/messages", payload, createAuthorizedConfig(token));
  return response.data.item;
}

export async function replyToMessage(token: string, messageId: string, payload: { body: string }) {
  const response = await http.post<MessageResponse>(
    `/api/messages/${messageId}/reply`,
    { response: payload.body },
    createAuthorizedConfig(token)
  );
  return response.data.item;
}

export async function deleteMessage(token: string, messageId: string) {
  await http.delete(`/api/messages/${messageId}`, createAuthorizedConfig(token));
}
