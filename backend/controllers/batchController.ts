import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { pool } from "../db/pool.js";
import {
  createBatch,
  createCompanyResult,
  getCompanyResults,
  getBatchByID,
  type CompanyResult,
  type BatchRun,
} from "../models/batchModel.js";

export async function createBatchHandler(req: Request, res: Response) {
  const { companyNames } = req.body;
  const cleanedNames = companyNames
    .filter((name: string) => name.trim() !== "")
    .map((name: string) => name.trim());

  if (cleanedNames.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide at least one company name" });
  }
  const batchID = randomUUID();
  const initialStatus = "pending";

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userID = req.session.userID;

    if (!userID) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    await createBatch(userID, batchID, initialStatus, client);

    const results: CompanyResult[] = [];
    for (const name of cleanedNames) {
      const result: CompanyResult = {
        id: randomUUID(),
        companyName: name,
        status: "pending",
        brief: "",
        emailDraft: "",
      };

      await createCompanyResult(result, batchID, client);

      results.push(result);
    }

    await client.query("COMMIT");

    const batch: BatchRun = { id: batchID, status: initialStatus, results };
    res.status(201).json(batch);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to create batch",
    });
  } finally {
    client.release();
  }
}

export async function getBatchHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  try {
    const userID = req.session.userID;

    if (!userID) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const batchRow = await getBatchByID(userID, id);

    if (!batchRow) {
      res.status(404).json({ error: "not found" });
      return;
    }

    const companyResults: CompanyResult[] = await getCompanyResults(id);

    const batch: BatchRun = {
      id: id,
      status: batchRow.status,
      results: companyResults,
    };

    res.status(200).json(batch);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: "Failed to retrieve batch",
    });
  }
}
