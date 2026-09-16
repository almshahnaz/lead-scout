const BASE_URL = "http://localhost:3001";

async function post(path: string, body?: unknown) {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response;
}

export async function signup(email: string, password: string) {
  await post("/signup", { email, password });
}

export async function login(email: string, password: string) {
  const response = await post("/login", { email, password });
  return await response.json();
}

export async function logout() {
  await post("/logout");
}
