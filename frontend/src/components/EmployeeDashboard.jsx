import { useEffect, useState } from "react";
import { employeeApi } from "../api/employeeApi";
import { staffProfileApi } from "../api/staffProfileApi";

import "./EmployeeDashboard.css";

export default function EmployeeDashboard({ currentUser }) {
    const [employees, setEmployees] = useState([]);
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [form, setForm] = useState({

        name: "",
        email: "",
        department: "",
        jobTitle: "",
        salary: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [staffProfileEmployee, setStaffProfileEmployee] = useState(null);
    const [savingStaffProfile, setSavingStaffProfile] = useState(false);
    const [staffProfileMessage, setStaffProfileMessage] = useState(null);
    const [staffProfileForm, setStaffProfileForm] = useState({
        staffType: "SECURITY",
        shiftStart: "09:00",
        shiftEnd: "17:00",
    });


    useEffect(() => {
        fetchEmployees();
    }, []);


    function handleEdit(employee) {

        setForm({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            jobTitle: employee.jobTitle,
            salary: employee.salary
        });
        setEditingId(employee.id);
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm({ name: "", email: "", department: "", jobTitle: "", salary: "" });
    }

    async function fetchEmployees() {
        const data = await employeeApi.getAllEmployees(currentUser.societyId);
        setEmployees(data);
    }

    function updateFields(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const visibleEmployees = roleFilter === "ALL"
        ? employees
        : employees.filter((employee) => employee.role === roleFilter);

    async function handleDelete(id, role) {
        if(role === "ADMIN") {
            alert("You cannot delete an admin employee.");
            return;
        }
        await employeeApi.removeEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        await fetchEmployees();
    }
    async function handleUpdateEmployee() {
        const updatedEmployee = await employeeApi.updateEmployee(editingId, form);
        setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? updatedEmployee : emp)));
        setEditingId(null);
        setForm({ name: "", email: "", department: "", jobTitle: "", salary: "" });
    }

    function openStaffProfileForm(employee) {
        setStaffProfileEmployee(employee);
        setStaffProfileMessage(null);
        setStaffProfileForm({
            staffType: employee.role === "WORKER" ? "WORKER" : "SECURITY",
            shiftStart: "09:00",
            shiftEnd: "17:00",
        });
    }

    function closeStaffProfileForm() {
        setStaffProfileEmployee(null);
        setStaffProfileMessage(null);
    }

    function updateStaffProfileField(field, value) {
        setStaffProfileForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleCreateStaffProfile(event) {
        event.preventDefault();
        setSavingStaffProfile(true);
        setStaffProfileMessage(null);
        try {
            await staffProfileApi.create({
                employee: { id: staffProfileEmployee.id },
                staffType: staffProfileForm.staffType,
                shiftStart: staffProfileForm.shiftStart,
                shiftEnd: staffProfileForm.shiftEnd,
            });
            setStaffProfileMessage({ type: "success", text: "Staff profile saved" });
        } catch (err) {
            setStaffProfileMessage({ type: "error", text: err.message });
        } finally {
            setSavingStaffProfile(false);
        }
    }

    return (
        <div className="emp-dashboard">
            <div className="employee-toolbar">
                <h2 className="emp-dash-title">Employees</h2>
                <label className="employee-filter">
                    Employee type
                    <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                        <option value="ALL">All types</option>
                        <option value="ADMIN">Admin</option>
                        <option value="RESIDENT">Resident</option>
                        <option value="SECURITY">Security</option>
                        <option value="WORKER">Worker</option>
                    </select>
                </label>
            </div>
            <div className="table-card">
                <table className="emp-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Job Title</th>
                            <th>Salary</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleEmployees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role}</td>
                                <td>{emp.department}</td>
                                <td>{emp.jobTitle}</td>
                                <td>₹{emp.salary != null ? emp.salary.toFixed(2) : "—"}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(emp)}>
                                        Edit
                                    </button>
                                    {currentUser.role === "ADMIN" && (emp.role === "SECURITY" || emp.role === "WORKER") && (
                                        <button className="btn btn-ghost" onClick={() => openStaffProfileForm(emp)}>
                                            Add Staff Profile
                                        </button>
                                    )}
                                    {currentUser.role === "ADMIN" && (
                                        <button className="btn btn-danger" onClick={() => handleDelete(emp.id, emp.role)}>
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
            {editingId && (
            <div className="form-card">
                <h3>Edit Employee</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => updateFields("name", e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => updateFields("email", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={form.department}
                    onChange={(e) => updateFields("department", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Job Title"
                    value={form.jobTitle}
                    onChange={(e) => updateFields("jobTitle", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={(e) => updateFields("salary", e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleUpdateEmployee}>Update</button>
                <button className="btn btn-ghost" onClick={handleCancelEdit}>Cancel</button>
            </div>
            )}

            {staffProfileEmployee && (
                <div className="staff-profile-modal-backdrop" role="presentation" onMouseDown={closeStaffProfileForm}>
                    <form className="staff-profile-modal" onSubmit={handleCreateStaffProfile} onMouseDown={(event) => event.stopPropagation()}>
                        <div className="staff-profile-modal-header">
                            <div>
                                <h2>Add Staff Profile</h2>
                                <p>Set the duty type and shift for {staffProfileEmployee.name}.</p>
                            </div>
                            <button type="button" className="staff-profile-modal-close" onClick={closeStaffProfileForm} aria-label="Close add staff profile form">
                                ×
                            </button>
                        </div>

                        {staffProfileMessage && (
                            <p className={`staff-profile-message staff-profile-message-${staffProfileMessage.type}`}>{staffProfileMessage.text}</p>
                        )}

                        <div className="staff-profile-form-grid">
                            <label>Staff type
                                <select value={staffProfileForm.staffType} onChange={(event) => updateStaffProfileField("staffType", event.target.value)}>
                                    <option value="SECURITY">Security</option>
                                    <option value="WORKER">Worker</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </label>
                            <label>Shift start<input required type="time" value={staffProfileForm.shiftStart} onChange={(event) => updateStaffProfileField("shiftStart", event.target.value)} /></label>
                            <label>Shift end<input required type="time" value={staffProfileForm.shiftEnd} onChange={(event) => updateStaffProfileField("shiftEnd", event.target.value)} /></label>
                        </div>

                        <div className="staff-profile-modal-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeStaffProfileForm} disabled={savingStaffProfile}>Close</button>
                            <button type="submit" className="btn btn-primary" disabled={savingStaffProfile}>{savingStaffProfile ? "Saving…" : "Save Staff Profile"}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );

}
