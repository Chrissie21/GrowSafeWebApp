import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/auth/' });

// Add interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Dashboard() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    pending_transactions: 0,
    total_investments: 0,
    active_options: 0,
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ id: 0, first_name: '', last_name: '', email: '' });

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const [metricsResponse, usersResponse] = await Promise.all([
        api.get('admin/metrics/'),
        api.get('admin/users/'),
      ]);
      console.log('Metrics response:', metricsResponse.data);
      console.log('Users response:', usersResponse.data);
      setMetrics(metricsResponse.data);
      setUsers(usersResponse.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback for environments without optional chaining
      const status = err.response && err.response.status ? err.response.status : 'Unknown';
      const errorMessage = err.response && err.response.status === 403
        ? 'Insufficient permissions (superuser required)'
        : `Network error (Status: ${status})`;
      setError(`Failed to fetch data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`admin/user/${editForm.id}/update/`, editForm);
      setUsers(users.map((user) =>
        user.id === editForm.id
          ? { ...user, first_name: editForm.first_name, last_name: editForm.last_name, email: editForm.email }
          : user
      ));
      setEditingUser(null);
      setError('');
    } catch (err) {
      const status = err.response && err.response.status ? err.response.status : 'Unknown';
      setError(`Failed to update user: Network error (Status: ${status})`);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`admin/user/${userId}/delete/`);
        setUsers(users.filter((user) => user.id !== userId));
        setError('');
      } catch (err) {
        const status = err.response && err.response.status ? err.response.status : 'Unknown';
        setError(`Failed to delete user: Network error (Status: ${status})`);
      }
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {isLoading && <p>Loading data...</p>}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
          <button
            onClick={fetchMetrics}
            className="ml-2 text-blue-500 underline"
          >
            Retry
          </button>
        </div>
      )}
      {!isLoading && !error && (
        <>
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Users Section */}
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${user.total_balance}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={user.is_superuser} // Prevent deleting self or other superusers
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;