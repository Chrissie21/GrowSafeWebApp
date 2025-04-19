import React, { useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/auth/" });

function Users() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_staff: false,
  });
  const [deleteUserId, setDeleteUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("admin/users/create/", formData);
      setMessage(response.data.message);
      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_staff: false,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
      setMessage("");
      console.error("Create user error:", err);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(`admin/user/${deleteUserId}/delete/`);
      setMessage(response.data.message);
      setError("");
      setDeleteUserId("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
      setMessage("");
      console.error("Delete user error:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleInputChange}
                className="mr-2"
              />
              Admin User
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Delete User</h2>
        <form onSubmit={handleDeleteUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">User ID</label>
            <input
              type="number"
              value={deleteUserId}
              onChange={(e) => setDeleteUserId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Delete User
          </button>
        </form>
      </div>
    </div>
  );
}

export default Users;
