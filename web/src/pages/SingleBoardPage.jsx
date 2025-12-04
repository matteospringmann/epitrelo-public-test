import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBoardById,
  createList,
  createCard,
  deleteCard,
  updateCard,
  updateBoard,
  addBoardToFavorites,
  removeBoardFromFavorites,
  updateList,
  deleteList,
} from "../lib/api";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";

// --- Components ---
import CardModal from "../components/CardModal";
import ShareModal from "../components/ShareModal";
import ThemeSelector from "../components/ThemeSelector";
import ShortcutsModal from "../components/ShortcutsModal";
import Avatar from "../components/Avatar";
import FavoriteButton from "../components/FavoriteButton";

// --- Hooks ---
import useHotkeys from "../lib/useHotkeys";

// --- Libs ---
import { themes } from "../lib/themes";

const getDeadlineStyle = (deadline) => {
  if (!deadline) return "";
  const now = new Date();
  const deadlineDate = new Date(deadline);
  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "bg-red-500/90 text-white";
  if (diffDays <= 2) return "bg-amber-500/90 text-white";
  return "bg-emerald-500/90 text-white";
};

// Composant Card modernisé
function Card({ card, onDelete, onOpenModal }) {
  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200/60 hover:border-primary/40 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
      onClick={onOpenModal}
    >
      {/* Image de couverture si présente */}
      {card.coverUrl && (
        <div className="h-32 w-full rounded-t-xl overflow-hidden">
          <img
            src={card.coverUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Labels */}
        {card.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: label.color }}
                title={label.name}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Titre */}
        <h3 className="font-semibold text-text mb-3 line-clamp-3 group-hover:text-primary transition-colors">
          {card.title}
        </h3>

        {/* Métadonnées */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Description indicator */}
            {card.content && (
              <div
                className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md"
                title="Cette carte a une description"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
            )}

            {/* Commentaires */}
            {card.comments?.length > 0 && (
              <div
                className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md"
                title={`${card.comments.length} commentaire(s)`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">{card.comments.length}</span>
              </div>
            )}

            {/* Deadline */}
            {card.deadline && (
              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md shadow-sm ${getDeadlineStyle(
                  card.deadline
                )}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {new Date(card.deadline).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            )}
          </div>

          {/* Avatar utilisateur assigné */}
          {card.assignedUser && (
            <div className="relative group/avatar">
              <Avatar
                user={card.assignedUser}
                className="w-7 h-7 ring-2 ring-white shadow-sm"
              />
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/avatar:block z-10">
                <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {card.assignedUser.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton delete avec meilleur positionnement */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-md"
        title="Supprimer la carte"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

function SortableCard({ card, onDelete, onOpenModal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <Card card={card} onDelete={onDelete} onOpenModal={onOpenModal} />
    </div>
  );
}

// Composant AddCardForm modernisé
function AddCardForm({ onAdd, isEditing, setIsEditing }) {
  const [title, setTitle] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsEditing(false);
      return;
    }
    onAdd(title);
    setTitle("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full text-left text-sm px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-200/60 hover:text-text transition-all flex items-center gap-2 group"
      >
        <svg
          className="w-4 h-4 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Ajouter une carte</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        ref={textareaRef}
        className="w-full border-2 border-primary/20 focus:border-primary rounded-xl p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-white"
        placeholder="Saisissez un titre pour cette carte..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
        rows={3}
      />
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
          type="submit"
        >
          Ajouter
        </button>
        <button
          onClick={() => setIsEditing(false)}
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 hover:text-text transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

// Composant EditableListTitle modernisé
function EditableListTitle({ list, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      setTitle(list.title);
      setIsEditing(false);
      return;
    }
    if (title.trim() !== list.title) {
      await onUpdate({ ...list, title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(list.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="font-bold text-lg mb-3 text-text px-2 py-1 bg-white border-2 border-primary rounded-lg focus:outline-none w-full shadow-sm"
        autoFocus
        maxLength={50}
      />
    );
  }

  return (
    <div className="flex items-center justify-between mb-3 group/header">
      <h2
        onClick={() => setIsEditing(true)}
        className="font-bold text-lg text-text px-2 py-1 cursor-pointer hover:bg-slate-200/60 rounded-lg transition-colors flex-1"
        title="Cliquer pour modifier"
      >
        {list.title}
      </h2>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-text opacity-0 group-hover/header:opacity-100 transition-all"
          title="Actions de la liste"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20">
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Renommer
            </button>
            <button
              onClick={() => {
                if (window.confirm("Supprimer cette liste et toutes ses cartes ?")) {
                  onDelete(list.id);
                }
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer la liste
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant ListContainer modernisé
function ListContainer({
  list,
  onAddCard,
  onDeleteCard,
  onOpenModal,
  isCardEditing,
  setIsCardEditing,
  onUpdateList,
  onDeleteList,
}) {
  const { setNodeRef } = useSortable({ id: list.id, data: { type: "list" } });
  const cardCount = list.cards?.length || 0;

  return (
    <div
      ref={setNodeRef}
      className="list-container bg-slate-100/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-4 w-80 flex-shrink-0 flex flex-col shadow-md hover:shadow-lg transition-shadow border border-slate-200/60 dark:border-slate-700/60"
    >
      <EditableListTitle list={list} onUpdate={onUpdateList} onDelete={onDeleteList} />

      {/* Compteur de cartes */}
      <div className="text-xs text-slate-500 mb-3 px-2">
        {cardCount} {cardCount > 1 ? 'cartes' : 'carte'}
      </div>

      <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 mb-3 min-h-[60px] max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
          {list.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(list.id, card.id)}
              onOpenModal={() => onOpenModal(card)}
            />
          ))}
        </div>
      </SortableContext>

      <AddCardForm
        onAdd={(title) => onAddCard(list.id, title)}
        isEditing={isCardEditing}
        setIsEditing={setIsCardEditing}
      />
    </div>
  );
}

export default function SingleBoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const newListInputRef = useRef(null);
  const [hoveredListId, setHoveredListId] = useState(null);
  const [editingCardInList, setEditingCardInList] = useState(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const handleCreateListShortcut = useCallback(() => {
    newListInputRef.current?.focus();
  }, []);

  const handleCreateCardShortcut = useCallback(() => {
    if (hoveredListId) {
      setEditingCardInList(hoveredListId);
    }
  }, [hoveredListId]);

  const toggleShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen((prev) => !prev);
  }, []);

  useHotkeys("n", handleCreateListShortcut);
  useHotkeys("c", handleCreateCardShortcut, [hoveredListId]);
  useHotkeys("?", toggleShortcutsModal);

  const fetchBoard = () => {
    if (boardId) {
      getBoardById(boardId)
        .then((data) => {
          setBoard(data);
          setLists(data.lists || []);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const handleOpenModal = (card) => setSelectedCard(card);
  const handleCloseModal = () => setSelectedCard(null);

  const handleCardUpdate = (updatedCard) => {
    setLists((currentLists) =>
      currentLists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
      }))
    );
    if (selectedCard && selectedCard.id === updatedCard.id) {
      setSelectedCard(updatedCard);
    }
  };

  const handleThemeChange = async (themeId) => {
    await updateBoard(boardId, { background: themeId });
    setBoard((prev) => ({ ...prev, background: themeId }));
    setIsThemeSelectorOpen(false);
  };

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const newList = await createList({ title: newListTitle, boardId: Number(boardId) });
    setLists((current) => [...current, { ...newList, cards: [] }]);
    setNewListTitle("");
  }

  async function handleAddCard(listId, cardTitle) {
    if (!cardTitle.trim()) return;
    const newCard = await createCard({ title: cardTitle, listId });
    setLists((current) =>
      current.map((list) => (list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list))
    );
  }

  async function handleDeleteCard(listId, cardId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      await deleteCard(cardId);
      setLists((current) =>
        current.map((list) => (list.id === listId ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) } : list))
      );
    }
  }

  const handleUpdateList = async (updatedList) => {
    await updateList(updatedList.id, { title: updatedList.title });
    setLists((currentLists) => currentLists.map((list) => (list.id === updatedList.id ? updatedList : list)));
  };

  const handleDeleteList = async (listId) => {
    await deleteList(listId);
    setLists((currentLists) => currentLists.filter((list) => list.id !== listId));
  };

  function findListForCard(cardId, currentLists) {
    return currentLists.find((list) => list.cards.some((card) => card.id === cardId));
  }

  function handleDragStart(event) {
    const { active } = event;
    const card = lists.flatMap((list) => list.cards).find((c) => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    setLists((currentLists) => {
      const activeList = findListForCard(activeId, currentLists);
      const overList = currentLists.find((list) => list.id === overId || list.cards.some((card) => card.id === overId));
      if (!activeList || !overList) return currentLists;

      if (activeList.id === overList.id) {
        const oldIndex = activeList.cards.findIndex((c) => c.id === activeId);
        const newIndex = overList.cards.findIndex((c) => c.id === overId);
        return currentLists.map((list) =>
          list.id === activeList.id ? { ...list, cards: arrayMove(list.cards, oldIndex, newIndex) } : list
        );
      } else {
        const newLists = [...currentLists];
        const activeListIndex = newLists.findIndex((l) => l.id === activeList.id);
        const overListIndex = newLists.findIndex((l) => l.id === overList.id);
        const activeCardIndex = activeList.cards.findIndex((c) => c.id === activeId);
        const [movedCard] = newLists[activeListIndex].cards.splice(activeCardIndex, 1);
        let overCardIndex = overList.cards.findIndex((c) => c.id === overId);
        if (overCardIndex === -1) {
          overCardIndex = overList.cards.length;
        }
        newLists[overListIndex].cards.splice(overCardIndex, 0, movedCard);
        updateCard(activeId, { listId: overList.id }).catch(console.error);
        return newLists;
      }
    });
  }

  const handleToggleFavorite = async () => {
    try {
      if (board.isFavorite) {
        await removeBoardFromFavorites(board.id);
      } else {
        await addBoardToFavorites(board.id);
      }
      setBoard((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
    }
  };

  const currentTheme = themes.find((t) => t.id === board?.background);
  const themeClassName = currentTheme?.className || "bg-background dark:bg-slate-900";
  const themeStyle = currentTheme?.style || {};

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={`min-h-screen transition-all duration-500 ${themeClassName}`}
        style={themeStyle}
      >
        {/* Overlay pour améliorer la lisibilité sur les images de fond */}
        {currentTheme?.type === "image" && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 pointer-events-none z-0" />
        )}

        <div className="relative z-10">
          {/* Header avec design amélioré */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-30 shadow-sm">
            <div className="max-w-[1920px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/boards"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors group"
                    >
                      <svg
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Retour
                    </Link>
                    <div className="w-px h-6 bg-slate-300"></div>
                    <h1 className="text-2xl font-extrabold text-text">{board.title}</h1>
                    <FavoriteButton isFavorite={board?.isFavorite} onToggle={handleToggleFavorite} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsThemeSelectorOpen(true)}
                    className="px-4 py-2 bg-white/50 hover:bg-white/80 text-text font-medium rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm transition-all flex items-center gap-2 border border-slate-200/60"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Thème
                  </button>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Partager
                  </button>
                  <button
                    onClick={toggleShortcutsModal}
                    className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white/80 rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm transition-all border border-slate-200/60"
                    title="Raccourcis clavier (?)"
                  >
                    <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-6 pb-6 min-h-[calc(100vh-120px)] items-start">
              {lists.map((list) => (
                <div
                  key={list.id}
                  onMouseEnter={() => setHoveredListId(list.id)}
                  onMouseLeave={() => setHoveredListId(null)}
                >
                  <ListContainer
                    list={list}
                    onAddCard={handleAddCard}
                    onDeleteCard={handleDeleteCard}
                    onOpenModal={handleOpenModal}
                    isCardEditing={editingCardInList === list.id}
                    setIsCardEditing={(isEditing) => setEditingCardInList(isEditing ? list.id : null)}
                    onUpdateList={handleUpdateList}
                    onDeleteList={handleDeleteList}
                  />
                </div>
              ))}

              {/* Formulaire ajout de liste modernisé */}
              <div className="w-80 flex-shrink-0">
                <form
                  onSubmit={handleAddList}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-slate-200/60 hover:shadow-lg transition-shadow"
                >
                  <input
                    ref={newListInputRef}
                    className="w-full bg-white border-2 border-slate-200 focus:border-primary rounded-xl p-3 mb-3 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                    placeholder="+ Ajouter une liste"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <button
                    className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white py-3 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newListTitle.trim()}
                  >
                    Ajouter
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCard && createPortal(<CardModal card={selectedCard} board={board} onClose={handleCloseModal} onCardUpdate={handleCardUpdate} onBoardUpdate={fetchBoard} />, document.body)}
      {isShareModalOpen && createPortal(<ShareModal board={board} onClose={() => setIsShareModalOpen(false)} />, document.body)}
      {isThemeSelectorOpen && createPortal(<ThemeSelector currentThemeId={board.background} onSelectTheme={handleThemeChange} onClose={() => setIsThemeSelectorOpen(false)} />, document.body)}
      {isShortcutsModalOpen && createPortal(<ShortcutsModal onClose={() => setIsShortcutsModalOpen(false)} />, document.body)}
      {createPortal(<DragOverlay>{activeCard ? <Card card={activeCard} onDelete={() => {}} onOpenModal={() => {}} /> : null}</DragOverlay>, document.body)}
    </DndContext>
  );
}
