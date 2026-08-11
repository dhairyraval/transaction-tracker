import toast from 'react-hot-toast';
import { FunnelIcon } from "lucide-react";


const TransactionSearchFilter = ({ categories = [], onApplyFilters }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Extract form values using the inputs' "name" attributes
    const formData = new FormData(e.currentTarget);
    const filterData = {
      startDate: formData.get('startDate'), // "2026-08-01" or ""
      endDate: formData.get('endDate'),     // "2026-08-11" or ""
      categories: formData.getAll('categories'), // Array: ["Rent", "Groceries"]
      types: formData.getAll('types'),          // Array: ["DEBIT", "CREDIT"]
    };

    if (onApplyFilters) {
      onApplyFilters(filterData);      
    }

    console.log('Submitted Filters:', filterData);
    e.currentTarget.closest('dialog')?.close();
    toast.success('filters applied')
  }

  const handleCancel = (e) => {
    e.currentTarget.closest('dialog')?.close();
  };

  return (
    <div className="flex items-center justify-center gap-4 py-3 w-full">
      <label className="input input-bordered flex items-center gap-2 w-[70%]">
        <input type="text" className="grow" placeholder=" Search..." />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd" />
        </svg>
      </label>

      <button
        type="button"
        className="btn btn-ghost btn-circle"
        onClick={() => document.getElementById('my_modal_3').showModal()}
      >
        <FunnelIcon className="h-6 w-6 text-base-content/70" />
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">

          <form method="dialog" onSubmit={handleSubmit}>
            <div className="pt-6 pb-12 space-y-4">
              <div>
                <label className="label text-sm font-semibold">Date Range:</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* From Date */}
                  <div className="form-control">
                    <span className="label-text text-xs text-base-content/70 mb-1">From (Optional)</span>
                    <input
                      type="date"
                      name="startDate"
                      className="input input-bordered input-sm w-full"
                    />
                  </div>

                  {/* To Date */}
                  <div className="form-control">
                    <span className="label-text text-xs text-base-content/70 mb-1">To (Optional)</span>
                    <input
                      type="date"
                      name="endDate"
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="dropdown">
                <label className="label text-sm font-semibold">Transaction Category:</label>
                <div tabIndex={0} role="button" className="btn btn-outline m-1">
                  Select Categories ▼
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-52 space-y-1">
                  {categories.map((category) => {
                    return (
                      <li key={category}>
                        <label className="label cursor-pointer justify-start gap-3">
                          <input type="checkbox" name="categories" value={category} defaultChecked className="checkbox checkbox-sm" />
                          <span className="label-text">{category}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div>
                <label className="label text-sm font-semibold">Transaction Type:</label>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    DEBIT
                    <input type="checkbox" name="types"
                      value="DEBIT" defaultChecked className="checkbox" />
                  </label>
                  <label className="label cursor-pointer">
                    CREDIT
                    <input type="checkbox" name="types"
                      value="CREDIT" defaultChecked className="checkbox" />
                  </label>
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" value="cancel" onClick={handleCancel}>✕</button>
            <button className="btn btn-success absolute right-3 bottom-3">Submit</button>
          </form>
          <h3 className="font-bold text-lg absolute left-3 top-3">Filter Transactions</h3>
          <p className="py-4 text-sm">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </div>
  )
}

export default TransactionSearchFilter