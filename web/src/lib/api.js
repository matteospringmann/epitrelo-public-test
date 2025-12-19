import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  withCredentials: true,
});

export async function getMe() {
  try {
    const { data } = await api.get("/auth/me");
    return data; // ✅ Correction ici
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {}
}

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

export async function updateBoard(id, boardData) {
  const { data } = await api.put(`/boards/${id}`, boardData);
  return data;
}

export async function deleteBoard(id) {
  await api.delete(`/boards/${id}`);
}

export async function createList(list) {
  const { data: created } = await api.post("/lists", list);
  return created;
}

export async function updateList(id, listData) {
  const { data: updated } = await api.put(`/lists/${id}`, listData);
  return updated;
}

export async function deleteList(id) {
  await api.delete(`/lists/${id}`);
}

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

export async function createComment(comment) {
  const { data: created } = await api.post("/comments", comment);
  return created;
}

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
  const { data: updated } = await api.post(
    `/labels/${labelId}/card/${cardId}`,
  );
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

export async function addBoardToFavorites(boardId) {
  await api.post(`/boards/${boardId}/favorite`);
}

export async function removeBoardFromFavorites(boardId) {
  await api.delete(`/boards/${boardId}/favorite`);
}

export async function getFavoriteBoards() {
  const { data } = await api.get("/boards/favorites");
  return data;
}

export async function updateUserTheme(theme) {
  const { data } = await api.put("/user/theme", { theme });
  return data;
}

export async function linkGoogleAccount(googleId) {
  const { data } = await api.post("/user/link-google", { googleId });
  return data;
}

export async function unlinkGoogleAccount() {
  const { data } = await api.delete("/user/unlink-google");
  return data;
}

export async function setPassword(password) {
  const { data } = await api.post("/user/set-password", { password });
  return data;
}

export async function globalSearch(query) {
  const { data } = await api.get("/search", { params: { q: query } });
  return data;
}
