import axios from "axios";
import toast from "react-hot-toast";

const DeleteModal = ({ transactionId, onSuccess }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5002/api/transactions/${transactionId}`);
      toast.success("Transaction deleted!");
      document.getElementById('delete_modal').close();
      if (onSuccess) onSuccess(); // Trigger table re-fetch
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <dialog id="delete_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
        <p className="py-4">Are you sure you want to delete this transaction?</p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal