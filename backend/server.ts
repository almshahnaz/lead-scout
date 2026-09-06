import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

const batchRuns: BatchRun[] = [];

interface CompanyResult {
  id: string;
  companyName: string;
  status: "done" | "pending" | "failed";
  brief: string;
  emailDraft: string;
}

interface BatchRun {
  id: string;
  status: "pending" | "done";
  results: CompanyResult[];
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

app.post("/batches", (req, res) => {
  const { companyNames } = req.body;

  const results = companyNames.map((name: string) => {
    const result: CompanyResult = {
      id: randomUUID(),
      companyName: name,
      status: "pending",
      brief: "",
      emailDraft: "",
    };

    return result;
  });

  const batch: BatchRun = {
    id: randomUUID(),
    status: "pending",
    results,
  };

  batchRuns.push(batch);

  res.json(batch);
});

app.get("/batches/:id", (req, res) => {
  const { id } = req.params;

  const match = batchRuns.find((batch) => {
    return batch.id === id;
  });

  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ error: "not found" });
  }
});
