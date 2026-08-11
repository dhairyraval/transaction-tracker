import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import NavBar from "../components/NavBar"
import TransactionsTable from "../components/TransactionsTable"
import TransactionSearchFilter from '../components/TransactionSearchFilter';
import { SearchXIcon } from 'lucide-react';

const TransactionsPage = () => {

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categories: [],
    types: [],
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currPage: 1,
    limit: 10,
  });

  const [allCategories, setAllCategories] = useState([]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Reset to page 1 whenever filters change
    setPagination((prev) => ({ ...prev, currPage: 1 }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        const params = new URLSearchParams({
          page: pagination.currPage,
          limit: pagination.limit,
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.categories.length > 0 && { category: filters.categories.join(',') }),
          ...(filters.types.length > 0 && { type: filters.types.join(',') }),
        });
        const res = await axios.get(`http://localhost:5002/api/transactions/?${params}`);
        console.log(`call: http://localhost:5002/api/transactions/?${params}`);

        if (isMounted) {
          setTableData(res.data.data);
          setPagination(res.data.pagination);

          if (res.data.data.length > 0) {
            setAllCategories((prev) =>
              Array.from(new Set([...prev, ...res.data.data.map((t) => t.category).filter(Boolean)]))
            );
          }

          if (res.data.data.length === 0) {
            toast.error("No transactions found matching your criteria", <SearchXIcon />)
          }
        }
      } catch (err) {
        const errorMessage = err.message || 'Error fetching transactions.';
        console.error(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTransactions();
    return () => {
      isMounted = false; // Cleanup to prevent race conditions
    };
  }, [pagination.currPage, pagination.limit, filters]);

  // Handle page button selection
  const handlePageChange = (selectedPage) => {
    if (selectedPage !== Number(pagination.currPage)) {
      setPagination((prev) => ({
        ...prev,
        currPage: selectedPage,
      }));
    }
  };


  return <div className="min-h-screen">
    <NavBar />
    {loading ? (<div className='text-center text-primary py-10'>
      <span className="loading loading-spinner loading-lg"></span>
      Loading Transactions...
    </div>) : (
      <div className="px-8 flex-col gap-4 mt-5">
        <TransactionSearchFilter categories={allCategories} onApplyFilters={handleApplyFilters} />
        <TransactionsTable data={tableData || []} currPage={pagination.currPage} limit={pagination.limit} />
        <div className="flex justify-center mt-5">

          <div className="join">
            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const pageNum = index + 1;
              const isCurrent = Number(pagination.currPage) === pageNum;
              return (
                <input
                  key={pageNum}
                  className="join-item btn btn-square"
                  type="radio"
                  name="pagination-options"
                  aria-label={pageNum.toString()}
                  checked={isCurrent}
                  onChange={() => handlePageChange(pageNum)}
                />
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
}

export default TransactionsPage