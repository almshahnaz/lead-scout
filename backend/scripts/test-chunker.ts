import { fetchCompanyInfo } from "../services/tavily.js";
import { chunkText } from "../services/chunker.js";

const text = await fetchCompanyInfo("Anthropic");

const results = chunkText(text, 500, 100);

console.log(results.length);

const chunkSizes = results.map((result: string) => result.length);

console.log(chunkSizes);
