// web/src/components/Avatar.jsx
import React from "react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function Avatar({ user, className = "w-8 h-8" }) {
  if (!user) return null;

  return (
    <div
      title={user.name}
      className={`rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 ${className}`}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs">{getInitials(user.name)}</span>
      )}
    </div>
  );
}
