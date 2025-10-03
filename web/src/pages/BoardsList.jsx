// web/src/pages/BoardsList.jsx (Version Corrigée)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBoards, createBoard, deleteBoard } from "../lib/api";

export default function BoardsList() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const newBoard = await createBoard({ title: newBoardTitle });
      setBoards((currentBoards) => [...currentBoards, newBoard]);
      setNewBoardTitle("");
    } catch (error) {
      console.error("Erreur lors de la création du board:", error);
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet et toutes ses données ?",
      )
    ) {
      try {
        await deleteBoard(boardId);
        setBoards((currentBoards) =>
          currentBoards.filter((b) => b.id !== boardId),
        );
      } catch (error) {
        console.error("Erreur lors de la suppression du board:", error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-text">
          Mes Espaces de Travail
        </h1>
        <p className="text-text-muted">Choisissez un projet pour commencer.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="group relative block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200"
          >
            <Link to={`/board/${board.id}`} className="block p-6">
              <h2 className="font-bold text-lg text-primary">{board.title}</h2>
            </Link>
            <button
              onClick={(e) => handleDeleteBoard(e, board.id)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
              title="Supprimer le projet"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Formulaire pour créer un nouveau board */}
        <form
          onSubmit={handleCreateBoard}
          className="p-6 bg-surface rounded-xl border-2 border-dashed border-slate-300 flex flex-col justify-center"
        >
          <input
            className="w-full bg-white border border-slate-300 rounded-lg p-2 mb-3 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="Nouveau projet..."
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary/80 text-white py-2 font-semibold shadow hover:bg-primary transition disabled:opacity-50"
            disabled={!newBoardTitle.trim()}
          >
            Créer un board
          </button>
        </form>
      </div>
    </div>
  );
}
