import { useState, useEffect } from "react";
import "./App.css";
import BatchInputForm from "./components/BatchInputForm";
import ResultsTable from "./components/ResultsTable";
import { fakeResults, type CompanyResult } from "./data/fakeResults";
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

  function handleSubmit(companyText: string) {
    const companyNames = companyText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    const validCompanies = companyNames.map((name) => {
      const match = fakeResults.find((result) =>
        result.companyName.toLowerCase().includes(name.toLowerCase()),
      );

      const companyNotFound: CompanyResult = {
        id: name,
        companyName: name,
        status: "pending",
        brief: "No data for this company",
        emailDraft: "",
      };
      return match ? match : companyNotFound;
    });

    setResults(validCompanies);
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
