import React, { useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/auth/" });

function InvestmentOptions() {
  const [formData, setFormData] = useState({
    name: "",
    min_investment: "",
    expected_return: "",
    risk_level: "LOW",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateOption = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "admin/investment-options/create/",
        formData,
      );
      setMessage(response.data.message);
      setError("");
      setFormData({
        name: "",
        min_investment: "",
        expected_return: "",
        risk_level: "LOW",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create investment option",
      );
      setMessage("");
      console.error("Create option error:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Investment Options</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Investment Option</h2>
        <form onSubmit={handleCreateOption} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Minimum Investment
            </label>
            <input
              type="number"
              name="min_investment"
              value={formData.min_investment}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Expected Return (%)
            </label>
            <input
              type="number"
              name="expected_return"
              value={formData.expected_return}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Risk Level</label>
            <select
              name="risk_level"
              value={formData.risk_level}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create Option
          </button>
        </form>
      </div>
    </div>
  );
}

export default InvestmentOptions;
