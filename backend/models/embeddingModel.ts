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

export async function retrieveChunks(
  companyResultID: string,
  embedding: number[],
  chunkCount: number,
) {
  const embeddingString = JSON.stringify(embedding);
  const query =
    "SELECT chunk FROM company_embeddings WHERE company_result_id = $1 ORDER BY embedding <=> $2 LIMIT $3 ";

  const result = await pool.query(query, [
    companyResultID,
    embeddingString,
    chunkCount,
  ]);

  const chunks = result.rows.map((row) => row.chunk);

  return chunks;
}
