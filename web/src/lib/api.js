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
  } catch {}
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
  // Prend maintenant un objet comme { title, boardId }
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
