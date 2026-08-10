import { formatDate } from "../lib/utils"

const CustomTable = ({ data }) => {
  return <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {data.map((expense, index) => (
        <tr key={expense._id} className="hover">
        <th>{index + 1}</th>
        <td>{formatDate(expense.date)}</td>
        <td>{expense.description}</td>
        <td>{expense.amount}</td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
  
}

export default CustomTable