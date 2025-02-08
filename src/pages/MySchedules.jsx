import { useNavigate } from "react-router-dom";
import { getSchedules } from "../services/api";
import { useEffect, useState } from "react";

const MySchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(schedules);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getSchedules();
        setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const renderSchedule = (schedule) => (
    <button
      key={schedule._id}
      onClick={() => navigate(`/schedule/${schedule._id}`)}
      className="w-full mb-3 p-4 bg-gray-50 rounded-lg shadow-sm
                hover:bg-gray-100 transition-colors duration-200
                flex justify-between items-center"
    >
      <div className="flex flex-col items-start">
        <span className="text-purple-700 font-medium mb-1">
          {schedule.name}
        </span>
        <span className="text-sm text-gray-600">
          Created: {new Date(schedule.createdAt).toLocaleDateString()}
        </span>
      </div>
      {schedule.isEmployee ? (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
          Member
        </span>
      ) : (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          Owner
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-white text-xl font-medium">My Schedules</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/notifications")}
            className="text-white p-2 hover:bg-purple-600 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No schedules found</p>
            <p className="text-sm text-gray-400">
              Create a new schedule to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Your Schedules ({schedules.length})
              </h2>
            </div>
            {schedules.map(renderSchedule)}
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => navigate("/new-schedule/name")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-700 rounded-full
                 flex items-center justify-center shadow-lg
                 hover:bg-purple-800 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default MySchedules;
