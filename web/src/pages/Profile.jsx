// web/src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  getUserStats,
  updateUserProfile,
  deleteUserAccount,
  logout,
  unlinkGoogleAccount,
  setPassword,
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
    commentCount: 0,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    emailNotifications: true,
  });
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getMe(), getUserStats()])
      .then(([userData, userStats]) => {
        setUser(userData);
        setFormData({
          name: userData?.name || "",
          bio: userData?.bio || "",
          location: userData?.location || "",
          website: userData?.website || "",
          emailNotifications: userData?.emailNotifications ?? true,
        });
        setAvatarUrl(userData?.avatarUrl || "");
        setStats(userStats);
      })
      .catch(console.error);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile({ avatarUrl });
      setUser(updatedUser);
      setShowAvatarModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    try {
      await setPassword(newPassword);
      alert("Mot de passe défini avec succès !");
      setShowPasswordModal(false);
      setNewPassword("");
      const updatedUser = await getMe();
      setUser(updatedUser);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la définition du mot de passe");
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir délier votre compte Google ?")) return;
    try {
      const updatedUser = await unlinkGoogleAccount();
      setUser(updatedUser);
      alert("Compte Google délié avec succès");
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de la suppression de la liaison");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "⚠️ ATTENTION : Cette action est IRRÉVERSIBLE !\n\nVous allez supprimer définitivement :\n- Votre compte\n- Tous vos projets\n- Toutes vos données\n\nÊtes-vous absolument sûr ?"
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted dark:text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec bannière */}
        <div className="bg-gradient-to-r from-primary to-secondary h-32 rounded-t-2xl"></div>

        {/* Carte principale du profil */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 -mt-20 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary text-5xl font-bold ring-4 ring-white dark:ring-slate-800">
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
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Modifier l'avatar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Infos principales */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-text dark:text-slate-100">
                  {user.name}
                </h1>
                {user.googleId && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Lié à Google
                  </span>
                )}
              </div>
              <p className="text-text-muted dark:text-slate-400 mb-2">{user.email}</p>
              {user.bio && (
                <p className="text-slate-600 dark:text-slate-400 mb-3 max-w-2xl">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {user.website}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Bouton modifier */}
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-md"
            >
              {isEditingProfile ? "Annuler" : "Modifier le profil"}
            </button>
          </div>
        </div>

        {/* Formulaire d'édition */}
        {isEditingProfile && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 animate-slideUp">
            <h2 className="text-2xl font-bold text-text dark:text-slate-100 mb-6">
              Modifier mes informations
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Paris, France"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://monsite.com"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Parlez de vous..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="notifications" className="text-sm font-medium text-text dark:text-slate-300">
                  Recevoir des notifications par email
                </label>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistiques */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-text dark:text-slate-100 mb-6">
                Mes Statistiques
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {stats.boardCount}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold mt-1">
                    Projets
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
                  <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                    {stats.listCount}
                  </p>
                  <p className="text-sm text-purple-800 dark:text-purple-300 font-semibold mt-1">
                    Listes
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                    {stats.cardCount}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-300 font-semibold mt-1">
                    Tâches
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl">
                  <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
                    {stats.commentCount}
                  </p>
                  <p className="text-sm text-orange-800 dark:text-orange-300 font-semibold mt-1">
                    Commentaires
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de sécurité */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-text dark:text-slate-100 mb-4">
                Sécurité
              </h3>
              <div className="space-y-3">
                {user.googleId ? (
                  <>
                    {!user.passwordHash && (
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                      >
                        Définir un mot de passe
                      </button>
                    )}
                    <button
                      onClick={handleUnlinkGoogle}
                      className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                    >
                      Délier Google
                    </button>
                  </>
                ) : (
                  <a
                    href="http://localhost:4000/api/auth/google"
                    className="block w-full text-center px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                  >
                    Lier à Google
                  </a>
                )}
              </div>
            </div>

            {/* Zone de danger */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-900/50 p-6">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Zone de Danger
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                La suppression de votre compte est définitive et irréversible.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-text dark:text-slate-100 mb-4">
              Modifier l'avatar
            </h3>
            <form onSubmit={handleAvatarUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemple.com/avatar.jpg"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {avatarUrl && (
                <div className="flex justify-center">
                  <img src={avatarUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-text dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-text dark:text-slate-100 mb-4">
              Définir un mot de passe
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Ajoutez un mot de passe pour pouvoir vous connecter sans Google.
            </p>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-muted dark:text-slate-400 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Définir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                  }}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-text dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}