import React, { useState, useEffect } from "react";
import { getLists, createList, createCard, deleteCard } from "../lib/api";

// Card Component
function Card({ card, onDelete }) {
    return (
        <div className="bg-white rounded-lg p-3 shadow-md border border-slate-200 group relative">
            <div className="font-semibold text-text">{card.title}</div>
            {card.content && (
                <p className="text-sm text-text-muted mt-1">{card.content}</p>
            )}
            <button
                onClick={onDelete}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                title="Delete card"
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

// AddCardForm Component
function AddCardForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
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
                + Add a card
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                className="w-full border-slate-300 rounded-lg p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Enter a title for this card..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onBlur={() => setIsEditing(false)}
            />
            <div className="flex items-center gap-2 mt-2">
                <button
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition"
                    type="submit"
                >
                    Add card
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

// Boards Components
export default function Boards() {
    const [lists, setLists] = useState([]);
    const [newListTitle, setNewListTitle] = useState("");

    useEffect(() => {
        getLists().then(setLists);
    }, []);

    async function handleAddList(e) {
        e.preventDefault();
        if (!newListTitle.trim()) return;
        const list = await createList({ title: newListTitle });
        setLists((lists) => [...lists, { ...list, cards: [] }]);
        setNewListTitle("");
    }

    async function handleAddCard(listId, title) {
        const card = await createCard({ title, listId });
        setLists((lists) =>
            lists.map((list) =>
                list.id === listId
                    ? { ...list, cards: [...list.cards, card] }
                    : list,
            ),
        );
    }

    async function handleDeleteCard(listId, cardId) {
        await deleteCard(cardId);
        setLists((lists) =>
            lists.map((list) =>
                list.id === listId
                    ? {
                          ...list,
                          cards: list.cards.filter((c) => c.id !== cardId),
                      }
                    : list,
            ),
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-background">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-text">
                    My Workspace
                </h1>
                <p className="text-text-muted">
                    Here are your boards and tasks.
                </p>
            </header>
            <div className="flex gap-6 overflow-x-auto pb-4">
                {/* Render lists */}
                {lists.map((list) => (
                    <div
                        key={list.id}
                        className="bg-surface rounded-xl p-3 w-72 flex-shrink-0 flex flex-col"
                    >
                        <h2 className="font-bold text-lg mb-4 text-text px-1">
                            {list.title}
                        </h2>
                        <div className="flex-1 space-y-3 mb-3 min-h-[40px] overflow-y-auto pr-1">
                            {list.cards.map((card) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    onDelete={() =>
                                        handleDeleteCard(list.id, card.id)
                                    }
                                />
                            ))}
                        </div>
                        <AddCardForm
                            onAdd={(title) => handleAddCard(list.id, title)}
                        />
                    </div>
                ))}
                {/* Add new list form */}
                <div className="w-72 flex-shrink-0">
                    <form
                        onSubmit={handleAddList}
                        className="bg-slate-200/60 rounded-xl p-3"
                    >
                        <input
                            className="w-full border-none bg-transparent rounded-lg p-2 mb-2 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:bg-white"
                            placeholder="+ Add another list"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                        />
                        <button
                            className="w-full rounded-lg bg-primary/80 text-white py-2 font-semibold shadow hover:bg-primary transition disabled:opacity-50"
                            disabled={!newListTitle.trim()}
                        >
                            Add list
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
