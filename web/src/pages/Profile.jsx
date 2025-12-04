// web/src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  getUserStats,
  updateUserProfile,
  deleteUserAccount,
  logout,
} from "../lib/api";

// Petite fonction utilitaire pour obtenir les initiales
const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    boardCount: 0,
    listCount: 0,
    cardCount: 0,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getMe(), getUserStats()])
      .then(([userData, userStats]) => {
        setUser(userData);
        setName(userData?.name || "");
        setStats(userStats);
      })
      .catch(console.error);
  }, []);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || name === user.name) {
      setIsEditingName(false);
      return;
    }
    try {
      const updatedUser = await updateUserProfile({ name });
      setUser(updatedUser);
      setIsEditingName(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Êtes-vous absolument sûr ? Cette action est irréversible et supprimera tous vos projets.",
      )
    ) {
      try {
        await deleteUserAccount();
        await logout();
        navigate("/register");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
      }
    }
  };

  if (!user) {
    return <div className="p-8 text-center dark:text-slate-300">Chargement...</div>;
  }

  return (
    <div className="bg-background dark:bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* --- Section Avatar et Infos Principales --- */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary text-5xl font-bold">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
          </div>
          <div className="text-center sm:text-left">
            {isEditingName ? (
              <form
                onSubmit={handleNameUpdate}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                >
                  Sauvegarder
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-extrabold text-text dark:text-slate-100">
                  {user.name}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  title="Modifier le nom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-text-muted dark:text-slate-400 hover:text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-text-muted dark:text-slate-400 mt-1">{user.email}</p>
            <p className="text-sm text-text-muted dark:text-slate-400 mt-2">
              Membre depuis le{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        {/* --- Section Statistiques --- */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-text dark:text-slate-100 mb-4">Votre Activité</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-text-muted dark:text-slate-400">Projets</h3>
              <p className="text-4xl font-extrabold text-primary mt-2">
                {stats.boardCount}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-text-muted dark:text-slate-400">Listes</h3>
              <p className="text-4xl font-extrabold text-primary mt-2">
                {stats.listCount}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-text-muted dark:text-slate-400">Tâches</h3>
              <p className="text-4xl font-extrabold text-primary mt-2">
                {stats.cardCount}
              </p>
            </div>
          </div>
        </div>

        {/* --- Zone de Danger --- */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            Zone de Danger
          </h2>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-red-200 dark:border-red-900">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h3 className="font-bold text-text dark:text-slate-100">Supprimer le compte</h3>
                <p className="text-sm text-text-muted dark:text-slate-400 mt-1">
                  Cette action est irréversible et supprimera toutes vos
                  données.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
