// api/test/boards.test.js

import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";

describe("Board Endpoints", () => {
  let agent;
  let createdBoardId;

  beforeAll(async () => {
    agent = request.agent(app);
    const testUser = {
      email: `board-test-${Date.now()}@example.com`,
      name: "Board Tester",
      password: "password123",
    };

    await agent.post("/api/auth/register").send(testUser);
  });

  it("POST /api/boards -> should create a new board", async () => {
    const boardData = { title: "Mon Premier Projet" };
    const res = await agent.post("/api/boards").send(boardData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(boardData.title);
    createdBoardId = res.body.id;
  });

  it("GET /api/boards -> should return a list of boards for the user", async () => {
    const res = await agent.get("/api/boards");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe("Mon Premier Projet");
  });

  it("GET /api/boards/:id -> should return a single board with its lists and cards", async () => {
    const res = await agent.get(`/api/boards/${createdBoardId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdBoardId);
    expect(res.body).toHaveProperty("lists");
  });

  it("GET /api/boards/:id -> should return 404 for a non-existent board", async () => {
    const res = await agent.get("/api/boards/999999");
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /api/boards/:id -> should delete a board", async () => {
    const res = await agent.delete(`/api/boards/${createdBoardId}`);
    expect(res.statusCode).toBe(204);

    const getRes = await agent.get(`/api/boards/${createdBoardId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
