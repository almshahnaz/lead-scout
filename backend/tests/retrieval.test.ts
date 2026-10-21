import { test, expect, beforeEach, describe } from "vitest";
import { pool } from "../db/pool.js";
import { createBatch } from "../models/batchModel.js";
import { randomUUID } from "node:crypto";
import { createCompanyResult } from "../models/batchModel.js";
import { type CompanyResult } from "../models/batchModel.js";
import { createEmbedding, retrieveChunks } from "../models/embeddingModel.js";

let companyResultID: string;

function makeVector(a: number = 0, b: number = 0, c: number = 0) {
  let vector: number[] = Array(1536).fill(0);
  vector[0] = a;
  vector[1] = b;
  vector[2] = c;

  return vector;
}

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE users CASCADE");
  const userID = randomUUID();
  await pool.query(
    `INSERT INTO users (id, email, password_hash)
   VALUES ($1, $2, $3)`,
    [userID, "test@example.com", "test-hash"],
  );

  const client = await pool.connect();
  const batchID = randomUUID();

  try {
    await createBatch(userID, batchID, "done", client);

    companyResultID = randomUUID();

    const companyResult: CompanyResult = {
      id: companyResultID,
      companyName: "Anthropic",
      status: "pending",
      brief: "",
      emailDraft: "",
    };

    await createCompanyResult(companyResult, batchID, client);
  } finally {
    client.release();
  }
});

describe("retrieveChunks", () => {
  test("retrieves closest chunks to query vector in order successfully", async () => {
    await createEmbedding(companyResultID, "C", makeVector(-1, 0, 0));
    await createEmbedding(companyResultID, "A", makeVector(1, 0, 0));

    await createEmbedding(companyResultID, "B", makeVector(0.5, 0.5, 0));

    const retrieved = await retrieveChunks(
      companyResultID,
      makeVector(1, 0, 0),
      3,
    );

    expect(retrieved).toEqual(["A", "B", "C"]);
  });

  test("returns empty array when no embeddings exist", async () => {
    const retrieved = await retrieveChunks(
      companyResultID,
      makeVector(1, 0, 0),
      3,
    );

    expect(retrieved).toEqual([]);
  });
});
