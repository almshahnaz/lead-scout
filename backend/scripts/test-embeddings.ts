import { embedChunk } from "../services/embeddings.js";

const response = await embedChunk("Anthropic is an AI safety company");

console.log(response.length);
