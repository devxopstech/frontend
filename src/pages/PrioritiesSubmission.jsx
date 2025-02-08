import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createPriority } from "../services/api";
const PriorityCell = ({ selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded border-2 transition-colors duration-200 
                ${
                  selected
                    ? "bg-purple-700 border-purple-700"
                    : "border-purple-200 hover:border-purple-300"
                }`}
  />
);

const PrioritiesSubmission = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const location = useLocation();
  const [selectedStation, setSelectedStation] = useState("");
  const [priorities, setPriorities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!scheduleId) {
      navigate("/schedules");
    }
  }, [scheduleId, navigate]);
  const shifts = ["Morning", "Afternoon", "Night"];
  const days = [
    { name: "Sunday", date: "12/1/2025" },
    { name: "Monday", date: "13/1/2025" },
    { name: "Tuesday", date: "14/1/2025" },
    { name: "Wednesday", date: "15/1/2025" },
    { name: "Thursday", date: "16/1/2025" },
    { name: "Friday", date: "17/1/2025" },
  ];

  const shiftTimes = {
    Morning: "07:00 - 15:00",
    Afternoon: "15:00 - 23:00",
    Night: "23:00 - 07:00",
  };

  const togglePriority = (day, shift) => {
    const key = `${day}-${shift}`;
    setPriorities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!selectedStation) {
      setError("Please select a station");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Format priorities for backend
      const selectedPreferences = Object.entries(priorities)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => key);

      const priorityData = {
        scheduleId: scheduleId,
        station: selectedStation,
        preferences: selectedPreferences,
      };
      console.log("Submitting priority data:", priorityData);
      const response = await createPriority(priorityData);

      if (response.success) {
        navigate(`/schedule/${scheduleId}`, {
          state: { message: "Priorities submitted successfully" },
        });
      } else {
        setError(response.message || "Failed to submit priorities");
      }
    } catch (error) {
      console.error("Submit priorities error:", error);
      setError(error.message || "Failed to submit priorities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:bg-purple-600 p-2 rounded-lg transition-colors"
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
        <h1 className="text-white text-xl font-medium">
          Priorities Submission
        </h1>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">{error}</div>
        )}
        {/* Station Selector */}
        <div>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select...</option>
            <option value="station1">Station 1</option>
            <option value="station2">Station 2</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-700 text-white py-3 rounded-lg
                   hover:bg-purple-800 transition-colors duration-200"
        >
          Submit Priorities
        </button>

        {/* Date Range */}
        <div className="text-center text-gray-600">12/1/2025 - 18/1/2025</div>

        {/* Shifts Header */}
        <div className="grid grid-cols-4 gap-4">
          <div></div>
          {shifts.map((shift) => (
            <div key={shift} className="text-center">
              <div className="font-medium text-gray-800">{shift}</div>
              <div className="text-sm text-gray-500">{shiftTimes[shift]}</div>
            </div>
          ))}
        </div>

        {/* Priority Grid */}
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.name}
              className="grid grid-cols-4 gap-4 items-center bg-white p-4 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-800">{day.name}</div>
                <div className="text-sm text-gray-500">{day.date}</div>
              </div>
              {shifts.map((shift) => (
                <div key={shift} className="flex justify-center">
                  <PriorityCell
                    selected={priorities[`${day.name}-${shift}`]}
                    onClick={() => togglePriority(day.name, shift)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrioritiesSubmission;
