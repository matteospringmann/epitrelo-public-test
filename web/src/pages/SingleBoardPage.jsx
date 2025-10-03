// web/src/pages/SingleBoardPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBoardById, createList, createCard, deleteCard } from "../lib/api";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ===================================================================
// COMPOSANT POUR UNE CARTE INDIVIDUELLE (AVEC GESTION DRAG & DROP)
// ===================================================================
// function SortableCard({ card, onDelete }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: card.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="bg-white rounded-lg p-3 shadow-md border border-slate-200 group relative cursor-grab active:cursor-grabbing"
//     >
//       <div className="font-semibold text-text">{card.title}</div>
//       {card.content && (
//         <p className="text-sm text-text-muted mt-1">{card.content}</p>
//       )}
//       <button
//         onClick={onDelete}
//         onMouseDown={(e) => e.stopPropagation()}
//         className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all z-10"
//         title="Supprimer la carte"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M6 18L18 6M6 6l12 12"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// }

function SortableCard({ card, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md border border-slate-200 group relative"
    >
      {/* On applique les listeners uniquement à une "poignée" de drag */}
      <div
        {...attributes}
        {...listeners}
        className="p-3 cursor-grab active:cursor-grabbing"
      >
        <div className="font-semibold text-text">{card.title}</div>
        {card.content && (
          <p className="text-sm text-text-muted mt-1">{card.content}</p>
        )}
      </div>

      {/* Le bouton est MAINTENANT EN DEHORS de la zone de drag */}
      <button
        onClick={onDelete}
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

// =============================================================
// COMPOSANT POUR LE FORMULAIRE D'AJOUT D'UNE CARTE
// =============================================================
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

// ==============================================================
// COMPOSANT PRINCIPAL DE LA PAGE
// ==============================================================
export default function SingleBoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    if (boardId) {
      getBoardById(boardId)
        .then((data) => {
          setBoard(data);
          setLists(data.lists || []);
        })
        .catch((err) => console.error("Erreur de chargement du board:", err));
    }
  }, [boardId]);

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const newList = await createList({
      title: newListTitle,
      boardId: Number(boardId),
    });
    setLists((currentLists) => [...currentLists, { ...newList, cards: [] }]);
    setNewListTitle("");
  }

  async function handleAddCard(listId, cardTitle) {
    if (!cardTitle.trim()) return;
    const newCard = await createCard({ title: cardTitle, listId: listId });
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list,
      ),
    );
  }

  async function handleDeleteCard(listId, cardId) {
    // --- AJOUTEZ CES LOGS POUR DÉBOGUER ---
    console.log(
      `Tentative de suppression de la carte ID: ${cardId} de la liste ID: ${listId}`,
    );

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      console.log("Confirmation de l'utilisateur. Envoi de la requête API...");
      try {
        await deleteCard(cardId);
        console.log(
          "Requête API terminée. Mise à jour de l'état du front-end.",
        );

        setLists((currentLists) =>
          currentLists.map((list) => {
            if (list.id !== listId) {
              return list;
            }
            return {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            };
          }),
        );
      } catch (error) {
        console.error("Erreur API lors de la suppression de la carte:", error);
      }
    } else {
      console.log("Suppression annulée par l'utilisateur.");
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLists((currentLists) => {
      const activeListIndex = currentLists.findIndex((list) =>
        list.cards.some((card) => card.id === active.id),
      );
      const overListIndex = currentLists.findIndex(
        (list) =>
          list.cards.some((card) => card.id === over.id) || list.id === over.id,
      );

      if (activeListIndex === -1 || overListIndex === -1) return currentLists;

      // Scénario 1: Déplacer dans la même liste
      if (activeListIndex === overListIndex) {
        const activeList = currentLists[activeListIndex];
        const oldIndex = activeList.cards.findIndex(
          (card) => card.id === active.id,
        );
        const newIndex = activeList.cards.findIndex(
          (card) => card.id === over.id,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedCards = arrayMove(
            activeList.cards,
            oldIndex,
            newIndex,
          );
          const newLists = [...currentLists];
          newLists[activeListIndex] = {
            ...activeList,
            cards: reorderedCards,
          };
          return newLists;
        }
      }
      // TODO: Implémenter le déplacement entre différentes listes
      return currentLists;
    });
  }

  if (!board) {
    return (
      <div className="p-8 text-center text-text-muted">
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-background">
        <header className="mb-8">
          <Link to="/boards" className="text-sm text-primary hover:underline">
            &larr; Retour à tous les projets
          </Link>
          <h1 className="text-3xl font-extrabold text-text mt-2">
            {board.title}
          </h1>
        </header>
        <div className="flex gap-6 overflow-x-auto pb-4 items-start">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-surface rounded-xl p-3 w-72 flex-shrink-0 flex flex-col"
            >
              <h2 className="font-bold text-lg mb-4 text-text px-1">
                {list.title}
              </h2>
              <SortableContext
                items={list.cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex-1 space-y-3 mb-3 min-h-[40px] overflow-y-auto pr-1">
                  {list.cards.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      onDelete={() => handleDeleteCard(list.id, card.id)}
                    />
                  ))}
                </div>
              </SortableContext>
              <AddCardForm onAdd={(title) => handleAddCard(list.id, title)} />
            </div>
          ))}
          <div className="w-72 flex-shrink-0">
            <form
              onSubmit={handleAddList}
              className="bg-slate-200/60 rounded-xl p-3"
            >
              <input
                className="w-full border-none bg-transparent rounded-lg p-2 mb-2 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:bg-white"
                placeholder="+ Ajouter une autre liste"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <button
                className="w-full rounded-lg bg-primary/80 text-white py-2 font-semibold shadow hover:bg-primary transition disabled:opacity-50"
                disabled={!newListTitle.trim()}
              >
                Ajouter une liste
              </button>
            </form>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
