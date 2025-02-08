import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEmployee, getEmployees, updateEmployee } from "../services/api";

const EmployeesList = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams(); // Add this
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getEmployees(scheduleId);
        if (response.success) {
          setEmployees(response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchEmployees();
    }
  }, [scheduleId]);

  const handleEdit = async (employeeId) => {
    try {
      // Implement edit functionality
      const updatedData = {
        // Add updated fields
      };
      const response = await updateEmployee(employeeId, updatedData);
      if (response.success) {
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === employeeId ? response.data : emp))
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        const response = await deleteEmployee(employeeId);
        if (response.success) {
          setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const EmployeeCard = ({ employee, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          {employee.profilePicture ? (
            <img
              src={employee.profilePicture}
              alt={employee.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6 text-purple-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-800">{employee.name}</div>
          <div className="text-sm text-gray-500">{employee.email}</div>
          <div className="text-xs text-purple-600">{employee.status}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {/* Show actions based on status */}
        {employee.status === "pending" ? (
          <div className="text-sm text-orange-500">Pending Acceptance</div>
        ) : (
          <>
            <button
              onClick={() => onEdit(employee._id)}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-purple-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(employee._id)}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing header ... */}

      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : activeTab === "employees" ? (
          <div className="space-y-4">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeCard
                  key={employee._id}
                  employee={employee}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <p>No employees added yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>No pending requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
