export type SocialPostRecord = {
  id: string;
  provider: string;
  status: "SENT" | "SKIPPED" | "FAILED";
  responseSummary: string | null;
  createdAt: string;
  film: {
    id: string;
    title: string;
    slug: string;
  };
  errorMessage?: string | null;
};
