import mongoose from "mongoose";

// 1. create schema
// 2. create model based off schema

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
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction