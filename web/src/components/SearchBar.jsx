// web/src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../lib/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ boards: [], cards: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ boards: [], cards: [] });
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await globalSearch(query);
        setResults(data);
        setIsOpen(true);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const totalResults = results.boards.length + results.cards.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalResults);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalResults) % totalResults);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelectResult(selectedIndex);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectResult = (index) => {
    const totalBoards = results.boards.length;

    if (index < totalBoards) {
      const board = results.boards[index];
      navigate(`/board/${board.id}`);
    } else {
      const card = results.cards[index - totalBoards];
      navigate(`/board/${card.list.board.id}`);
      // Attendre que la page soit chargée puis ouvrir la carte
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        cardElement?.click();
      }, 500);
    }

    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const highlightMatch = (text, query) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 text-text dark:text-slate-100 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const totalResults = results.boards.length + results.cards.length;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Input de recherche */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des projets ou des cartes..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-text dark:text-slate-100 placeholder-slate-400"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hidden sm:block">
          ⌘K
        </kbd>
      </div>

      {/* Résultats */}
      {isOpen && totalResults > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto z-50 animate-slideUp">
          {/* Boards */}
          {results.boards.length > 0 && (
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2">
                Projets ({results.boards.length})
              </h3>
              {results.boards.map((board, index) => (
                <button
                  key={board.id}
                  onClick={() => handleSelectResult(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    selectedIndex === index
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text dark:text-slate-100 truncate">
                      {highlightMatch(board.title, query)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mis à jour {new Date(board.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Cards */}
          {results.cards.length > 0 && (
            <div className="p-3">
              <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2">
                Cartes ({results.cards.length})
              </h3>
              {results.cards.map((card, index) => {
                const globalIndex = results.boards.length + index;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectResult(globalIndex)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-primary/10 dark:bg-primary/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text dark:text-slate-100 mb-1 line-clamp-2">
                          {highlightMatch(card.title, query)}
                        </p>
                        {card.content && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                            {highlightMatch(card.content, query)}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          {card.labels.length > 0 && (
                            <div className="flex gap-1">
                              {card.labels.slice(0, 3).map((label) => (
                                <span
                                  key={label.id}
                                  className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                                  style={{ backgroundColor: label.color }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            dans <span className="font-medium">{card.list.title}</span> · {card.list.board.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {isOpen && totalResults === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 text-center z-50 animate-slideUp">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-text dark:text-slate-300 font-semibold mb-2">Aucun résultat trouvé</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Essayez avec d'autres mots-clés
          </p>
        </div>
      )}
    </div>
  );
}