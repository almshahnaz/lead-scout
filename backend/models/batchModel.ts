import type { PoolClient } from "pg";
import { pool } from "../db/pool.js";

export interface CompanyResult {
  id: string;
  companyName: string;
  status: "done" | "pending" | "failed";
  brief: string;
  emailDraft: string;
}

export interface BatchRun {
  id: string;
  status: "pending" | "done";
  results: CompanyResult[];
}

export async function createBatch(
  userID: string,
  batchID: string,
  initialStatus: string,
  client: PoolClient,
) {
  const query =
    "INSERT INTO batch_runs (id, status, user_id) VALUES ($1, $2, $3)";

  await client.query(query, [batchID, initialStatus, userID]);
}

export async function createCompanyResult(
  result: CompanyResult,
  batchID: string,
  client: PoolClient,
) {
  const query =
    "INSERT INTO company_results (id, batch_run_id, company_name, status, brief, email_draft) VALUES ($1, $2, $3, $4, $5, $6)";

  await client.query(query, [
    result.id,
    batchID,
    result.companyName,
    result.status,
    result.brief,
    result.emailDraft,
  ]);
}

export async function getCompanyResults(batchID: string): Promise<CompanyResult[]> {
  const query = "SELECT * FROM company_results WHERE batch_run_id = $1";

  const result = await pool.query(query, [batchID]);

  return result.rows.map((row) => ({
    id: row.id,
    companyName: row.company_name,
    status: row.status,
    brief: row.brief,
    emailDraft: row.email_draft,
  }));
}

export async function getBatchByID(userID: string, id: string) {
  const query = "SELECT * FROM batch_runs WHERE id = $1 AND user_id = $2";

  const result = await pool.query(query, [id, userID]);
  return result.rows[0];
}
