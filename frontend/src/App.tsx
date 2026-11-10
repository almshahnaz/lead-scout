import { useEffect, useState } from "react";
import "./App.css";
import BatchInputForm from "./components/BatchInputForm";
import ResultsTable from "./components/ResultsTable";
import { type CompanyResult } from "./data/fakeResults";
import CompanyDetail from "./components/CompanyDetail";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import * as authApi from "./api/auth";
import * as batchesApi from "./api/batches";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [selectedResult, setSelectedResult] = useState<CompanyResult | null>(
    null,
  );

  const [results, setResults] = useState<CompanyResult[]>([]);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  const [showSignup, setShowSignup] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSignup(email: string, password: string) {
    setError(null);

    try {
      await authApi.signup(email, password);
      handleLogin(email, password);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  async function handleLogin(email: string, password: string) {
    setError(null);

    try {
      await authApi.login(email, password);

      setLoggedIn(true);
      setResults([]);
      setSelectedResult(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  async function handleLogout() {
    try {
      await authApi.logout();

      setLoggedIn(false);
      setResults([]);
      setSelectedResult(null);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleSubmit(companyText: string) {
    const companyNames = companyText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    try {
      const batch = await batchesApi.createBatch(companyNames);

      setResults(batch.results);
      await pollBatch(batch.id);
    } catch (error) {
      console.error("Error", error);
    }
  }

  async function pollBatch(batchID: string) {
    const MAX_ATTEMPTS = 40;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await sleep(3000);

      const batch = await batchesApi.getBatch(batchID);

      setResults(batch.results);

      if (batch.status === "done") {
        return;
      }
    }
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const batches = await batchesApi.listBatches();

        if (batches !== null) {
          setLoggedIn(true);
          setResults(batches.flatMap((batch) => batch.results));
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  if (checkingSession) {
    return null;
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
