// Pretend results, standing in for what the real backend will eventually return.
// Every component built in Section 2 reads from here instead of a server.

export interface CompanyResult {
  id: string;
  companyName: string;
  status: "done" | "pending" | "failed";
  brief: string;
  emailDraft: string;
}

export const fakeResults: CompanyResult[] = [
  {
    id: "1",
    companyName: "Acme Robotics",
    status: "done",
    brief:
      "Acme Robotics builds warehouse picking robots and just raised a Series B.",
    emailDraft:
      "Hi team, congrats on the Series B — noticed you're scaling warehouse ops...",
  },

  {
    id: "2",
    companyName: "Globex Corporation",
    status: "pending",
    brief: "",
    emailDraft: "",
  },
  {
    id: "3",
    companyName: "Initech",
    status: "failed",
    brief: "Failed to retrieve information for Initech.",
    emailDraft:
      "Failed to retrieve information for Initech. Please check the company name and try again.",
  },
];
