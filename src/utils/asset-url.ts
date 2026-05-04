export function resolveAssetUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
  return `${baseUrl}${path}`;
}
