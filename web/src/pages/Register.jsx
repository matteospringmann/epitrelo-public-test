// web/src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  // Récupère l'URL de redirection (ex: /invite/abc)
  const redirectPath = searchParams.get("redirect") || "/boards";

  // URL de base de l'API (ex: https://api.render.com/api)
  const apiBase = import.meta.env.VITE_API_BASE || "/api";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      // On utilise l'instance axios "api" définie dans lib/api.js
      await api.post("/auth/register", { name, email, password });
      nav(redirectPath);
    } catch (e) {
      setErr(
        e.response?.data?.error ||
          "L'inscription a échoué. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
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
            Créez votre compte et commencez à organiser vos projets.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          {err && (
            <div className="mb-6 bg-red-50 text-red-700 text-sm p-3 rounded-lg text-center border border-red-100">
              {err}
            </div>
          )}

          {/* Bouton Google OAuth */}
          <a
            href={`${apiBase}/auth/google`}
            className="w-full flex justify-center items-center gap-3 py-3 border border-slate-300 rounded-lg hover:bg-surface transition-colors mb-6 shadow-sm"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold text-text-muted">
              S'inscrire avec Google
            </span>
          </a>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-text-muted uppercase tracking-wider text-xs">
                Ou avec un e-mail
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-semibold text-text mb-1"
                htmlFor="name"
              >
                Nom complet
              </label>
              <input
                id="name"
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition placeholder:text-slate-400"
                placeholder="Ex: Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-text mb-1"
                htmlFor="email"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition placeholder:text-slate-400"
                placeholder="jean@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-text mb-1"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                id="password"
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition placeholder:text-slate-400"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button
              disabled={isLoading}
              className={`w-full rounded-lg bg-primary text-white py-3 font-bold shadow-md hover:bg-primary-dark transition-all transform active:scale-[0.98] ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-8 text-sm text-center text-text-muted">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary-dark hover:underline"
            >
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
