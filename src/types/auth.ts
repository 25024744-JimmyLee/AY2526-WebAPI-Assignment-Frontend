export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  profilePhotoUrl?: string | null;
  role: "ADMIN" | "USER";
};
