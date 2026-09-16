import { useState } from "react";
import { employeeApi } from "../api/employeeApi";
import "./HomeDashboard.css";

const quickLinks = [
  {
    id: "attendance",
    title: "Attendance",
    description: "Check in, check out, and view today's attendance.",
  },
  {
    id: "amenities",
    title: "Amenities",
    description: "Browse facilities and reserve an available time slot.",
  },
  {
    id: "complaints",
    title: "Complaints",
    description: "Raise and follow up on community concerns.",
  },
];

export default function HomeDashboard({ currentUser, onNavigate }) {
  const isAdmin = currentUser.role === "ADMIN";
  const firstName = currentUser.name?.split(" ")[0] || "there";
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    jobTitle: "",
    salary: "",
    role: "RESIDENT",
  });
  const links = isAdmin
    ? [
        ...quickLinks,
        {
          id: "employees",
          title: "Employee Management",
          description: "Add, update, and manage community employees.",
        },
      ]
    : quickLinks;

  function closeCreateForm() {
    setIsCreateFormOpen(false);
    setMessage(null);
    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
      jobTitle: "",
      salary: "",
      role: "RESIDENT",
    });
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateEmployee(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await employeeApi.createEmployee({
        ...form,
        salary: Number(form.salary),
      });
      closeCreateForm();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="home-dashboard">
      <div className="home-hero">
        <div className="home-hero-header">
          <div>
            <p className="home-eyebrow">Community Platform</p>
            <h1>Welcome back, {firstName}</h1>
          </div>
          {isAdmin && (
            <button className="btn btn-primary home-add-employee" onClick={() => setIsCreateFormOpen(true)}>
              Add Employee
            </button>
          )}
        </div>
        <p>
          {isAdmin
            ? "Manage your community and stay up to date with daily activity."
            : "Everything you need for your community, in one place."}
        </p>
      </div>

      <div className="home-section-heading">
        <h2>Quick access</h2>
        <p>Choose where you would like to go.</p>
      </div>

      <div className="home-link-grid">
        {links.map((link) => (
          <button
            key={link.id}
            className="home-link-card"
            onClick={() => onNavigate(link.id)}
          >
            <span className="home-link-title">{link.title}</span>
            <span className="home-link-description">{link.description}</span>
            <span className="home-link-action">Open →</span>
          </button>
        ))}
      </div>

      {isCreateFormOpen && (
        <div className="employee-modal-backdrop" role="presentation" onMouseDown={closeCreateForm}>
          <form className="employee-modal" onSubmit={handleCreateEmployee} onMouseDown={(event) => event.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h2>Add Employee</h2>
                <p>Create an account for a member of your community team.</p>
              </div>
              <button type="button" className="employee-modal-close" onClick={closeCreateForm} aria-label="Close add employee form">
                ×
              </button>
            </div>

            {message && <p className={`employee-form-message employee-form-message-${message.type}`}>{message.text}</p>}

            <div className="employee-form-grid">
              <label>Name<input required value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} /></label>
              <label>Password<input required type="password" minLength="6" value={form.password} onChange={(event) => updateForm("password", event.target.value)} /></label>
              <label>Role
                <select value={form.role} onChange={(event) => updateForm("role", event.target.value)}>
                  <option value="RESIDENT">Resident</option>
                  <option value="SECURITY">Security</option>
                  <option value="WORKER">Worker</option>
                </select>
              </label>
              <label>Department<input required value={form.department} onChange={(event) => updateForm("department", event.target.value)} /></label>
              <label>Job title<input required value={form.jobTitle} onChange={(event) => updateForm("jobTitle", event.target.value)} /></label>
              <label>Salary<input required type="number" min="0" value={form.salary} onChange={(event) => updateForm("salary", event.target.value)} /></label>
            </div>

            <div className="employee-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeCreateForm} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create Employee"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
