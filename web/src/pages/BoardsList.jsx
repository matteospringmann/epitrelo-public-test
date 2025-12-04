// web/src/pages/BoardsList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  getBoards, 
  createBoard, 
  deleteBoard,
  addBoardToFavorites,
  removeBoardFromFavorites,
} from "../lib/api";
import FavoriteButton from "../components/FavoriteButton";

export default function BoardsList() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const newBoard = await createBoard({ title: newBoardTitle });
      setBoards((currentBoards) => [...currentBoards, { ...newBoard, isFavorite: false }]);
      setNewBoardTitle("");
      setIsCreating(false);
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

  const handleToggleFavorite = async (boardId, isFavorite) => {
    try {
      if (isFavorite) {
        await removeBoardFromFavorites(boardId);
      } else {
        await addBoardToFavorites(boardId);
      }
      
      setBoards((currentBoards) =>
        currentBoards.map((board) =>
          board.id === boardId
            ? { ...board, isFavorite: !isFavorite }
            : board
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
    }
  };

  const favoriteBoards = boards.filter(b => b.isFavorite);
  const regularBoards = boards.filter(b => !b.isFavorite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header modernisé avec gradient */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mes Espaces de Travail
              </h1>
              <p className="text-text-muted dark:text-slate-400 mt-1">
                {boards.length} {boards.length > 1 ? 'projets' : 'projet'} • Organisez et collaborez
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle view mode */}
              <div className="flex bg-surface rounded-lg p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  title="Vue grille"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  title="Vue liste"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau Projet
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Favoris */}
        {favoriteBoards.length > 0 && (
          <section className="mb-12 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text">Favoris</h2>
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                {favoriteBoards.length}
              </span>
            </div>
            <BoardsGrid boards={favoriteBoards} onDelete={handleDeleteBoard} onToggleFavorite={handleToggleFavorite} viewMode={viewMode} />
          </section>
        )}

        {/* Section Tous les projets */}
        <section className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text">
              {favoriteBoards.length > 0 ? 'Tous les projets' : 'Vos projets'}
            </h2>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              {regularBoards.length}
            </span>
          </div>
          <BoardsGrid 
            boards={regularBoards} 
            onDelete={handleDeleteBoard} 
            onToggleFavorite={handleToggleFavorite}
            viewMode={viewMode}
            showCreateCard={true}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            newBoardTitle={newBoardTitle}
            setNewBoardTitle={setNewBoardTitle}
            onCreateBoard={handleCreateBoard}
          />
        </section>

        {/* Empty state */}
        {boards.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text mb-2">Aucun projet pour le moment</h3>
            <p className="text-text-muted mb-6">Créez votre premier projet pour commencer à organiser votre travail</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Créer mon premier projet
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Composant Grid/List boards
function BoardsGrid({ boards, onDelete, onToggleFavorite, viewMode, showCreateCard, isCreating, setIsCreating, newBoardTitle, setNewBoardTitle, onCreateBoard }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {boards.map((board, index) => (
          <BoardCardList
            key={board.id}
            board={board}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
        {showCreateCard && isCreating && (
          <CreateBoardCardList
            newBoardTitle={newBoardTitle}
            setNewBoardTitle={setNewBoardTitle}
            onCreateBoard={onCreateBoard}
            onCancel={() => setIsCreating(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {boards.map((board, index) => (
        <BoardCard
          key={board.id}
          board={board}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
      {showCreateCard && isCreating && (
        <CreateBoardCard
          newBoardTitle={newBoardTitle}
          setNewBoardTitle={setNewBoardTitle}
          onCreateBoard={onCreateBoard}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </div>
  );
}

// Composant carte de board (grid)
function BoardCard({ board, onDelete, onToggleFavorite, style }) {
  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-primary/50 overflow-hidden animate-slideUp"
      style={style}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Link to={`/board/${board.id}`} className="block p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-bold text-lg text-text group-hover:text-primary transition-colors line-clamp-2 flex-1 pr-2">
            {board.title}
          </h2>
          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton
              isFavorite={board.isFavorite}
              onToggle={() => onToggleFavorite(board.id, board.isFavorite)}
              size="md"
            />
          </div>
        </div>
        
        {/* Métadonnées du board */}
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(board.updatedAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </Link>

      {/* Bouton delete */}
      <button
        onClick={(e) => onDelete(e, board.id)}
        className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all shadow-sm"
        title="Supprimer le projet"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// Composant carte de board (list)
function BoardCardList({ board, onDelete, onToggleFavorite, style }) {
  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-primary/50 animate-slideUp"
      style={style}
    >
      <Link to={`/board/${board.id}`} className="flex items-center gap-4 p-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-text group-hover:text-primary transition-colors truncate">
            {board.title}
          </h2>
          <p className="text-sm text-text-muted">
            Mis à jour le {new Date(board.updatedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
          <FavoriteButton
            isFavorite={board.isFavorite}
            onToggle={() => onToggleFavorite(board.id, board.isFavorite)}
            size="md"
          />
          <button
            onClick={(e) => onDelete(e, board.id)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-all"
            title="Supprimer le projet"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </Link>
    </div>
  );
}

// Composant création board (grid)
function CreateBoardCard({ newBoardTitle, setNewBoardTitle, onCreateBoard, onCancel }) {
  return (
    <form
      onSubmit={onCreateBoard}
      className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors animate-slideUp"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="font-bold text-text">Nouveau projet</h3>
      </div>
      <input
        autoFocus
        type="text"
        className="w-full bg-white border border-slate-300 rounded-lg p-3 mb-3 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
        placeholder="Nom du projet..."
        value={newBoardTitle}
        onChange={(e) => setNewBoardTitle(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary text-white py-2.5 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          disabled={!newBoardTitle.trim()}
        >
          Créer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 rounded-lg bg-slate-200 text-text font-semibold hover:bg-slate-300 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// Composant création board (list)
function CreateBoardCardList({ newBoardTitle, setNewBoardTitle, onCreateBoard, onCancel }) {
  return (
    <form
      onSubmit={onCreateBoard}
      className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors animate-slideUp"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <input
          autoFocus
          type="text"
          className="flex-1 bg-white border border-slate-300 rounded-lg p-2.5 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          placeholder="Nom du projet..."
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          disabled={!newBoardTitle.trim()}
        >
          Créer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg bg-slate-200 text-text font-semibold hover:bg-slate-300 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
