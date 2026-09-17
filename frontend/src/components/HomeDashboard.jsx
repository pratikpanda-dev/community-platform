import { useState } from "react";
import { employeeApi } from "../api/employeeApi";
import { societyApi } from "../api/societyApi";
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
  const isResident = currentUser.role === "RESIDENT";
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
  const [isCreateSocietyOpen, setIsCreateSocietyOpen] = useState(false);
  const [creatingSociety, setCreatingSociety] = useState(false);
  const [societyMessage, setSocietyMessage] = useState(null);
  const [societyForm, setSocietyForm] = useState({ name: "", address: "", planType: "FREE" });
  const links = isAdmin
    ? [
        ...quickLinks,
        {
          id: "employees",
          title: "Employee Management",
          description: "Add, update, and manage community employees.",
        },
      ]
    : isResident
      ? [
          ...quickLinks,
          {
            id: "visitor-passes",
            title: "Visitor Passes",
            description: "Create a pass for guests visiting your home.",
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
    setForm((current) => (
      field === "role" && value === "RESIDENT"
        ? { ...current, role: value, department: "", jobTitle: "", salary: "" }
        : { ...current, [field]: value }
    ));
  }

  function closeCreateSocietyForm() {
    setIsCreateSocietyOpen(false);
    setSocietyMessage(null);
    setSocietyForm({ name: "", address: "", planType: "FREE" });
  }

  function updateSocietyField(field, value) {
    setSocietyForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateSociety(event) {
    event.preventDefault();
    if (!societyForm.name.trim()) return;

    setCreatingSociety(true);
    setSocietyMessage(null);
    try {
      await societyApi.create(societyForm);
      setSocietyMessage({ type: "success", text: `Society "${societyForm.name}" created` });
      setSocietyForm({ name: "", address: "", planType: "FREE" });
    } catch (err) {
      setSocietyMessage({ type: "error", text: err.message });
    } finally {
      setCreatingSociety(false);
    }
  }

  async function handleCreateEmployee(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await employeeApi.createEmployee({
        ...form,
        department: form.role === "RESIDENT" ? null : form.department,
        jobTitle: form.role === "RESIDENT" ? null : form.jobTitle,
        salary: form.role === "RESIDENT" ? null : Number(form.salary),
        JobTitle: form.jobTitle === "RESIDENT" ? null : form.jobTitle,
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
            <div className="home-hero-actions">
              <button className="btn btn-ghost home-add-employee" onClick={() => setIsCreateSocietyOpen(true)}>
                Create Society
              </button>
              <button className="btn btn-primary home-add-employee" onClick={() => setIsCreateFormOpen(true)}>
                Add Employee
              </button>
            </div>
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
              {form.role !== "RESIDENT" && (
                <label>Department<input required value={form.department} onChange={(event) => updateForm("department", event.target.value)} /></label>
              )}
              {form.role !== "RESIDENT" && (
                <label>Job title<input required value={form.jobTitle} onChange={(event) => updateForm("jobTitle", event.target.value)} /></label>
              )}
              {form.role !== "RESIDENT" && (
                <label>Salary<input required type="number" min="0" value={form.salary} onChange={(event) => updateForm("salary", event.target.value)} /></label>
              )}
            </div>

            <div className="employee-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeCreateForm} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create Employee"}</button>
            </div>
          </form>
        </div>
      )}

      {isCreateSocietyOpen && (
        <div className="employee-modal-backdrop" role="presentation" onMouseDown={closeCreateSocietyForm}>
          <form className="employee-modal" onSubmit={handleCreateSociety} onMouseDown={(event) => event.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h2>Create Society</h2>
                <p>Register a new society on the platform.</p>
              </div>
              <button type="button" className="employee-modal-close" onClick={closeCreateSocietyForm} aria-label="Close create society form">
                ×
              </button>
            </div>

            {societyMessage && (
              <p className={`employee-form-message employee-form-message-${societyMessage.type}`}>{societyMessage.text}</p>
            )}

            <div className="employee-form-grid">
              <label>Name<input required value={societyForm.name} onChange={(event) => updateSocietyField("name", event.target.value)} /></label>
              <label>Address<input value={societyForm.address} onChange={(event) => updateSocietyField("address", event.target.value)} /></label>
              <label>Plan
                <select value={societyForm.planType} onChange={(event) => updateSocietyField("planType", event.target.value)}>
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </label>
            </div>

            <div className="employee-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeCreateSocietyForm} disabled={creatingSociety}>Close</button>
              <button type="submit" className="btn btn-primary" disabled={creatingSociety}>{creatingSociety ? "Creating…" : "Create Society"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
