import React, { useState } from "react";
import { themes } from "../lib/themes";

export default function ThemeSelector({
  currentThemeId,
  onSelectTheme,
  onClose,
}) {
  const [category, setCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tous", icon: "🎨" },
    { id: "gradient", name: "Gradients", icon: "🌈" },
    { id: "image", name: "Images", icon: "🖼️" },
    { id: "pattern", name: "Patterns", icon: "✨" },
  ];

  const filteredThemes =
    category === "all"
      ? themes
      : themes.filter((t) => t.type === category || (!t.type && category === "gradient"));

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text dark:text-slate-100">
            Changer le fond d'écran
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="px-6 pt-4 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                category === cat.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className="cursor-pointer group"
            >
              <div
                className={`h-28 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                  currentThemeId === theme.id
                    ? "ring-4 ring-primary ring-offset-2 dark:ring-offset-slate-800"
                    : "group-hover:ring-2 group-hover:ring-primary"
                }`}
                style={{
                  background: theme.preview,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {currentThemeId === theme.id && (
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-primary"
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
              <p className="text-center mt-2 font-semibold text-sm text-text dark:text-slate-300">
                {theme.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
