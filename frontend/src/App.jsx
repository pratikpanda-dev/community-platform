import { useState } from "react";
import "./App.css";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AmenityDashboard from "./components/AmenityDashboard";
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
          </div>
        </div>
      </nav>

      <main className="page">
        {activeTab === "employees" && <EmployeeDashboard />}
        {activeTab === "amenities" && <AmenityDashboard />}
      </main>
    </div>
  );
}

export default App;