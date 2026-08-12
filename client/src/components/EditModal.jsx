import { useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const EditModal = ({ transaction, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'DEBIT',
  });

  // Populate inputs when a transaction is selected
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount || '',
        category: transaction.category || '',
        type: transaction.type || 'DEBIT',
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `http://localhost:5002/api/transactions/${transaction._id}`,
        formData
      );
      toast.success('Transaction updated successfully!');
      
      // Close modal
      document.getElementById('edit_modal').close();
      
      // Trigger re-fetch in parent component
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update');
    }
  };

  return (
    <dialog id="edit_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Transaction</h3>
        {transaction && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <input
              type="text"
              name="description"
              className="input input-bordered w-full"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              step="1"
              name="amount"
              className="input input-bordered w-full pr-5"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
            />
            
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => document.getElementById('edit_modal').close()}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default EditModal;