import { useState, useEffect } from "react";
import "./App.css";
import EmployeeDashboard from "./components/EmployeeDashboard";
import HomeDashboard from "./components/HomeDashboard";
import AmenityDashboard from "./components/AmenityDashboard";
import AttendanceDashboard from "./components/AttendanceDashboard";
import ComplaintDashboard from "./components/ComplaintDashboard";
import VisitorPassDashboard from "./components/VisitorPassDashboard";
import LoginPage from "./components/LoginPage";
import { authStorage } from "./auth/authStorage";

import communityLogo from "./assets/community-logo-v3.png";

function App() {
  const [activeTab, setActiveTab] = useState("home");
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
    setActiveTab("home");
  }

  function handleLogout() {
    authStorage.clearToken();
    setCurrentUser(null);
    setActiveTab("home");
  }

  function getFirstName(fullName) {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const isAdmin = currentUser.role === "ADMIN";
  const isResident = currentUser.role === "RESIDENT";

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <img src={communityLogo} alt="Community" className="app-logo-img" />

          <div className="tabs">
            <button className={activeTab === "home" ? "tab-active" : ""} onClick={() => setActiveTab("home")}>
              Home
            </button>
            {isAdmin && (
              <button className={activeTab === "employees" ? "tab-active" : ""} onClick={() => setActiveTab("employees")}>
                Employees
              </button>
            )}
            <button className={activeTab === "amenities" ? "tab-active" : ""} onClick={() => setActiveTab("amenities")}>
              Amenities
            </button>
            {!isResident && (
              <button className={activeTab === "attendance" ? "tab-active" : ""} onClick={() => setActiveTab("attendance")}>
                Attendance
              </button>
            )}
            {isResident && (
              <button className={activeTab === "visitor-passes" ? "tab-active" : ""} onClick={() => setActiveTab("visitor-passes")}>
                Visitor Passes
              </button>
            )}
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
        {activeTab === "home" && <HomeDashboard currentUser={currentUser} onNavigate={setActiveTab} />}
        {activeTab === "employees" && isAdmin && <EmployeeDashboard currentUser={currentUser} />}
        {activeTab === "amenities" && <AmenityDashboard currentUser={currentUser} />}
        {activeTab === "attendance" && !isResident && <AttendanceDashboard currentUser={currentUser} />}
        {activeTab === "visitor-passes" && isResident && <VisitorPassDashboard />}
        {activeTab === "complaints" && <ComplaintDashboard currentUser={currentUser} />}
      </main>
    </div>
  );
}

export default App;
