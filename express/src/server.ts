import { app } from "./api";
import { initDB } from "./db";

(async () => {
  await initDB();
  app.listen(5000, () => {
    console.log("Server is running");
  });
})();
