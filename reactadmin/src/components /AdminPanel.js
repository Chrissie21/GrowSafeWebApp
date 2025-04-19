import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import UpdateMobile from "./UpdateMobile";
import Users from "./Users";
import InvestmentOptions from "./InvestmentOptions";

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "dashboard";
    setActiveSection(hash);
    const handleHashChange = () => {
      setActiveSection(window.location.hash.replace("#", "") || "dashboard");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div>
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "transactions" && <Transactions />}
      {activeSection === "mobile" && <UpdateMobile />}
      {activeSection === "users" && <Users />}
      {activeSection === "investment-options" && <InvestmentOptions />}
    </div>
  );
}

export default AdminPanel;
