import fs, { createReadStream } from "fs";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { parse } from "csv-parse";

export async function getAllTransactions(req, res){
  try {
    const { 
      page = 1,
      limit = 10,
      startDate,
      endDate, 
      category, 
      type,
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query

    // dynamic filter obj
    const filter = {}

    // adding filters based on query params
    if(category){ filter.category = category; }
    if(type){ filter.type = type; }

    // text search filter using regex + options
    if(search && search.trim() !== '') {
      filter.description = { $regex: search.trim(), $options: 'i' };

      // --- for case sensitive and full word matches ---
      // filter.$text = { $search: search };
    }

    if(startDate || endDate){
      filter.date = {}
      if(startDate){ filter.date.$gte = new Date(startDate) }
      if(endDate){ filter.date.$lte = new Date(endDate) }
    }

    // sorting & pagination logic
    const sort = {[sortBy]: sortOrder === 'asc' ? 1 : -1};
    const skip = (page - 1) * limit;

    const[transations, transactionCount] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limit),
      Transaction.countDocuments(filter)
    ]);

    res.status(200).json({
      data: transations,
      pagination: {
        totalItems: transactionCount,
        totalPages: Math.ceil(transactionCount/limit),
        currPage: page,
        limit: limit
      }
    });

  } catch (error) {
    console.error("Error in getAllTransactions controller", error);
    res.status(500).json({message:"Internal server error"});
  }
}

export async function getTransaction(req, res){
  const transactionID = req.params.id;

  // Validating if the given ID exists & is valid
  if (!transactionID) return res.status(400).json({message:"Bad request -- missing id"});
  if (!mongoose.Types.ObjectId.isValid(transactionID)) return res.status(400).json({ message: `Invalid ID format: ${transactionID}` });
  try {
    const transaction = await Transaction.findById(transactionID);
    // if transaction with given ID does not exist in DB
    if (!transaction) {
      console.log(`Transaction not found - transactionID: $(transactionID)`);
      res.status(404).json({ message:`Transaction not found -- transactionID: ${transactionID}` });
    }
    // transaction found!
    res.status(200).json(transaction)

  } catch (error) {
    console.error("Error in getTransaction controller", error);
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

  const stream = createReadStream(req.file.path).pipe(parse({ columns: true, skip_empty_lines: true, trim: true, relax_column_count: true, relax_column_count_less: true }));

  stream.on("data", async (row) => {
    currLineNumber++;
    // error handling

    // Date validation
    // regex for validating date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!row.Date || !dateRegex.test(row.Date.trim())){
      skippedRows.push({ line: currLineNumber, reason: 'Missing or Invalid Date Format', rowData: row });
      return;
    }

    const [year, month, day] = row.Date.trim().split('-').map(Number);

    // Date.UTC creates a date obj while auto correcting out of bound dates
    const parsedDate = new Date(Date.UTC(year, month - 1, day));  // month - 1 as Date uses months indexed from 0

    const isValidCalendarDate = 
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day;

    if (!isValidCalendarDate) {
      skippedRows.push({ line: currLineNumber, reason: 'Non-existent calendar date', rowData: row });
      return;
    }

    // Amount validation
    if (!row.Amount || isNaN(Number(row.Amount))){
      skippedRows.push({ line: currLineNumber, reason: 'Invalid amount', rowData: row});
      return;
    }
    if(Number(row.Amount) < 0){
      skippedRows.push({ line: currLineNumber, reason: 'Amount cannot be less than 0', rowData: row});
      return;
    }

    // Type validation
    if (!row.Type || (row.Type.toUpperCase() !== "CREDIT" && row.Type.toUpperCase() !== "DEBIT")){
      skippedRows.push({line: currLineNumber, reason: 'Invalid type', rowData: row});
      return;
    }

    // Description validation
    if(!row.Description || row.Description.trim() === ''){
      skippedRows.push({line: currLineNumber, reason: 'Invalid description', rowData: row});
      return;
    }

    // Category validation
    if(!row.Category || row.Category.trim() === ''){
      skippedRows.push({line: currLineNumber, reason: 'Invalid category', rowData: row});
      return;
    }

    // batch.push(row); // not used as we convert the col names to match mongoose schema 

    batch.push({
      date: row.Date,
      amount: Number(row.Amount), 
      type: row.Type.toUpperCase(),
      description: row.Description,
      category: row.Category
    });

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

export async function updateTransaction(req, res){
  const transactionID = req.params.id;

  // Validating if the given ID exists & is valid
  if (!transactionID) return res.status(400).json({message:"Bad request -- missing id"});
  if (!mongoose.Types.ObjectId.isValid(transactionID)) return res.status(400).json({ message: `Invalid ID format: ${transactionID}` });

  // Validate empty body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      transactionID,
      req.body, // Mongoose only updates fields present in req.body
      { returnDocument: "after", runValidators: true }
    );
    // if transaction with given ID does not exist in DB
    if (!transaction) {
      console.log(`Transaction not found - transactionID: ${transactionID}`);
      res.status(404).json({ message:`Could not update -- Transaction with transactionID: ${transactionID} not found` });
    }

    // transaction updated successfully
    res.status(200).json(transaction)

  } catch (error) {
    console.error("Error in updateTransaction controller", error);
    res.status(500).json({message:"Internal server error"});
  }
}

export async function deleteTransaction(req, res){
  const transactionID = req.params.id;

  // Validating if the given ID exists & is valid
  if (!transactionID) return res.status(400).json({message:"Bad request -- missing id"});
  if (!mongoose.Types.ObjectId.isValid(transactionID)) return res.status(400).json({ message: `Invalid ID format: ${transactionID}` });

  try {
    const transaction = await Transaction.findByIdAndDelete(transactionID);
    // if transaction with given ID does not exist in DB
    if (!transaction) {
      console.log(`Not deleted as Transaction with transactionID: ${transactionID} not found`);
      res.status(404).json({ message:`Could not delete -- Transaction with transactionID: ${transactionID} not found` });
    }
    // transaction deleted from DB
    res.status(200).json(transaction)

  } catch (error) {
    console.error("Error in updateTransaction controller", error);
    res.status(500).json({message:"Internal server error"});
  }
}