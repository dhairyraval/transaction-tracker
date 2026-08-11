import { formatDate } from "../lib/utils"
const TransactionsTable = ({ data, currPage = 1, limit = 10 }) => {

  if (data.length === 0) return;
  
  // table headers with extra column at the end for edit/delete
  const headers = [...Object.keys(data[0]).filter((key) => key !== "__v"), "actions"];

  return <div className="overflow-x-auto">
    <table className="table table-sm table-pin-rows">
      <thead>
        
        <tr>
          {headers
            .map((key) => (
              <th key={key} className="capitalize">
                {key === "_id" ? "Sr. No." : key}
              </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          // Calculate continuous serial number across pages
          const serialNumber = (currPage - 1) * limit + index + 1;

          return (
            <tr key={row._id} className="hover">
              <th>{serialNumber}</th>
              <td>{formatDate(row.date)}</td>
              <td>{row.description}</td>
              <td>{row.amount}</td>
              <td>{row.type}</td>
              <td>{row.category}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
}
export default TransactionsTable