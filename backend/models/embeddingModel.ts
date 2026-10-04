import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";

export async function createEmbedding(
  companyResultID: string,
  chunk: string,
  embedding: number[],
) {
  const id = randomUUID();
  const embeddingString = JSON.stringify(embedding);
  const query =
    "INSERT INTO company_embeddings (id, company_result_id, chunk, embedding) VALUES ($1, $2, $3, $4)";

  await pool.query(query, [id, companyResultID, chunk, embeddingString]);
}
