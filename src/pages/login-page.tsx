import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { login } from "../api/auth-api";
import { useAuth } from "../store/auth-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState("");
  const redirectTarget = (location.state as { from?: string } | null)?.from;

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    try {
      const response = await login(values);

      if (response.user.role !== "ADMIN") {
        setServerError("Only administrator accounts can access the management workspace.");
        return;
      }

      setSession({
        token: response.token,
        user: response.user
      });

      navigate(redirectTarget ?? "/admin", { replace: true });
    } catch {
      setServerError("Login failed. Start the backend API and verify the credentials.");
    }
  });

  return (
    <section className="auth-layout">
      <article className="auth-intro">
        <p className="eyebrow">CinemaVault access</p>
        <h1>Sign in to the editorial desk.</h1>
        <p className="page-copy page-copy--light">
          This entry point is reserved for platform administrators who manage the live catalogue and film records.
        </p>
        <div className="auth-intro__meta">
          <span>JWT login</span>
          <span>Admin register</span>
          <span>Protected dashboard</span>
        </div>
      </article>

      <section className="stack auth-card">
        <div>
          <p className="eyebrow eyebrow--dark">Secure sign-in</p>
          <h2>Continue to your workspace</h2>
        </div>

        <form className="stack auth-form" onSubmit={onSubmit}>
          <label>
            <span>Email</span>
            <input {...register("email")} type="email" />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>

          <label>
            <span>Password</span>
            <input {...register("password")} type="password" />
            {errors.password ? <small>{errors.password.message}</small> : null}
          </label>

          {serverError ? <p className="error-text">{serverError}</p> : null}

          <button className="button-link auth-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="inline-text">
          Need admin access?{" "}
          <Link className="text-link" to="/register-admin">
            Admin register
          </Link>
        </p>
      </section>
    </section>
  );
}
