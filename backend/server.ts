import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 3001;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
