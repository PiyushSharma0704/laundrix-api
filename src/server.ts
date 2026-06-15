import app from "./app";
import { env } from "./config/env";
import "../src/types/express";

app.listen(env.PORT, () => {
  console.log(
    `🚀 Laundrix API running on port ${env.PORT}`
  );
});