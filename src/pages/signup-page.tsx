import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { register } from "../api/auth-api";
import { useAuth } from "../store/auth-store";

const signupSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  email: z.string().email("Use a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register: bind
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    try {
      const response = await register(values);
      setSession(response);
      navigate("/account", { replace: true });
    } catch {
      setServerError("Could not create your account. Check whether the backend supports user registration.");
    }
  });

  return (
    <section className="stack">
      <section className="auth-layout">
        <article className="auth-intro">
          <p className="eyebrow">Member access</p>
          <h1>Save favourites, queue titles, and message the editorial team.</h1>
          <p className="page-copy page-copy--light">
            Regular members get a personal cinema desk with watchlist tracking, watched history, favourites, and direct interest messages for any film in the catalogue.
          </p>
          <div className="auth-intro__meta">
            <span>Member signup</span>
            <span>Favourites</span>
            <span>Watch progress</span>
          </div>
        </article>

        <section className="stack auth-card">
          <div>
            <p className="eyebrow eyebrow--dark">Create account</p>
            <h2>Join the archive</h2>
          </div>

          <form className="stack auth-form" onSubmit={onSubmit}>
            <label>
              <span>Display name</span>
              <input {...bind("displayName")} type="text" />
              {errors.displayName ? <small>{errors.displayName.message}</small> : null}
            </label>

            <label>
              <span>Email</span>
              <input {...bind("email")} type="email" />
              {errors.email ? <small>{errors.email.message}</small> : null}
            </label>

            <label>
              <span>Password</span>
              <input {...bind("password")} type="password" />
              {errors.password ? <small>{errors.password.message}</small> : null}
            </label>

            {serverError ? <p className="error-text">{serverError}</p> : null}

            <button className="button-link auth-form__submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="inline-text">
            Already registered?{" "}
            <Link className="text-link" to="/login">
              Sign in
            </Link>
          </p>
        </section>
      </section>
    </section>
  );
}
