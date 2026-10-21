import { beforeEach, describe, expect, test, vi } from "vitest";
import { pool } from "../db/pool.js";
import { randomUUID } from "node:crypto";
import {
  createBatch,
  createCompanyResult,
  type CompanyResult,
} from "../models/batchModel.js";
import { processCompanyResearch } from "../services/pipeline.js";

vi.mock("../services/tavily.js", () => ({
  fetchCompanyInfo: vi.fn().mockRejectedValue(new Error("Tavily API failed")),
}));

let companyResultID: string;

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
      companyName: "Acme",
      status: "pending",
      brief: "",
      emailDraft: "",
    };

    await createCompanyResult(companyResult, batchID, client);
  } finally {
    client.release();
  }
});

describe("processCompanyResearch", () => {
  test("sets company status to failed when Tavily rejects", async () => {
    const before = await pool.query(
      "SELECT status FROM company_results WHERE id = $1",
      [companyResultID],
    );

    expect(before.rows[0].status).toBe("pending");

    await processCompanyResearch(companyResultID, "Acme");

    const after = await pool.query(
      "SELECT status FROM company_results WHERE id = $1",
      [companyResultID],
    );

    expect(after.rows[0].status).toBe("failed");
  });
});
