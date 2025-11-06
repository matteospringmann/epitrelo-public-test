import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { acceptInvitation, getMe } from "../lib/api";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  const handleAccept = async () => {
    try {
      const boardId = await acceptInvitation(token);
      navigate(`/board/${boardId}`);
    } catch (err) {
      setError(
        "Impossible d'accepter l'invitation. Elle est peut-être invalide ou expirée.",
      );
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Rejoindre le projet</h1>
        <p className="text-text-muted mb-6">
          Veuillez vous connecter ou vous inscrire pour accepter cette
          invitation.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(`/login?redirect=/invite/${token}`)}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Se connecter
          </button>
          <Link
            to={`/register?redirect=/invite/${token}`}
            className="px-4 py-2 bg-slate-200 text-text rounded-lg"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Vous avez été invité à rejoindre un projet.
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleAccept}
        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-dark"
      >
        Accepter l'invitation
      </button>
    </div>
  );
}
