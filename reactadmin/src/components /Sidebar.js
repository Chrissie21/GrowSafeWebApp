import React from "react";

function Sidebar({ handleLogout }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold">GrowSafe Admin</div>
      <nav className="flex-1">
        <a href="#dashboard" className="block p-4 hover:bg-gray-700">
          Dashboard
        </a>
        <a href="#transactions" className="block p-4 hover:bg-gray-700">
          Transactions
        </a>
        <a href="#mobile" className="block p-4 hover:bg-gray-700">
          Update Mobile
        </a>
      </nav>
      <button
        onClick={handleLogout}
        className="p-4 bg-red-600 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
