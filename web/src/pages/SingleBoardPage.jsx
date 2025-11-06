// web/src/pages/SingleBoardPage.jsx (Version corrigée)

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBoardById,
  createList,
  createCard,
  deleteCard,
  updateCard,
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
import CardModal from "../components/CardModal";

function Card({ card, onDelete, onOpenModal }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md border border-slate-200 group relative cursor-pointer hover:border-primary"
      onClick={onOpenModal}
    >
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels?.map((label) => (
            <div
              key={label.id}
              className="h-2 w-10 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            ></div>
          ))}
        </div>
        <p className="font-semibold text-text">{card.title}</p>
        <div className="flex items-center gap-3 mt-2">
          {card.content && (
            <div
              className="text-xs text-text-muted flex items-center gap-1"
              title="Cette carte a une description"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
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
          {card.comments?.length > 0 && (
            <div
              className="text-xs text-text-muted flex items-center gap-1"
              title={`${card.comments.length} commentaire(s)`}
            >
              <svg
                className="h-4 w-4"
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
              {card.comments.length}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all z-10"
        title="Supprimer la carte"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
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

function AddCardForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
        className="w-full text-left text-sm p-2 rounded-lg text-text-muted hover:bg-slate-200 transition-colors"
      >
        + Ajouter une carte
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full border-slate-300 rounded-lg p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
        placeholder="Saisissez un titre pour cette carte..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        onBlur={handleSubmit}
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition"
          type="submit"
        >
          Ajouter
        </button>
        <button
          onClick={() => setIsEditing(false)}
          type="button"
          className="text-2xl text-text-muted hover:text-text"
        >
          &times;
        </button>
      </div>
    </form>
  );
}

function ListContainer({ list, onAddCard, onDeleteCard, onOpenModal }) {
  const { setNodeRef } = useSortable({ id: list.id, data: { type: "list" } });

  return (
    <div
      ref={setNodeRef}
      className="bg-surface rounded-xl p-3 w-72 flex-shrink-0 flex flex-col"
    >
      <h2 className="font-bold text-lg mb-4 text-text px-1">{list.title}</h2>
      <SortableContext
        items={list.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 mb-3 min-h-[40px] overflow-y-auto pr-1">
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
      <AddCardForm onAdd={(title) => onAddCard(list.id, title)} />
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

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
        cards: list.cards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card,
        ),
      })),
    );
    if (selectedCard && selectedCard.id === updatedCard.id) {
      setSelectedCard(updatedCard);
    }
  };

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const newList = await createList({
      title: newListTitle,
      boardId: Number(boardId),
    });
    setLists((current) => [...current, { ...newList, cards: [] }]);
    setNewListTitle("");
  }

  async function handleAddCard(listId, cardTitle) {
    if (!cardTitle.trim()) return;
    const newCard = await createCard({ title: cardTitle, listId });
    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list,
      ),
    );
  }

  async function handleDeleteCard(listId, cardId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      await deleteCard(cardId);
      setLists((current) =>
        current.map((list) =>
          list.id === listId
            ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
            : list,
        ),
      );
    }
  }

  function findListForCard(cardId, currentLists) {
    return currentLists.find((list) =>
      list.cards.some((card) => card.id === cardId),
    );
  }

  function handleDragStart(event) {
    const { active } = event;
    const card = lists
      .flatMap((list) => list.cards)
      .find((c) => c.id === active.id);
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
      const overList = currentLists.find(
        (list) =>
          list.id === overId || list.cards.some((card) => card.id === overId),
      );
      if (!activeList || !overList) return currentLists;
      if (activeList.id === overList.id) {
        const oldIndex = activeList.cards.findIndex((c) => c.id === activeId);
        const newIndex = overList.cards.findIndex((c) => c.id === overId);
        return currentLists.map((list) =>
          list.id === activeList.id
            ? { ...list, cards: arrayMove(list.cards, oldIndex, newIndex) }
            : list,
        );
      } else {
        const newLists = [...currentLists];
        const activeListIndex = newLists.findIndex(
          (l) => l.id === activeList.id,
        );
        const overListIndex = newLists.findIndex((l) => l.id === overList.id);
        const activeCardIndex = activeList.cards.findIndex(
          (c) => c.id === activeId,
        );
        const [movedCard] = newLists[activeListIndex].cards.splice(
          activeCardIndex,
          1,
        );
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

  if (!board) {
    return <div className="p-8 text-center text-text-muted">Chargement...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-background">
        <header className="mb-8">
          <Link to="/boards" className="text-sm text-primary hover:underline">
            &larr; Retour aux projets
          </Link>
          <h1 className="text-3xl font-extrabold text-text mt-2">
            {board.title}
          </h1>
        </header>
        <div className="flex gap-6 overflow-x-auto pb-4 items-start">
          {lists.map((list) => (
            <ListContainer
              key={list.id}
              list={list}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onOpenModal={handleOpenModal}
            />
          ))}
          <div className="w-72 flex-shrink-0">
            <form
              onSubmit={handleAddList}
              className="bg-slate-200/60 rounded-xl p-3"
            >
              <input
                className="w-full border-none bg-transparent rounded-lg p-2 mb-2 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:bg-white"
                placeholder="+ Ajouter une liste"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <button
                className="w-full rounded-lg bg-primary/80 text-white py-2 font-semibold shadow hover:bg-primary transition disabled:opacity-50"
                disabled={!newListTitle.trim()}
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      </div>

      {selectedCard &&
        createPortal(
          <CardModal
            card={selectedCard}
            board={board}
            onClose={handleCloseModal}
            onCardUpdate={handleCardUpdate}
            onBoardUpdate={fetchBoard}
          />,
          document.body,
        )}

      {createPortal(
        <DragOverlay>
          {activeCard ? (
            <Card
              card={activeCard}
              onDelete={() => {}}
              onOpenModal={() => {}}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
