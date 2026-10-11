import { retrieveChunks } from "../models/embeddingModel.js";
import { embedChunk } from "../services/embeddings.js";

const companyResultId = "e6154739-a965-4993-a6b3-700af38e0202";

const query = "What does Anthropic do?";

const embedding = await embedChunk(query);
const chunkCount = 3;
const chunks = await retrieveChunks(companyResultId, embedding, chunkCount);

console.log(chunks);
