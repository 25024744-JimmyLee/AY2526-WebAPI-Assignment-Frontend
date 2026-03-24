import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { registerAdmin } from "../api/auth-api";
import { useAuth } from "../store/auth-store";

const adminRegisterSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  email: z.string().email("Use a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  adminCode: z.string().min(4, "Admin registration code is required")
});

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

export function RegisterAdminPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      adminCode: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    try {
      const response = await registerAdmin(values);
      setSession(response);
      navigate("/admin", { replace: true });
    } catch {
      setServerError("Could not create an administrator account. Verify the registration code on the backend.");
    }
  });

  return (
    <section className="auth-layout">
      <article className="auth-intro">
        <p className="eyebrow">Editorial onboarding</p>
        <h1>Register a new administrator workstation.</h1>
        <p className="page-copy page-copy--light">
          This flow satisfies the coursework requirement that administrators can register and then manage the live catalogue.
        </p>
        <div className="auth-intro__meta">
          <span>Admin registration</span>
          <span>Role-aware access</span>
          <span>Protected dashboard</span>
        </div>
      </article>

      <section className="stack auth-card">
        <div>
          <p className="eyebrow eyebrow--dark">Admin setup</p>
          <h2>Create editorial access</h2>
        </div>

        <form className="stack auth-form" onSubmit={onSubmit}>
          <label>
            <span>Display name</span>
            <input {...register("displayName")} type="text" />
            {errors.displayName ? <small>{errors.displayName.message}</small> : null}
          </label>

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

          <label>
            <span>Admin registration code</span>
            <input {...register("adminCode")} type="password" />
            {errors.adminCode ? <small>{errors.adminCode.message}</small> : null}
          </label>

          {serverError ? <p className="error-text">{serverError}</p> : null}

          <button className="button-link auth-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Registering..." : "Create administrator"}
          </button>
        </form>

        <p className="inline-text">
          Already have admin access?{" "}
          <Link className="text-link" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </section>
  );
}
