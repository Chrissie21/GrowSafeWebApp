import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/auth/" });

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("admin/transactions/")
      .then((response) => {
        setTransactions(response.data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setError(`Failed to fetch transactions: ${err.response?.status === 403 ? 'Insufficient permissions (superuser required)' : err.response?.status || 'Network error'}`);
        setLoading(false);
        console.error("Transactions fetch error:", err);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`admin/transaction/${id}/approve/`);
      setTransactions(
        transactions.map((tx) =>
          tx.id === id
            ? { ...tx, status: "APPROVED", processed_by: "You" }
            : tx,
        ),
      );
      setError("");
    } catch (err) {
      setError("Failed to approve transaction");
      console.error("Approve error:", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.post(`admin/transaction/${id}/decline/`, {
        notes: "Declined by admin",
      });
      setTransactions(
        transactions.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                status: "DECLINED",
                processed_by: "You",
                notes: "Declined by admin",
              }
            : tx,
        ),
      );
      setError("");
    } catch (err) {
      setError("Failed to decline transaction");
      console.error("Decline error:", err);
    }
  };

  const handleSetPending = async (id) => {
    try {
      await api.post(`admin/transaction/${id}/pending/`, {
        notes: "Set to pending by admin",
      });
      setTransactions(
        transactions.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                status: "PENDING",
                processed_by: null,
                notes: "Set to pending by admin",
              }
            : tx,
        ),
      );
      setError("");
    } catch (err) {
      setError("Failed to set transaction to pending");
      console.error("Set pending error:", err);
    }
  };

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Transaction ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="p-4">{tx.transaction}</td>
                <td className="p-4">{tx.user}</td>
                <td className="p-4">{tx.type}</td>
                <td className="p-4">${tx.amount}</td>
                <td className="p-4">{tx.status}</td>
                <td className="p-4">{tx.mobile_number || "N/A"}</td>
                <td className="p-4">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {tx.status !== "APPROVED" && (
                      <button
                        onClick={() => handleApprove(tx.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    {tx.status !== "DECLINED" && (
                      <button
                        onClick={() => handleDecline(tx.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Decline
                      </button>
                    )}
                    {tx.status !== "PENDING" && (
                      <button
                        onClick={() => handleSetPending(tx.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Set Pending
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
