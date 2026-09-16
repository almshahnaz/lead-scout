import type { Request, Response } from "express";
import {
  findUser,
  createUser,
  hashPassword,
  checkPassword,
} from "../models/userModel.js";

export async function signup(req: Request, res: Response) {
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
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Failed to sign up",
    });
  }
}

export async function login(req: Request, res: Response) {
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
    res.status(500).json({
      error: "Failed to log in",
    });
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
}
