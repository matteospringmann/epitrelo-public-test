import React, { useState, useEffect } from "react";
import {
  createComment,
  updateCard,
  assignLabelToCard,
  removeLabelFromCard,
  createLabel,
  updateLabel,
  deleteLabel,
} from "../lib/api";
import Avatar from "./Avatar";

const DescriptionIcon = () => (
  <svg
    className="w-5 h-5"
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
);
const ActivityIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-2a2 2 0 012-2h6a2 2 0 012 2v2"
    />
  </svg>
);
const LabelIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM17 17h.01M17 13h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2v-5a2 2 0 012-2z"
    />
  </svg>
);
const MembersIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const DateIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function CardModal({
  card,
  board,
  onClose,
  onCardUpdate,
  onBoardUpdate,
}) {
  const [newComment, setNewComment] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editableContent, setEditableContent] = useState(card?.content || "");
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const [isMemberPopoverOpen, setIsMemberPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [popoverView, setPopoverView] = useState("main");
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#6d28d9");
  const [selectedDate, setSelectedDate] = useState(
    card?.deadline
      ? new Date(card.deadline).toISOString().substring(0, 10)
      : "",
  );

  const availableColors = [
    "#6d28d9",
    "#db2777",
    "#059669",
    "#d97706",
    "#2563eb",
    "#dc2626",
  ];

  useEffect(() => {
    setEditableContent(card?.content || "");
    setSelectedDate(
      card?.deadline
        ? new Date(card.deadline).toISOString().substring(0, 10)
        : "",
    );
  }, [card]);

  if (!card) return null;

  const handleDescriptionSave = async () => {
    const updated = await updateCard(card.id, { content: editableContent });
    onCardUpdate(updated);
    setIsEditingDescription(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const createdComment = await createComment({
      text: newComment,
      cardId: card.id,
    });
    onCardUpdate({ ...card, comments: [...card.comments, createdComment] });
    setNewComment("");
  };

  const handleToggleLabel = async (labelId) => {
    const isLabelOnCard = (card.labels || []).some((l) => l.id === labelId);
    const updated = isLabelOnCard
      ? await removeLabelFromCard(labelId, card.id)
      : await assignLabelToCard(labelId, card.id);
    onCardUpdate(updated);
  };

  const handleCreateLabel = async () => {
    if (!labelName.trim()) return;
    await createLabel({
      name: labelName,
      color: labelColor,
      boardId: board.id,
    });
    onBoardUpdate();
    setPopoverView("main");
  };

  const handleUpdateLabel = async () => {
    if (!labelName.trim()) return;
    await updateLabel(editingLabel.id, { name: labelName, color: labelColor });
    onBoardUpdate();
    setPopoverView("main");
  };

  const handleDeleteLabel = async () => {
    if (
      window.confirm(
        "Supprimer cette étiquette ? Cette action est irréversible.",
      )
    ) {
      await deleteLabel(editingLabel.id);
      onBoardUpdate();
      setPopoverView("main");
    }
  };

  const openLabelEditor = (label) => {
    setEditingLabel(label);
    setLabelName(label.name);
    setLabelColor(label.color);
    setPopoverView("edit");
  };

  const openLabelCreator = () => {
    setEditingLabel(null);
    setLabelName("");
    setLabelColor(availableColors[0]);
    setPopoverView("create");
  };

  const handleAssignUser = async (userId) => {
    const newAssignedUserId = card.assignedUserId === userId ? null : userId;
    const updated = await updateCard(card.id, {
      assignedUserId: newAssignedUserId,
    });
    onCardUpdate(updated);
    setIsMemberPopoverOpen(false);
  };

  const handleDateSave = async () => {
    if (!selectedDate) return;
    const newDeadline = new Date(selectedDate);
    const updated = await updateCard(card.id, {
      deadline: newDeadline.toISOString(),
    });
    onCardUpdate(updated);
    setIsDatePopoverOpen(false);
  };

  const handleDateRemove = async () => {
    const updated = await updateCard(card.id, { deadline: null });
    onCardUpdate(updated);
    setIsDatePopoverOpen(false);
  };

  const renderLabelPopoverContent = () => {
    if (popoverView === "create" || popoverView === "edit") {
      return (
        <div>
          <div className="flex items-center mb-3">
            <button onClick={() => setPopoverView("main")} className="text-xl">
              &larr;
            </button>
            <h4 className="flex-1 text-center font-semibold text-sm">
              {popoverView === "create"
                ? "Créer une étiquette"
                : "Modifier l'étiquette"}
            </h4>
          </div>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-md p-2 text-sm mb-3"
            placeholder="Nom de l'étiquette..."
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />
          <div className="grid grid-cols-6 gap-2 mb-4">
            {availableColors.map((color) => (
              <div
                key={color}
                onClick={() => setLabelColor(color)}
                className={`h-8 rounded cursor-pointer flex items-center justify-center ${labelColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={
              popoverView === "create" ? handleCreateLabel : handleUpdateLabel
            }
            className="w-full bg-primary text-white py-2 rounded-md text-sm font-semibold"
          >
            {popoverView === "create" ? "Créer" : "Enregistrer"}
          </button>
          {popoverView === "edit" && (
            <button
              onClick={handleDeleteLabel}
              className="w-full bg-red-600 text-white mt-2 py-2 rounded-md text-sm font-semibold"
            >
              Supprimer
            </button>
          )}
        </div>
      );
    }
    return (
      <div>
        <h4 className="text-center font-semibold text-sm mb-3">Étiquettes</h4>
        <div className="space-y-2">
          {(board?.labels || []).map((label) => {
            const isChecked = (card.labels || []).some(
              (l) => l.id === label.id,
            );
            return (
              <div key={label.id} className="flex items-center gap-3">
                <div
                  onClick={() => handleToggleLabel(label.id)}
                  className="w-5 h-5 flex items-center justify-center border-2 border-slate-300 rounded cursor-pointer"
                >
                  {isChecked && (
                    <div className="w-3 h-3 bg-primary rounded-sm" />
                  )}
                </div>
                <div
                  onClick={() => handleToggleLabel(label.id)}
                  className="flex-1 text-white text-sm font-bold px-2 py-1 rounded cursor-pointer"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </div>
                <button onClick={() => openLabelEditor(label)}>✏️</button>
              </div>
            );
          })}
        </div>
        <button
          onClick={openLabelCreator}
          className="w-full bg-surface hover:bg-slate-300 text-sm font-medium py-2 mt-4 rounded-md"
        >
          Créer une nouvelle étiquette
        </button>
      </div>
    );
  };

  const renderMemberPopoverContent = () => (
    <div>
      <h4 className="text-center font-semibold text-sm mb-3">Membres</h4>
      <div className="space-y-2">
        {(board?.members || []).map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface cursor-pointer"
            onClick={() => handleAssignUser(member.id)}
          >
            <Avatar user={member} />
            <span className="flex-1 text-sm font-medium">{member.name}</span>
            {card.assignedUserId === member.id && (
              <span className="text-primary">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDatePopoverContent = () => (
    <div>
      <h4 className="text-center font-semibold text-sm mb-3">Dates</h4>
      <label className="text-xs font-semibold uppercase text-text-muted mb-1 block">
        Date d'échéance
      </label>
      <input
        type="date"
        className="w-full border border-slate-300 rounded-md p-2 text-sm mb-3"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button
        onClick={handleDateSave}
        className="w-full bg-primary text-white py-2 rounded-md text-sm font-semibold mb-2"
      >
        Enregistrer
      </button>
      <button
        onClick={handleDateRemove}
        className="w-full bg-surface hover:bg-slate-300 text-sm font-medium py-2 rounded-md"
      >
        Supprimer
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 sm:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg shadow-xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-text">{card.title}</h2>
            <button
              onClick={onClose}
              className="text-3xl text-text-muted hover:text-text leading-none"
            >
              &times;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="flex gap-8">
                {card.assignedUser && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-text-muted mb-2">
                      Assigné à
                    </h3>
                    <div className="flex items-center gap-3">
                      <Avatar user={card.assignedUser} />
                      <p className="font-semibold">{card.assignedUser.name}</p>
                    </div>
                  </div>
                )}
                {card.deadline && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-text-muted mb-2">
                      Date d'échéance
                    </h3>
                    <p className="font-semibold">
                      {new Date(card.deadline).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <DescriptionIcon />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                {isEditingDescription ? (
                  <div>
                    <textarea
                      className="w-full border-slate-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="Ajouter une description..."
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={handleDescriptionSave}
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setIsEditingDescription(false)}
                        className="text-2xl text-text-muted hover:text-text"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDescription(true)}
                    className={`min-h-[80px] p-3 rounded-lg cursor-pointer ${card.content ? "text-text" : "text-text-muted"} hover:bg-slate-200`}
                  >
                    {card.content ||
                      "Ajouter une description plus détaillée..."}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ActivityIcon />
                  <h3 className="text-lg font-semibold">Activité</h3>
                </div>
                <form onSubmit={handleAddComment}>
                  <textarea
                    className="w-full border-slate-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Écrire un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  {newComment && (
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition"
                    >
                      Enregistrer
                    </button>
                  )}
                </form>
                <div className="space-y-4 mt-6 max-h-60 overflow-y-auto pr-2">
                  {(card.comments || [])
                    .slice()
                    .reverse()
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {comment.user.name}
                          </p>
                          <div className="bg-white p-3 rounded-lg text-sm shadow-sm border border-slate-200">
                            {comment.text}
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            {new Date(comment.createdAt).toLocaleString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-xs font-semibold uppercase text-text-muted mb-2">
                Ajouter à la carte
              </h3>
              <div className="space-y-2">
                <div className="relative">
                  <button
                    onClick={() => setIsLabelPopoverOpen(!isLabelPopoverOpen)}
                    className="w-full bg-slate-200/80 hover:bg-slate-300 text-text font-medium py-2 px-3 rounded-lg flex items-center gap-2"
                  >
                    <LabelIcon />
                    <span>Étiquettes</span>
                  </button>
                  {isLabelPopoverOpen && (
                    <div className="absolute z-10 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3">
                      {renderLabelPopoverContent()}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsMemberPopoverOpen(!isMemberPopoverOpen)}
                    className="w-full bg-slate-200/80 hover:bg-slate-300 text-text font-medium py-2 px-3 rounded-lg flex items-center gap-2"
                  >
                    <MembersIcon />
                    <span>Membres</span>
                  </button>
                  {isMemberPopoverOpen && (
                    <div className="absolute z-10 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3">
                      {renderMemberPopoverContent()}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsDatePopoverOpen(!isDatePopoverOpen)}
                    className="w-full bg-slate-200/80 hover:bg-slate-300 text-text font-medium py-2 px-3 rounded-lg flex items-center gap-2"
                  >
                    <DateIcon />
                    <span>Dates</span>
                  </button>
                  {isDatePopoverOpen && (
                    <div className="absolute z-10 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3">
                      {renderDatePopoverContent()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
