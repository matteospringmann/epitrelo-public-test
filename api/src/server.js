// api/src/server.js
import { app } from "./index.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`API server listening on http://localhost:${PORT}`);
});
