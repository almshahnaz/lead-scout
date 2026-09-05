import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

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
