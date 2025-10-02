// api/test/auth.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";

describe("Authentication Endpoints", () => {
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        password: "password123",
    };

    it("POST /api/auth/register -> should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe(testUser.email);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("POST /api/auth/register -> should fail to register a duplicate user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("Email already in use");
    });

    it("POST /api/auth/login -> should log in the user successfully", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(testUser.email);
        expect(res.headers["set-cookie"]).toBeDefined();
    });
});
