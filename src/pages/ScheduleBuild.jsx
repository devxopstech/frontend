import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ScheduleBuild = () => {
  const navigate = useNavigate();
  const [currentStation, setCurrentStation] = useState(1);

  const shifts = [
    { name: "Morning", time: "07:00 - 15:00" },
    { name: "Afternoon", time: "15:00 - 23:00" },
    { name: "Night", time: "23:00 - 07:00" },
  ];

  const days = [
    { name: "Sunday", date: "12/1/2025" },
    { name: "Monday", date: "13/1/2025" },
    { name: "Tuesday", date: "14/1/2025" },
    { name: "Wednesday", date: "15/1/2025" },
    { name: "Thursday", date: "16/1/2025" },
  ];

  // Example schedule data
  const scheduleData = {
    "Monday-Afternoon": "Scheduler Systems",
    "Tuesday-Morning": "Scheduler Systems",
    "Tuesday-Night": "Scheduler Systems",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 p-4 flex items-center gap-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:bg-purple-500 p-2 rounded-lg transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-white text-xl font-medium">Schedule Build</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Date Range */}
        <div className="text-center text-gray-700 font-medium text-lg bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          📅 12/1/2025 - 18/1/2025
        </div>

        {/* Station Title */}
        <h2 className="text-lg font-medium text-center text-gray-800 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          🏢 Station {currentStation}
        </h2>

        {/* Days and Shifts */}
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.name}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="mb-4">
                <div className="font-medium text-gray-800">{day.name}</div>
                <div className="text-sm text-gray-500">{day.date}</div>
              </div>

              {/* Shifts */}
              <div className="space-y-2">
                {shifts.map((shift, index) => {
                  const assignment = scheduleData[`${day.name}-${shift.name}`];
                  return (
                    <div key={`${day.name}-${shift.name}`}>
                      <div
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors ${
                          index !== shifts.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {shift.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {shift.time}
                          </div>
                        </div>
                        {assignment && (
                          <span className="text-purple-600 text-sm font-medium">
                            {assignment}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Station Navigation */}
        <div className="flex justify-center gap-4">
          <button
            disabled={currentStation === 1}
            onClick={() => setCurrentStation((prev) => prev - 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-purple-700 transition-colors"
          >
            Previous Station
          </button>
          <button
            onClick={() => setCurrentStation((prev) => prev + 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next Station
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBuild;
