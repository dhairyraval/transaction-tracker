import { useState } from 'react';
// import axios from 'axios';
import api from "../lib/axios";

import toast from 'react-hot-toast';

import NavBar from "../components/NavBar"

const UploadPage = () => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file first.")
      return;
    }

    // checking uploaded file type
    const isCsvMime = file.type === "text/csv";
    const isCsvExt = file.name.toLowerCase().endsWith(".csv");

    if (!isCsvMime && !isCsvExt) {
      setFile(null);
      toast.error("Please select a valid CSV file.");
      e.target.reset();
      return;
    }
    
    setLoading(true);
    setResponse(null);

    // Prepare multipart form data
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const res = await api.post('http://localhost:5002/api/transactions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setResponse(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(errorMessage);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  return <div className='min-h-screen'>
    <NavBar />
    <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-4 m-6">
      <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" onChange={handleFileChange}/>
      <button type="submit" disabled={loading} className="btn btn-outline btn-primary">
        {loading ? <span className="loading loading-spinner"></span> : 'Upload'}
      </button>
    </form>

    {/* Response Display */}
    {response && (
      <div className="alert alert-success max-w-max mt-2">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    )}
  </div>
}

export default UploadPage