import { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onToggle: () => void;
  error: string | null;
}

export default function LoginForm({
  onSubmit,
  onToggle,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h1>Log In</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          onSubmit(email, password);
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          type="email"
        ></input>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          type="password"
        ></input>
        <button type="submit">Log In</button>
      </form>
      {error && <p className="form-error">{error}</p>}
      <p>
        Don't have an account?{" "}
        <button type="button" className="link-button" onClick={onToggle}>
          Sign Up
        </button>
      </p>
    </>
  );
}
