import express from "express";
import multer from "multer";
import { createTransaction, deleteTransaction, getAllTransactions, updateTransaction } from "../controllers/transactionsController.js";

const router = express.Router();

// multer config to save files temporarily to an 'uploads' folder
const upload = multer({ dest: '../uploads/' });

router.get("/", getAllTransactions);
router.post("/upload", upload.single('csvFile'), createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router