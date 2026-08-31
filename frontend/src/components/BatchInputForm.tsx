import { useState } from "react";

interface BatchInputFormProps {
  onSubmit: (companyText: string) => void;
}

export default function BatchInputForm({ onSubmit }: BatchInputFormProps) {
  const [companyText, setCompanyText] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit(companyText);
      }}
    >
      <label htmlFor="companies">Paste company names, one per line</label>
      <textarea
        id="companies"
        value={companyText}
        onChange={(event) => {
          setCompanyText(event.target.value);
        }}
      />
      <button type="submit">Find Leads</button>
    </form>
  );
}
