import { useState, useEffect } from "react";
import "./App.css";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AmenityDashboard from "./components/AmenityDashboard";
import AttendanceDashboard from "./components/AttendanceDashboard";
import ComplaintDashboard from "./components/ComplaintDashboard";
import LoginPage from "./components/LoginPage";
import { authStorage } from "./auth/authStorage";

import communityLogo from "./assets/community-logo-v3.png";

function App() {
  const [activeTab, setActiveTab] = useState("employees");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const payload = authStorage.getPayload();
    if (payload) {
      setCurrentUser(payload);
    }
  }, []);

  function handleLoginSuccess() {
    const payload = authStorage.getPayload();
    setCurrentUser(payload);
  }

  function handleLogout() {
    authStorage.clearToken();
    setCurrentUser(null);
  }

  function getFirstName(fullName) {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <img src={communityLogo} alt="Community" className="app-logo-img" />

          <div className="tabs">
            <button className={activeTab === "employees" ? "tab-active" : ""} onClick={() => setActiveTab("employees")}>
              Employees
            </button>
            <button className={activeTab === "amenities" ? "tab-active" : ""} onClick={() => setActiveTab("amenities")}>
              Amenities
            </button>
            <button className={activeTab === "attendance" ? "tab-active" : ""} onClick={() => setActiveTab("attendance")}>
              Attendance
            </button>
            <button className={activeTab === "complaints" ? "tab-active" : ""} onClick={() => setActiveTab("complaints")}>
              Complaints
            </button>
          </div>

          <div className="navbar-user">
            <div className="user-avatar">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <span className="navbar-user-name">{getFirstName(currentUser.name)}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="page">
        {activeTab === "employees" && <EmployeeDashboard currentUser={currentUser} />}
        {activeTab === "amenities" && <AmenityDashboard currentUser={currentUser} />}
        {activeTab === "attendance" && <AttendanceDashboard currentUser={currentUser} />}
        {activeTab === "complaints" && <ComplaintDashboard currentUser={currentUser} />}
      </main>
    </div>
  );
}

export default App;