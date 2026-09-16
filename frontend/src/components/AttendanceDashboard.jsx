import { useEffect, useState } from "react";
import { attendanceApi } from "../api/attendanceApi";
import "./AttendanceDashboard.css";

//const CURRENT_EMPLOYEE_ID = 52; // Rohit Sharma — hardcoded until Sprint 6 auth

export default function AttendanceDashboard({ currentUser }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [myAttendance, setMyAttendance] = useState(null);
  const [summary, setSummary] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    const data = await attendanceApi.getTodaySummary();
    // The API enforces this rule. Retain the same filter in the UI so an
    // outdated server response can never render another staff member's data.
    const visibleSummary = isAdmin
      ? data
      : data.filter((a) => a.staffProfile.employee.id === currentUser.employeeId);
    setSummary(visibleSummary);

    const mine = visibleSummary.find(
      (a) => a.staffProfile.employee.id === currentUser.employeeId
    );
    setMyAttendance(mine ?? null);
  }

  async function handleCheckIn() {
    setLoading(true);
    setMessage(null);
    try {
      await attendanceApi.checkIn(currentUser.employeeId);
      setMessage({ type: "success", text: "Checked in successfully" });
      await loadSummary();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    setLoading(true);
    setMessage(null);
    try {
      await attendanceApi.checkOut(currentUser.employeeId);
      setMessage({ type: "success", text: "Checked out successfully" });
      await loadSummary();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function formatTime(isoString) {
    if (!isoString) return "\u2014";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="attendance-dash">
      <header className="attendance-header">
        <p className="attendance-eyebrow">Sprint 4 · Module 03</p>
        <h1 className="attendance-title">Attendance</h1>
      </header>

      <div className="checkin-card">
        <div>
          <p className="checkin-status-label">Today's status</p>
          <p className="checkin-status-value">
            {myAttendance
              ? myAttendance.checkOutTime
                ? "Checked out"
                : "Checked in"
              : "Not checked in"}
          </p>
          {myAttendance && (
            <p className="checkin-times">
              In: {formatTime(myAttendance.checkInTime)} · Out:{" "}
              {formatTime(myAttendance.checkOutTime)}
            </p>
          )}
        </div>

        <div className="checkin-actions">
          <button
            className="btn btn-primary"
            onClick={handleCheckIn}
            disabled={loading || !!myAttendance}
          >
            Check In
          </button>
          <button
            className="btn btn-danger"
            onClick={handleCheckOut}
            disabled={loading || !myAttendance || !!myAttendance?.checkOutTime}
          >
            Check Out
          </button>
        </div>
      </div>

      {message && (
        <div className={`attendance-message attendance-message-${message.type}`}>
          {message.text}
        </div>
      )}

      <h3 className="summary-title">{isAdmin ? "Today's Summary" : "My Summary"}</h3>
      <div className="table-card">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff Type</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((a) => (
              <tr key={a.id}>
                <td>{a.staffProfile.employee.name}</td>
                <td>{a.staffProfile.staffType}</td>
                <td>{formatTime(a.checkInTime)}</td>
                <td>{formatTime(a.checkOutTime)}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
