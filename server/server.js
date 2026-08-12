import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionsRouter from "./routes/transactionRoutes.js";
import summaryRouter from "./routes/summaryRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js"
import { connectDB } from "./config/db.js";
// const cors = require('cors');

dotenv.config();

const app = express();

// // Middleware
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRouter)
app.use("/api/summary", summaryRouter)
app.use("/api/categories", categoryRouter)
const PORT = process.env.PORT || 5001;

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})