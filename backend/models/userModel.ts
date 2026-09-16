import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { pool } from "../db/pool.js";

export async function findUser(email: string) {
  const query = "SELECT * FROM users WHERE email = $1";

  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function createUser(email: string, passwordHash: string) {
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

export async function hashPassword(userPassword: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(userPassword, saltRounds);
  return hash;
}

export async function checkPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}
