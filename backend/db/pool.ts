import { Pool } from "pg";

process.loadEnvFile();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function checkConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log(result);
  } catch (error) {
    console.error("Error: ", error);
  }
}
