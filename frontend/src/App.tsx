import { useState } from "react";
import "./App.css";
import BatchInputForm from "./components/BatchInputForm";
import ResultsTable from "./components/ResultsTable";
import { type CompanyResult } from "./data/fakeResults";
import CompanyDetail from "./components/CompanyDetail";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import * as authApi from "./api/auth";
import * as batchesApi from "./api/batches";

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
      const result = await authApi.login(email, password);

      setLoggedIn(result);
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

      setLoggedIn(null);
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
      const batchData = await batchesApi.getBatch(batch.id);

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
