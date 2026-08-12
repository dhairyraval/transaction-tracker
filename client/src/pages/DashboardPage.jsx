// import React from 'react'
import { useEffect, useState } from 'react';
// import axios from "axios";
import api from "../lib/axios";
import toast from 'react-hot-toast';

import NavBar from '../components/NavBar';
import Card from '../components/Card';
import { formatAmount } from '../lib/utils';
import CustomDonutChart from '../components/CustomDonutChart';
import CustomBarChart from '../components/CustomBarChart';
import CustomTable from '../components/CustomTable';


const DashboardPage = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("http://localhost:5002/api/summary");
        setSummary(res.data);
      } catch (err) {
        const errorMessage = err.message || 'Upload failed. Please try again.';
        console.error(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return <div className='min-h-screen'>
    <NavBar />
    <div className="max-w-7xl mx-auto p-4 mt-6">
      {loading && <div className='text-center text-primary py-10'>Loading Summary...</div>}

      {Object.keys(summary).length > 0 && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
            <Card title={"Total Money In"} data={formatAmount(summary.totals.totalIn)} />
            <Card title={"Total Money Out"} data={formatAmount(summary.totals.totalOut)} />
            <Card title={"Net Balance"} data={formatAmount(summary.netDiff)} />
            <Card title={"Total Transactions"} data={summary.totalCount} />
          </div>
          <div className='grid grid-cols-3'>
            <CustomDonutChart data={summary.categoriesTotals} />
            <CustomBarChart data={summary.monthlyTotals} />
            <CustomTable data={summary.expenses} />
          </div>
        </>
      )}
    </div>
  </div>

}

export default DashboardPage