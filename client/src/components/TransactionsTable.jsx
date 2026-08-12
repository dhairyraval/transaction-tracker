import { DeleteIcon, SquarePenIcon } from "lucide-react";
import { formatAmount, formatDate } from "../lib/utils"
const TransactionsTable = ({ data, currPage = 1, limit = 10, sortConfig, onSort, onEdit, onDelete}) => {

  if (data.length === 0) return;

  const renderSortArrow = (field) => {
    if (sortConfig.field !== field) return <span className="opacity-30"> ↕</span>;
    return sortConfig.order === 'asc' ? ' ▲' : ' ▼';
  };

  // table headers with extra column at the end for edit/delete
  const headers = [...Object.keys(data[0]).filter((key) => key !== "__v"), "actions"];

  return <div className="overflow-x-auto">
    <table className="table table-sm table-pin-rows">
      <thead>

        <tr>
          {headers
            .map((key) => (
              <th key={key} className="capitalize cursor-pointer select-none hover:bg-base-200"
                onClick={() => onSort(key)}>
                {key === "_id" ? "Sr. No." : key}{renderSortArrow(key.toString())}
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
              <td>{formatAmount(row.amount)}</td>
              <td>{row.type}</td>
              <td>{row.category}</td>
              <td>
                <span className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    onClick={() => onEdit(row)}
                  >
                    <SquarePenIcon className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    onClick={() => onDelete(row._id)}
                  >
                    <DeleteIcon className="h-6 w-6" />
                  </button>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
}
export default TransactionsTable