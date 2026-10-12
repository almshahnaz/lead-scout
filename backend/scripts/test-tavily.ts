import { fetchCompanyInfo } from "../services/tavily.js";

const text = await fetchCompanyInfo("Acme");
console.log(text);
