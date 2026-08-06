import Transaction from "../models/Transaction.js";


export async function getSummary(req, res){
    
    try{
        
      const result = await Transaction.aggregate([
      //1. Match for CREDIT
      {
        $match: { type: 'CREDIT' }
      },

      //2. Get sum of filtered items
      {
        $group: {
          _id: null,
          sumAmt: {$sum: '$amount'}
        }
      }
    ]);

    const totalEarnings = result.length > 0 ? result[0].sumAmt : 0;
    res.status(200).json({ totalEarnings });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

  // total money in
  const totalEarnings = async () => {
    
    return res.sumAmt;
  };

  res.status(200).json(totalEarnings);

}