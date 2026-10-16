import request from "supertest";
import app from "../app.js";
import { test, expect, beforeEach, describe } from "vitest";
import { pool } from "../db/pool.js";

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE users CASCADE");
});

describe("POST /signup", () => {
  test("returns 400 when body is missing", async () => {
    const response = await request(app).post("/signup");
    expect(response.status).toBe(400);
  });

  test("returns 400 when email is missing", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ password: "123" });
    expect(response.status).toBe(400);
  });

  test("returns 400 when password is missing", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ email: "user@test.com" });
    expect(response.status).toBe(400);
  });

  test("creates a user successfully", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ email: "user@test.com", password: "123" });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty("password_hash");
    expect(response.body.email).toBe("user@test.com");
  });

  test("returns 409 when attemting to create new user with existing email", async () => {
    await request(app)
      .post("/signup")
      .send({ email: "user@test.com", password: "123" });

    const response = await request(app)
      .post("/signup")
      .send({ email: "user@test.com", password: "123" });

    expect(response.status).toBe(409);
  });
});

describe("POST /login", () => {
  test("returns 400 when body is missing", async () => {
    const response = await request(app).post("/login");
    expect(response.status).toBe(400);
  });

  test("returns 400 when email is missing", async () => {
    const response = await request(app)
      .post("/login")
      .send({ password: "123" });
    expect(response.status).toBe(400);
  });

  test("returns 400 when password is missing", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "user@test.com" });
    expect(response.status).toBe(400);
  });

  test("logs in user successfully", async () => {
    const user = { email: "user@test.com", password: "123" };
    await request(app).post("/signup").send(user);

    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("user@test.com");
  });

  test("returns 401 when attempting login with incorrect email", async () => {
    await request(app)
      .post("/signup")
      .send({ email: "user@test.com", password: "123" });

    const response = await request(app)
      .post("/login")
      .send({ email: "wrongEmail@test.com", password: "123" });

    expect(response.status).toBe(401);
  });

  test("returns 401 when attempting login with incorrect password", async () => {
    await request(app)
      .post("/signup")
      .send({ email: "user@test.com", password: "123" });

    const response = await request(app)
      .post("/login")
      .send({ email: "user@test.com", password: "wrongPassword" });

    expect(response.status).toBe(401);
  });
});

describe("POST /batches", () => {
  test("returns 401 when attempting to create a batch without logging in", async () => {
    const response = await request(app).post("/batches");
    expect(response.status).toBe(401);
  });
});
