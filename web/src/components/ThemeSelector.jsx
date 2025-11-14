import React from "react";
import { themes } from "../lib/themes";

export default function ThemeSelector({
  currentThemeId,
  onSelectTheme,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text">
            Changer le fond d'écran
          </h2>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className="cursor-pointer group"
            >
              <div
                className={`h-24 rounded-lg flex items-center justify-center transition-all ${theme.className} ${currentThemeId === theme.id ? "ring-4 ring-primary ring-offset-2" : "group-hover:ring-2 group-hover:ring-primary"}`}
              >
                {currentThemeId === theme.id && (
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-center mt-2 font-semibold text-sm">
                {theme.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
