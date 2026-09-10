const BASE_URL = "http://localhost:8080/api/employee.v1";
const BASE_URL_CREATE = "http://localhost:8080/api/employee.v1/create";
const BASE_URL_UPDATE = "http://localhost:8080/api/employee.v1/update";

async function handleResponse(response) {

    if(!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || "Request failed with status " + response.status);
    }

    if(response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

export const employeeApi = {
    getAllEmployees: (societyId) => fetch(`${BASE_URL}?societyId=${societyId}`).then(handleResponse),

    getEmployeeById: (id) => fetch(`${BASE_URL}/${id}`).then(handleResponse),

    createEmployee: (employee) => fetch(BASE_URL_CREATE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    }).then(handleResponse),

    removeEmployee: (id) => fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    }).then(handleResponse),

    updateEmployee: (id, employee) => {
    return fetch(`${BASE_URL_UPDATE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    }).then(handleResponse);
}
    
}