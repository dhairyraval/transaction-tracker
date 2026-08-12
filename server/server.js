import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import transactionsRouter from "./routes/transactionRoutes.js";
import summaryRouter from "./routes/summaryRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js"
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()

// Middleware

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json());

app.use("/api/transactions", transactionsRouter)
app.use("/api/summary", summaryRouter)
app.use("/api/categories", categoryRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client", "dist")))

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"))
  })
}

connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})