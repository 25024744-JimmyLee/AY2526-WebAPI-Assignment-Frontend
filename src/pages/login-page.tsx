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
      setSession({
        token: response.token,
        user: response.user
      });

      navigate(redirectTarget ?? (response.user.role === "ADMIN" ? "/admin" : "/account"), { replace: true });
    } catch {
      setServerError("Login failed. Start the backend API and verify the credentials.");
    }
  });

  return (
    <section className="auth-layout">
      <article className="auth-intro">
        <p className="eyebrow">CinemaVault access</p>
        <h1>Sign in to your workspace.</h1>
        <p className="page-copy page-copy--light">
          Standard users sign in to read and manage film messages. Administrators sign in to manage the catalogue and reply to enquiries.
        </p>
        <div className="auth-intro__meta">
          <span>JWT login</span>
          <span>User inbox</span>
          <span>Admin dashboard</span>
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
          Need an account?{" "}
          <Link className="text-link" to="/signup">
            Sign up
          </Link>
          {" · "}
          <Link className="text-link" to="/register-admin">
            Admin register
          </Link>
        </p>
      </section>
    </section>
  );
}
