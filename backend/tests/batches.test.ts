import request from "supertest";
import app from "../app.js";
import { test, expect, beforeEach, describe } from "vitest";
import { pool } from "../db/pool.js";
import { randomUUID } from "node:crypto";
import { createBatch } from "../models/batchModel.js";

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE users CASCADE");
});

describe("POST /batches", () => {
  test("returns 401 when attempting to create a batch without logging in", async () => {
    const response = await request(app).post("/batches");
    expect(response.status).toBe(401);
  });

  test("returns 400 when creating a batch when companyNames is empty", async () => {
    const user = { email: "user@test.com", password: "123" };
    const agent = request.agent(app);
    await agent.post("/signup").send(user);
    await agent.post("/login").send(user);

    const response = await agent.post("/batches").send({ companyNames: [] });

    expect(response.status).toBe(400);
  });

  test("returns 400 when creating a batch when body is missing", async () => {
    const user = { email: "user@test.com", password: "123" };
    const agent = request.agent(app);
    await agent.post("/signup").send(user);
    await agent.post("/login").send(user);

    const response = await agent.post("/batches");

    expect(response.status).toBe(400);
  });

  test("returns 400 when creating a batch with non string values in the array", async () => {
    const user = { email: "user@test.com", password: "123" };
    const agent = request.agent(app);
    await agent.post("/signup").send(user);
    await agent.post("/login").send(user);

    const response = await agent
      .post("/batches")
      .send({ companyNames: [123, null] });

    expect(response.status).toBe(400);
  });

  test("returns 400 when creating a batch with entries greater than the current maximum batch size", async () => {
    const user = { email: "user@test.com", password: "123" };
    const agent = request.agent(app);
    await agent.post("/signup").send(user);
    await agent.post("/login").send(user);

    const companies = Array(16).fill("Test Company");

    const response = await agent
      .post("/batches")
      .send({ companyNames: companies });

    expect(response.status).toBe(400);
  });

  test("returns 429 when the same user makes too many requests", async () => {
    const user = { email: "user@test.com", password: "123" };
    const agent = request.agent(app);
    await agent.post("/signup").send(user);
    await agent.post("/login").send(user);

    const first = await agent.post("/batches").send({ companyNames: [] });

    expect(first.status).toBe(400);

    const second = await agent
      .post("/batches")
      .send({ companyNames: ["Anthropic", "OpenAI"] });

    expect(second.status).toBe(429);
  });
});

describe("GET /batches/:id", () => {
  test("returns 404 when user B tries accessing user A's batch", async () => {
    const userA = { email: "user@test.com", password: "123" };

    const userB = { email: "user2@test.com", password: "123" };
    const batchID = randomUUID();

    const agent = request.agent(app);
    const signupResponse = await agent.post("/signup").send(userA);
    const UserAID = signupResponse.body.id;
    await agent.post("/login").send(userA);

    const client = await pool.connect();
    try {
      await createBatch(UserAID, batchID, "pending", client);
    } finally {
      client.release();
    }

    const agentB = request.agent(app);
    await agentB.post("/signup").send(userB);

    await agentB.post("/login").send(userB);

    const response = await agentB.get(`/batches/${batchID}`);

    expect(response.status).toBe(404);
  });
});
