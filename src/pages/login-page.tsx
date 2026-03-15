import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { setToken } = useAuth();
  const [serverError, setServerError] = useState("");
  const redirectTarget = (location.state as { from?: string } | null)?.from ?? "/admin";

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
      setToken(response.token);
      navigate(redirectTarget, { replace: true });
    } catch {
      setServerError("Login failed. Start the backend API and verify the credentials.");
    }
  });

  return (
    <section className="auth-layout">
      <article className="auth-intro">
        <p className="eyebrow">Editorial access</p>
        <h1>Enter the archive control room.</h1>
        <p className="page-copy page-copy--light">
          Administrators use this entry point to publish titles, refine metadata, and keep the public catalogue consistent with the backend record.
        </p>
        <div className="auth-intro__meta">
          <span>JWT login</span>
          <span>Protected routes</span>
          <span>Role-based flow</span>
        </div>
      </article>

      <section className="stack auth-card">
        <div>
          <p className="eyebrow eyebrow--dark">Admin login</p>
          <h2>Sign in to continue</h2>
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
      </section>
    </section>
  );
}
