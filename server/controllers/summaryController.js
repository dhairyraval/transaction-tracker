import Transaction from "../models/Transaction.js";

// --- HELPER FUNCTION (Aggregation Pipes) ---

const getTotals = () => 
  Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalIn: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } },
        totalOut: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } }
      }
    }
  ]);

const getCategoryTotals = () =>
  Transaction.aggregate([
    {
      $group : { 
        _id : "$category",
        totalAmounts: { $sum: "$amount"}
      } 
    }
  ]);

const getMonthlyTotals = () =>
  Transaction.aggregate([
    {
      $group : { 
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        totalIn: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } },
        totalOut: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } }
      }
    }
  ]);

const getLargestExpenses = () => 
  Transaction.aggregate([
    { $match: { type: "DEBIT" } },
    { $sort: { amount: -1 } },
    { $limit: 5 }
  ]);


export async function getSummary(req, res){
    
    try{

      const [totals, categoriesTotals, monthlyTotals, expenses] = await Promise.all([
        getTotals(),
        getCategoryTotals(),
        getMonthlyTotals(),
        getLargestExpenses()
      ]);

      let netDiff = 0;
      if (totals){
        netDiff = totals[0].totalIn - totals[0].totalOut;
      }
    
      res.status(200).json({
        totals: totals[0] || { totalIn: 0, totalOut: 0 },
        netDiff,
        categoriesTotals,
        monthlyTotals,
        expenses
      });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}