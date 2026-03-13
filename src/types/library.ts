import type { Film } from "./film";

export type WatchStatus = "NONE" | "WATCHLIST" | "WATCHED";

export type LibraryCollections = {
  favourites: Film[];
  watchlist: Film[];
  watched: Film[];
};

export type FilmPreference = {
  filmId: string;
  isFavorite: boolean;
  watchStatus: WatchStatus | null;
  updatedAt: string;
};

export type PreferenceUpdatePayload = {
  isFavorite?: boolean;
  watchStatus?: WatchStatus;
};
