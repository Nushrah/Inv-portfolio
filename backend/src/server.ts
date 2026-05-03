import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT) || 5000;
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on ${port}`);
});
