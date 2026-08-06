import fs, { createReadStream } from "fs";

import Transaction from "../models/Transaction.js";
import { parse } from "csv-parse";

export async function getAllTransactions(req, res){
  try {
    const transactions = await Transaction.find()
    res.status(200).json(transactions)

  } catch (error) {
    console.error("Error in getAllTransactions controller", error);
    res.status(500).json({message:"Internal server error"});
  }
}

export async function createTransaction(req, res){
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  let batch = [];
  const BATCH_SIZE = 1000;

  // line numbers and skipped rows
  let currLineNumber = 1;
  const skippedRows = [];

  const stream = createReadStream(req.file.path).pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

  stream.on("data", async (row) => {
    currLineNumber++;

    // error handling
    if (!row.date || isNaN(Date.parse(row.date))){
      skippedRows.push({ line: currLineNumber, reason: 'Invalid or missing date', rowData: row });
      return;
    }
    if (!row.amount || isNaN(Number(row.amount))){
      skippedRows.push({ line: currLineNumber, reason: 'Invalid amount', rowData: row});
      return;
    }
    if (!row.type || (row.type !== "CREDIT" && row.type !== "DEBIT")){
      skippedRows.push({line: currLineNumber, reason: 'Invalid type', rowData: row});
      return;
    }
    if(!row.description || row.description.trim() === ''){
      skippedRows.push({line: currLineNumber, reason: 'Invalid description', rowData: row});
      return;
    }
    if(!row.category || row.category.trim() === ''){
      skippedRows.push({line: currLineNumber, reason: 'Invalid category', rowData: row});
      return;
    }

    batch.push(row);
    if (batch.length >= BATCH_SIZE) {
      stream.pause();
      try {
        await Transaction.insertMany(batch);
        batch = [];
        stream.resume();
      } catch (err) {
        console.error('Error inserting batch:', err);
        stream.resume();
      }
    }
  });
  stream.on('end', async () => {
    try {
      if (batch.length > 0) {
        await Transaction.insertMany(batch);
      }
      fs.unlinkSync(req.file.path);
      res.status(201).json({ 
        message: 'Upload complete!',
        processedLines: currLineNumber - 1, // Exclude header
        savedLines: currLineNumber - skippedRows.length - 1,
        skippedCount: skippedRows.length,
        skippedDetails: skippedRows // Returns exact line numbers that failed
      });
    } catch (err) {
      res.status(500).json({ message: 'Error saving final batch', error: err.message });
    }
  });
}

export function updateTransaction(req, res){
  res.status(200).json({message: "transaction updated succesfully!"});
}

export function deleteTransaction(req, res){
  res.status(200).json({message: "transaction deleted succesfully!"});
}