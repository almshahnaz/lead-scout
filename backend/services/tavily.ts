process.loadEnvFile();

const BASE_URL = "https://api.tavily.com/search";

export async function fetchCompanyInfo(companyName: string): Promise<string> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query: `${companyName} company homepage`,
      max_results: 3,
      include_raw_content: "text",
    }),
  });

  const data = await response.json();

  if (!data.results) {
    throw new Error("Unable to fetch company data.");
  }

  const combinedText = data.results
    .map((result: { raw_content: string }) => result.raw_content)
    .join("\n\n");

  return combinedText;
}
