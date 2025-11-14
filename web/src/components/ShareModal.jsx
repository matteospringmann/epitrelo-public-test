// web/src/components/ShareModal.jsx (NOUVEAU FICHIER)

import React, { useState } from "react";
import { createInvitationLink } from "../lib/api";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const Avatar = ({ user }) => (
  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
    {user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      <span>{getInitials(user.name)}</span>
    )}
  </div>
);

export default function ShareModal({ board, onClose }) {
  const [inviteLink, setInviteLink] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copier");

  const handleCreateInvite = async () => {
    try {
      const link = await createInvitationLink(board.id);
      setInviteLink(link);
    } catch (error) {
      console.error("Failed to create invite link:", error);
      alert("Seul le propriétaire du projet peut créer une invitation.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopyButtonText("Copié !");
    setTimeout(() => setCopyButtonText("Copier"), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text">
            Partager le tableau "{board.title}"
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Section Inviter par lien */}
          <div>
            <h3 className="font-semibold text-text mb-2">
              Inviter avec un lien
            </h3>
            {inviteLink ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full bg-surface border border-slate-300 rounded-lg p-2 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition w-24"
                >
                  {copyButtonText}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateInvite}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-semibold"
              >
                Créer un lien d'invitation
              </button>
            )}
          </div>

          {/* Section Inviter par e-mail (future fonctionnalité) */}
          <div className="opacity-50" title="Fonctionnalité à venir">
            <h3 className="font-semibold text-text mb-2">Inviter par e-mail</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Adresse e-mail..."
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                disabled
              />
              <button
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                disabled
              >
                Envoyer
              </button>
            </div>
          </div>

          {/* Section Membres */}
          <div>
            <h3 className="font-semibold text-text mb-3">Membres du tableau</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {(board.members || []).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar user={member} />
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-text-muted">{member.email}</p>
                    </div>
                  </div>
                  {member.id === board.ownerId && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Propriétaire
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
