import { useState } from "react";
import "./App.css";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AmenityDashboard from "./components/AmenityDashboard";
import AttendanceDashboard from "./components/AttendanceDashboard";
import ComplaintDashboard from "./components/ComplaintDashboard";

import communityLogo from "./assets/community-logo-v3.png";

function App() {
  const [activeTab, setActiveTab] = useState("employees");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <img src={communityLogo} alt="Community" className="app-logo-img" />

          <div className="tabs">
            <button
              className={activeTab === "employees" ? "tab-active" : ""}
              onClick={() => setActiveTab("employees")}
            >
              Employees
            </button>
            <button
              className={activeTab === "amenities" ? "tab-active" : ""}
              onClick={() => setActiveTab("amenities")}
            >
              Amenities
            </button>
            <button
              className={activeTab === "attendance" ? "tab-active" : ""}
              onClick={() => setActiveTab("attendance")}
            >
              Attendance
            </button>
            <button
              className={activeTab === "complaints" ? "tab-active" : ""}
              onClick={() => setActiveTab("complaints")}
            >
              Complaints
            </button>
          </div>
        </div>
      </nav>

      <main className="page">
        {activeTab === "employees" && <EmployeeDashboard />}
        {activeTab === "amenities" && <AmenityDashboard />}
        {activeTab === "attendance" && <AttendanceDashboard />}
        {activeTab === "complaints" && <ComplaintDashboard />}
      </main>
    </div>
  );
}

export default App;