import { useState, useEffect } from "react";
import "./App.css";
import BatchInputForm from "./components/BatchInputForm";
import ResultsTable from "./components/ResultsTable";
import { type CompanyResult } from "./data/fakeResults";
import CompanyDetail from "./components/CompanyDetail";

function App() {
  const [selectedResult, setSelectedResult] = useState<CompanyResult | null>(
    null,
  );

  const [results, setResults] = useState<CompanyResult[]>([]);

  const [health, setHealth] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      const response = await fetch("http://localhost:3001/health");
      const data = await response.json();
      setHealth(data.status);
    }
    checkHealth();
  }, []);

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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      const fetchBatch = await fetch(url + `/${result.id}`);

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
      <h1>Lead Scout</h1>
      <p>Helping you automate the outreach process</p>
      <BatchInputForm onSubmit={handleSubmit} />
      <ResultsTable
        onSelectResult={(result) => setSelectedResult(result)}
        results={results}
      />
      {selectedResult && <CompanyDetail result={selectedResult} />}
      {health && <p>{health}</p>}
    </>
  );
}

export default App;
