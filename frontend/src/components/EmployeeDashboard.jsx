import { useEffect, useState } from "react";
import { employeeApi } from "../api/employeeApi";

import "./EmployeeDashboard.css";

export default function EmployeeDashboard({ currentUser }) {
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({

        name: "",
        email: "",
        department: "",
        jobTitle: "",
        salary: ""
    });

    const [editingId, setEditingId] = useState(null);


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

    async function handleDelete(id, role) {
        if(role === "ADMIN") {
            alert("You cannot delete an admin employee.");
            return;
        }
        await employeeApi.removeEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        await fetchEmployees();
    }
    async function handleEmployee() {
        if (editingId) {
            const updatedEmployee = await employeeApi.updateEmployee(editingId, form);
            setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? updatedEmployee : emp)));
            setEditingId(null);
        } else {
            const newEmployee = await employeeApi.createEmployee(form);
            setEmployees((prev) => [...prev, newEmployee]);
        }
        setForm({ name: "", email: "", department: "", jobTitle: "", salary: "" });
    }

    return (
        <div className="emp-dashboard">
            <h2 className="emp-dash-title">Employees</h2>
            <div className="table-card">
                <table className="emp-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Job Title</th>
                            <th>Salary</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.department}</td>
                                <td>{emp.jobTitle}</td>
                                <td>₹{emp.salary != null ? emp.salary.toFixed(2) : "—"}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(emp)}>
                                        Edit
                                    </button>
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
            <div className="form-card">
                <h3>Add Employee</h3>
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
                <button className="btn btn-primary" onClick={handleEmployee}>{editingId ? "Update" : "Add"}</button>
                {editingId && (
                    <button className="btn btn-ghost" onClick={handleCancelEdit}>Cancel</button>
                )}
            </div>
        </div>
    );

}