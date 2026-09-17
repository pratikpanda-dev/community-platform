import { useEffect, useState } from "react";
import { complaintApi } from "../api/complaintApi";
import "./ComplaintDashboard.css";

const CATEGORIES = ["PLUMBING", "ELECTRICAL", "SECURITY", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const EMPTY_FORM = { category: "PLUMBING", description: "", priority: "MEDIUM" };

export default function ComplaintDashboard({ currentUser }) {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, currentUser.societyId]);

  async function loadComplaints() {
    const data = await complaintApi.getAll(statusFilter || null);
    setComplaints(data);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) return;

    setSubmitting(true);
    try {
      await complaintApi.create({
        category: form.category,
        description: form.description,
        priority: form.priority,
      });
      setForm(EMPTY_FORM);
      await loadComplaints();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    await complaintApi.updateStatus(id, newStatus);
    await loadComplaints();
  }

  return (
    <div className="complaint-dash">
      <header className="complaint-header">
        <h1 className="complaint-title">Complaints</h1>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Raise a Complaint</h3>
        <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={form.priority} onChange={(e) => updateField("priority", e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Describe the issue"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting\u2026" : "Submit"}
        </button>
      </form>

      <div className="complaint-filter">
        <button
          className={statusFilter === "" ? "filter-active" : ""}
          onClick={() => setStatusFilter("")}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={statusFilter === s ? "filter-active" : ""}
            onClick={() => setStatusFilter(s)}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Raised By</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td>{c.category}</td>
                <td>{c.description}</td>
                <td>{c.raisedBy.name}</td>
                <td>
                  <span className={`priority-tag priority-${c.priority.toLowerCase()}`}>
                    {c.priority}
                  </span>
                </td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  >
                    {STATUSES.map((s, i) => {
                      const currentIndex = STATUSES.indexOf(c.status);
                      const isPast = i < currentIndex;
                      return (
                        <option key={s} value={s} disabled={isPast}>
                          {s.replace("_", " ")}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}