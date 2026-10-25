import app from "./app.js";
import { checkConnection } from "./db/pool.js";

const DEFAULT_PORT = "3001";
const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);

checkConnection();

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
