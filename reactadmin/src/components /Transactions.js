import React, { useState, useEffect } from "react";
import api from "../api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Currency TSh
  const formatTSh = (amount) => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0, // Adjust for no decimals if preferred
    }).format(amount);
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("admin/transactions/");
      setTransactions(response.data);
      setLoading(false);
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Network error";
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        setError(`Insufficient permissions: ${errorMessage}`);
      } else {
        setError(`Failed to fetch transactions: ${errorMessage}`);
      }
      setLoading(false);
      console.error("Transactions fetch error:", err.response || err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (id) => {
    if (!id) {
      setError("Invalid transaction ID");
      return;
    }
    try {
      await api.post(`admin/transaction/${id}/approve/`);
      await fetchTransactions();
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Network error";
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        setError(`Cannot approve transaction: ${errorMessage}`);
      } else {
        setError(`Failed to approve transaction: ${errorMessage}`);
      }
      console.error("Approve error:", err.response || err);
    }
  };

  const handleDecline = async (id) => {
    if (!id) {
      setError("Invalid transaction ID");
      return;
    }
    try {
      await api.post(`admin/transaction/${id}/decline/`, {
        notes: "Declined by admin",
      });
      await fetchTransactions();
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Network error";
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        setError(`Cannot decline transaction: ${errorMessage}`);
      } else {
        setError(`Failed to decline transaction: ${errorMessage}`);
      }
      console.error("Decline error:", err.response || err);
    }
  };

  const handleSetPending = async (id) => {
    if (!id) {
      setError("Invalid transaction ID");
      return;
    }
    try {
      await api.post(`admin/transaction/${id}/pending/`, {
        notes: "Set to pending by admin",
      });
      await fetchTransactions();
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Network error";
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        setError(`Cannot set transaction to pending: ${errorMessage}`);
      } else {
        setError(`Failed to set transaction to pending: ${errorMessage}`);
      }
      console.error("Set pending error:", err.response || err);
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
                <td className="p-4">{formatTSh(tx.amount)}</td>
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