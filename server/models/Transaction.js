import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
});

// --- INDEXES ---
// Descriptions added in README.md

transactionSchema.index({ date: -1 });
transactionSchema.index({ amount: -1 });

transactionSchema.index({ type: 1, date: -1 });
transactionSchema.index({ type: 1, amount: -1 });

transactionSchema.index({ category: 1, date: -1 });
transactionSchema.index({ category: 1, amount: -1 });

transactionSchema.index({ description: 'text'});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction