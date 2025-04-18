import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/auth/" });

function Dashboard() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    pending_transactions: 0,
    total_investments: 0,
    active_options: 0,
  });

  useEffect(() => {
    api
      .get("admin/metrics/")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch(() => {
        setMetrics({
          total_users: 100,
          pending_transactions: 10,
          total_investments: 50,
          active_options: 5,
        });
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{metrics.total_users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Pending Transactions</h2>
          <p className="text-2xl">{metrics.pending_transactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Investments</h2>
          <p className="text-2xl">{metrics.total_investments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Active Options</h2>
          <p className="text-2xl">{metrics.active_options}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
