import app from "./app.js";
import { checkConnection } from "./db/pool.js";

const PORT = 3001;

checkConnection();

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
