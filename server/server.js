import express from "express";
import dotenv from "dotenv";
import transactionsRouter from "./routes/transactionRoutes.js"
import { connectDB } from "./config/db.js";
// const cors = require('cors');

dotenv.config();

const app = express();

connectDB();

// // Middleware
// app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRouter)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});