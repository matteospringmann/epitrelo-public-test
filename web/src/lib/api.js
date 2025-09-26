import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  withCredentials: true
})

export async function getMe () {
  try { const { data } = await api.get('/auth/me'); return data.user } catch { return null }
}

export async function logout () {
  try { await api.post('/auth/logout') } catch {}
}

export async function getCards() {
  const { data } = await api.get('/cards')
  return data
}

export async function createCard(card) {
  const { data: created } = await api.post('/cards', card)
  return created
}

export async function updateCard(id, card) {
  const { data: updated } = await api.put(`/cards/${id}`, card)
  return updated
}

export async function deleteCard(id) {
  await api.delete(`/cards/${id}`)
}

export async function getLists() {
  const { data } = await api.get('/lists')
  return data
}

export async function createList(list) {
  const { data: created } = await api.post('/lists', list)
  return created
}