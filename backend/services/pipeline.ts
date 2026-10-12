import { fetchCompanyInfo } from "./tavily.js";
import { chunkText } from "./chunker.js";
import { embedChunk } from "./embeddings.js";
import { generateBrief } from "./generation.js";
import { createEmbedding, retrieveChunks } from "../models/embeddingModel.js";
import {
  updateCompanyResult,
  markCompanyResultFailed,
} from "../models/batchModel.js";

export async function processCompanyResearch(
  companyResultId: string,
  companyName: string,
): Promise<void> {
  const chunkSize = 500;
  const overlap = 100;
  try {
    const companyText = await fetchCompanyInfo(companyName);

    const chunks = chunkText(companyText, chunkSize, overlap);

    await Promise.all(
      chunks.map(async (chunk: string) => {
        const chunkEmbedding = await embedChunk(chunk);

        await createEmbedding(companyResultId, chunk, chunkEmbedding);
      }),
    );

    const query = `What does ${companyName} do?`;

    const queryEmbedding = await embedChunk(query);
    const chunkCount = 3;
    const retrieved = await retrieveChunks(
      companyResultId,
      queryEmbedding,
      chunkCount,
    );

    const result = await generateBrief(companyName, retrieved);

    await updateCompanyResult(
      companyResultId,
      result.brief,
      result.emailDraft,
      "done",
    );
  } catch (error) {
    console.error(error);
    await markCompanyResultFailed(companyResultId);
  }
}
