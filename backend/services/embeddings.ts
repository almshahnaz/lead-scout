import OpenAI from "openai";

process.loadEnvFile();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedChunk(chunk: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: chunk,
  });

  if (!response.data[0]) {
    throw new Error("Unable to create embedding");
  }

  return response.data[0].embedding;
}
