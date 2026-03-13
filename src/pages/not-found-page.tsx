import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found-card">
      <p className="eyebrow eyebrow--dark">404</p>
      <h1>The reel you requested is missing.</h1>
      <p className="page-copy">
        This route does not exist in the current archive. Return to the main catalogue and continue browsing from the curated collection.
      </p>
      <Link className="button-link" to="/">
        Return home
      </Link>
    </section>
  );
}
