// web/src/lib/api.js (Version corrigée et complète)

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  withCredentials: true,
});

// =====================
// Fonctions d'Authentification
// =====================
export async function getMe() {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore
  }
}

// =====================
// Fonctions des Boards
// =====================
export async function getBoards() {
  const { data } = await api.get("/boards");
  return data;
}

export async function getBoardById(id) {
  const { data } = await api.get(`/boards/${id}`);
  return data;
}

export async function createBoard(board) {
  const { data: created } = await api.post("/boards", board);
  return created;
}

export async function deleteBoard(id) {
  await api.delete(`/boards/${id}`);
}

// =====================
// Fonctions des Listes
// =====================
export async function createList(list) {
  const { data: created } = await api.post("/lists", list);
  return created;
}

// =====================
// Fonctions des Cartes
// =====================
export async function createCard(card) {
  const { data: created } = await api.post("/cards", card);
  return created;
}

export async function updateCard(id, card) {
  const { data: updated } = await api.put(`/cards/${id}`, card);
  return updated;
}

export async function deleteCard(id) {
  await api.delete(`/cards/${id}`);
}

// =====================
// Fonctions de l'Utilisateur
// =====================
export async function updateUserProfile(userData) {
  const { data } = await api.put("/user/profile", userData);
  return data;
}

export async function getUserStats() {
  const { data } = await api.get("/user/stats");
  return data;
}

export async function deleteUserAccount() {
  await api.delete("/user/account");
}

// =====================
// Fonctions des Commentaires
// =====================
export async function createComment(comment) {
  const { data: created } = await api.post("/comments", comment);
  return created;
}

// =====================
// Fonctions des Étiquettes
// =====================
export async function createLabel(label) {
  const { data: created } = await api.post("/labels", label);
  return created;
}

export async function updateLabel(id, labelData) {
  const { data: updated } = await api.put(`/labels/${id}`, labelData);
  return updated;
}

export async function deleteLabel(id) {
  await api.delete(`/labels/${id}`);
}

export async function assignLabelToCard(labelId, cardId) {
  const { data: updated } = await api.post(`/labels/${labelId}/card/${cardId}`);
  return updated;
}

export async function removeLabelFromCard(labelId, cardId) {
  const { data: updated } = await api.delete(
    `/labels/${labelId}/card/${cardId}`,
  );
  return updated;
}

export async function createInvitationLink(boardId) {
  const { data } = await api.post(`/boards/${boardId}/invitations`);
  return data.inviteLink;
}

export async function acceptInvitation(token) {
  const { data } = await api.post(`/invitations/${token}/accept`);
  return data.boardId;
}
