import { type CompanyResult } from "../data/fakeResults";

const BASE_URL = "http://localhost:3001";

interface BatchRun {
  id: string;
  status: "pending" | "done";
  results: CompanyResult[];
}

export async function createBatch(companyNames: string[]): Promise<BatchRun> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyNames }),
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function getBatch(id: string): Promise<BatchRun> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/batches/${id}`, {
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
