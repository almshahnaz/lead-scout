import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { randomUUID, type UUID } from "crypto";
import { pool } from "./db/pool.js";
import type { PoolClient } from "pg";
import bcrypt from "bcrypt";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userID: string;
  }
}

const app = express();
const PORT = 3001;
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not set in .env");
}

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  }),
);

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

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userResult = await findUser(email);

    if (userResult) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await createUser(email, passwordHash);

    res.status(201).json({
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await findUser(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!(await checkPassword(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userID = user.id;
    res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/batches", requireAuth, async (req, res) => {
  const { companyNames } = req.body;
  const cleanedNames = companyNames
    .filter((name: string) => name.trim() !== "")
    .map((name: string) => name.trim());

  if (cleanedNames.length === 0) {
    return res.status(400).json({ error: "Please add at least 1 company" });
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
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.get(
  "/batches/:id",
  requireAuth,
  async (req: Request<{ id: string }>, res: Response) => {
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
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userID) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
}

async function checkPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}

async function createUser(email: string, passwordHash: string) {
  const id = randomUUID();
  const newUser = {
    id: id,
    email: email,
    password_hash: passwordHash,
  };

  const query =
    "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email";

  return await pool.query(query, [
    newUser.id,
    newUser.email,
    newUser.password_hash,
  ]);
}

async function hashPassword(userPassword: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(userPassword, saltRounds);
  return hash;
}

async function findUser(email: string) {
  const query = "SELECT * FROM users WHERE email = $1";

  const result = await pool.query(query, [email]);
  return result.rows[0];
}

async function createCompanyResult(
  result: CompanyResult,
  batchID: string,
  client: PoolClient,
) {
  const query =
    "INSERT INTO company_results (id, batch_run_id, company_name, status, brief, email_draft) VALUES ($1, $2, $3, $4, $5, $6)";

  await client.query(query, [
    result.id,
    batchID,
    result.companyName,
    result.status,
    result.brief,
    result.emailDraft,
  ]);
}

async function createBatch(
  userID: string,
  batchID: string,
  initialStatus: string,
  client: PoolClient,
) {
  const query =
    "INSERT INTO batch_runs (id, status, user_id) VALUES ($1, $2, $3)";

  await client.query(query, [batchID, initialStatus, userID]);
}

async function getCompanyResults(batchID: string): Promise<CompanyResult[]> {
  const query = "SELECT * FROM company_results WHERE batch_run_id = $1";

  const result = await pool.query(query, [batchID]);

  return result.rows.map((row) => ({
    id: row.id,
    companyName: row.company_name,
    status: row.status,
    brief: row.brief,
    emailDraft: row.email_draft,
  }));
}

async function getBatchByID(userID: string, id: string) {
  const query = "SELECT * FROM batch_runs WHERE id = $1 AND user_id = $2";

  const result = await pool.query(query, [id, userID]);
  return result.rows[0];
}

async function checkConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log(result);
  } catch (error) {
    console.error("Error: ", error);
  }
}

checkConnection();

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
