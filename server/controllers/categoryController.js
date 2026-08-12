import Transaction from "../models/Transaction.js";


export async function getAllCategories(req, res) {
  try {
    const categoryArray = await Transaction.distinct("category");
    res.status(200).json({categoryArray});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}