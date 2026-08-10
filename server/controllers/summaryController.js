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
      $group: {
        _id: "$category",
        totalAmounts: { $sum: "$amount" }
      }
    },
    {
      $project: {
        totalAmounts: { $round: ["$totalAmounts", 2] }
      }
    }
  ]);

const getMonthlyTotals = () =>
  Transaction.aggregate([
    {
      $group: {
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

const getTotalCount = () =>
  Transaction.countDocuments();


export async function getSummary(req, res) {

  try {

    const [totals, categoriesTotals, monthlyTotals, expenses, totalCount] = await Promise.all([
      getTotals(),
      getCategoryTotals(),
      getMonthlyTotals(),
      getLargestExpenses(),
      getTotalCount()
    ]);

    let netDiff = 0;
    if (totals) {
      netDiff = totals[0].totalIn - totals[0].totalOut;
    }

    res.status(200).json({
      totals: totals[0] || { totalIn: 0, totalOut: 0 },
      netDiff,
      categoriesTotals,
      monthlyTotals,
      expenses,
      totalCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}