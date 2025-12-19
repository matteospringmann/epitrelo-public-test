// web/src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

// Composant pour l'icône Google
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.522 5.025A20.01 20.01 0 0 0 24 44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-11.303 8L24 36l5.909 5.192A20.01 20.01 0 0 0 44 24c0-1.341-.138-2.65-.389-3.917z"
    ></path>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post("/auth/login", { email, password });
      nav(redirectPath || "/boards");
    } catch (e) {
      setErr(e.response?.data?.error || "La connexion a échoué");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-extrabold text-primary tracking-tight"
          >
            EpiTrello
          </Link>
          <p className="mt-2 text-text-muted">
            Content de vous revoir ! Connectez-vous à votre compte.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-slate-200"
        >
          {err && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg text-center">
              {err}
            </div>
          )}

          <div>
            <label
              className="text-sm font-medium text-text-muted"
              htmlFor="email"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              type="email"
              required
            />
          </div>

          <div>
            <label
              className="text-sm font-medium text-text-muted"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="w-full rounded-lg bg-primary text-white py-3 font-semibold shadow-md hover:bg-primary-dark transition">
            Se connecter
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-text-muted">
                Ou continuer avec
              </span>
            </div>
          </div>

          <a
            href={`${import.meta.env.VITE_API_BASE}/auth/google`}
            className="w-full flex justify-center items-center gap-3 py-3 border border-slate-300 rounded-lg hover:bg-surface transition-colors"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold text-text-muted">
              Google
            </span>
          </a>

          <div className="text-sm text-center text-text-muted">
            Vous n'avez pas de compte ?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Inscrivez-vous
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
