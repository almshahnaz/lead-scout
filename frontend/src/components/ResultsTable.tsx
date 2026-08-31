import { type CompanyResult } from "../data/fakeResults";

interface ResultsTableProps {
  onSelectResult: (result: CompanyResult) => void;
  results: CompanyResult[];
}

export default function ResultsTable({
  onSelectResult,
  results,
}: ResultsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr
            key={result.id}
            onClick={() => {
              onSelectResult(result);
            }}
          >
            <td>{result.companyName}</td>
            <td>{result.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
