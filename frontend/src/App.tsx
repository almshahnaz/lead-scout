import { useState } from "react";
import "./App.css";
import BatchInputForm from "./components/BatchInputForm";
import ResultsTable from "./components/ResultsTable";
import { type CompanyResult } from "./data/fakeResults";
import CompanyDetail from "./components/CompanyDetail";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

function App() {
  const [selectedResult, setSelectedResult] = useState<CompanyResult | null>(
    null,
  );

  const [results, setResults] = useState<CompanyResult[]>([]);

  const [loggedIn, setLoggedIn] = useState<{
    id: string;
    email: string;
  } | null>(null);

  const [showSignup, setShowSignup] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSignup(email: string, password: string) {
    setError(null);

    const url = "http://localhost:3001/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }

      handleLogin(email, password);
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to reach the server. Please try again.");
    }
  }

  async function handleLogin(email: string, password: string) {
    setError(null);

    const url = "http://localhost:3001/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }

      const result = await response.json();

      setLoggedIn(result);
      setResults([]);
      setSelectedResult(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to reach the server. Please try again.");
    }
  }

  async function handleLogout() {
    const url = "http://localhost:3001/logout";

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setLoggedIn(null);
        setResults([]);
        setSelectedResult(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleSubmit(companyText: string) {
    const url = "http://localhost:3001/batches";
    const companyNames = companyText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyNames }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      const fetchBatch = await fetch(url + `/${result.id}`, {
        credentials: "include",
      });

      if (!fetchBatch.ok) {
        throw new Error(`HTTP error! Status: ${fetchBatch.status}`);
      }

      const batchData = await fetchBatch.json();

      setResults(batchData.results);
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <>
      {loggedIn ? (
        <>
          <button onClick={handleLogout}>Log Out</button>
          <h1>Lead Scout</h1>
          <p>Helping you automate the outreach process</p>
          <BatchInputForm onSubmit={handleSubmit} />
          <ResultsTable
            onSelectResult={(result) => setSelectedResult(result)}
            results={results}
          />
          {selectedResult && <CompanyDetail result={selectedResult} />}
        </>
      ) : showSignup ? (
        <SignupForm
          onSubmit={handleSignup}
          onToggle={() => {
            setShowSignup(!showSignup);
            setError(null);
          }}
          error={error}
        />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          onToggle={() => {
            setShowSignup(!showSignup);
            setError(null);
          }}
          error={error}
        />
      )}
    </>
  );
}

export default App;
