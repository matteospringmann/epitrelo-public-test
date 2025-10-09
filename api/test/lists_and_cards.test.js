// api/test/lists_and_cards.test.js

import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";

describe("Lists and Cards Endpoints", () => {
  let agent;
  let boardId;
  let listId;
  let cardId;

  beforeAll(async () => {
    agent = request.agent(app);
    const testUser = {
      email: `list-card-test-${Date.now()}@example.com`,
      name: "List Card Tester",
      password: "password123",
    };
    await agent.post("/api/auth/register").send(testUser);

    const boardRes = await agent
      .post("/api/boards")
      .send({ title: "Projet de Test pour Listes" });
    boardId = boardRes.body.id;
  });

  it("POST /api/lists -> should create a new list in a board", async () => {
    const listData = { title: "À Faire", boardId: boardId };
    const res = await agent.post("/api/lists").send(listData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(listData.title);
    listId = res.body.id;
  });

  it("POST /api/lists -> should fail if boardId is missing", async () => {
    const res = await agent
      .post("/api/lists")
      .send({ title: "Liste sans board" });
    expect(res.statusCode).toBe(400);
  });

  it("POST /api/cards -> should create a new card in a list", async () => {
    const cardData = { title: "Ma première tâche", listId: listId };
    const res = await agent.post("/api/cards").send(cardData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(cardData.title);
    cardId = res.body.id;
  });

  it("PUT /api/cards/:id -> should update a card", async () => {
    const updatedData = { title: "Tâche mise à jour" };
    const res = await agent.put(`/api/cards/${cardId}`).send(updatedData);

    expect(res.statusCode).toBe(200);

    const boardRes = await agent.get(`/api/boards/${boardId}`);
    const card = boardRes.body.lists[0].cards[0];
    expect(card.title).toBe(updatedData.title);
  });

  it("DELETE /api/cards/:id -> should delete a card", async () => {
    const res = await agent.delete(`/api/cards/${cardId}`);
    expect(res.statusCode).toBe(204);

    const boardRes = await agent.get(`/api/boards/${boardId}`);
    expect(boardRes.body.lists[0].cards.length).toBe(0);
  });
});
