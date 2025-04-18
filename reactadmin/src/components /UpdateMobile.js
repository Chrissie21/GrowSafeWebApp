import React, { useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/auth/" });

function UpdateMobile() {
  const [userId, setUserId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`admin/user/${userId}/mobile/`, {
        mobile_number: mobileNumber,
      });
      setMessage(response.data.message);
      setError("");
      setUserId("");
      setMobileNumber("");
    } catch (error) {
      setError("Failed to update mobile number");
      setMessage("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Update User Mobile Number</h1>
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">User ID</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Update Mobile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateMobile;
