import { fetchCompanyInfo } from "../services/tavily.js";
import { chunkText } from "../services/chunker.js";
import { embedChunk } from "../services/embeddings.js";
import { createEmbedding } from "../models/embeddingModel.js";

const companyResultId = "e6154739-a965-4993-a6b3-700af38e0202";

const text = await fetchCompanyInfo("Anthropic");
const chunks = chunkText(text, 500, 100);

await Promise.all(
  chunks.map(async (chunk: string) => {
    const embedding = await embedChunk(chunk);

    await createEmbedding(companyResultId, chunk, embedding);
  }),
);
