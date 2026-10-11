import { embedChunk } from "../services/embeddings.js";
import { retrieveChunks } from "../models/embeddingModel.js";
import { generateBrief } from "../services/generation.js";
import { updateCompanyResult } from "../models/batchModel.js";

const companyName = "Anthropic";

const companyResultId = "e6154739-a965-4993-a6b3-700af38e0202";

const query = "What does Anthropic do?";

const embedding = await embedChunk(query);
const chunkCount = 3;
const chunks = await retrieveChunks(companyResultId, embedding, chunkCount);

const result = await generateBrief(companyName, chunks);

console.log(result);

await updateCompanyResult(
  companyResultId,
  result.brief,
  result.emailDraft,
  "done",
);
