import type { Film } from "./film";

export type FavouriteFilm = {
  id: string;
  createdAt: string;
  film: Film;
};
