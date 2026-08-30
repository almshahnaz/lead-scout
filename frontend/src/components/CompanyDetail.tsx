import type { CompanyResult } from "../data/fakeResults";

interface CompanyDetailProps {
  result: CompanyResult;
}

export default function CompanyDetail({ result }: CompanyDetailProps) {
  return (
    <div className="company-detail">
      <h2>{result.companyName}</h2>
      <p>Status: {result.status}</p>

      <p>{result.brief}</p>

      <p>{result.emailDraft}</p>
    </div>
  );
}
