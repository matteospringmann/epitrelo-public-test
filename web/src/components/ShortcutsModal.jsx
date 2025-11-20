// web/src/components/ShortcutsModal.jsx
import React from "react";

export default function ShortcutsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Raccourcis Clavier</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Créer une nouvelle liste</span>{" "}
            <kbd className="font-mono bg-slate-200 px-2 py-1 rounded">n</kbd>
          </li>
          <li className="flex justify-between">
            <span>Créer une nouvelle carte (sur la liste survolée)</span>{" "}
            <kbd className="font-mono bg-slate-200 px-2 py-1 rounded">c</kbd>
          </li>
          <li className="flex justify-between">
            <span>Afficher/Cacher cette aide</span>{" "}
            <kbd className="font-mono bg-slate-200 px-2 py-1 rounded">?</kbd>
          </li>
        </ul>
      </div>
    </div>
  );
}
