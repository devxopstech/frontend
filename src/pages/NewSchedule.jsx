import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../context/ScheduleContext";
import { createSchedule } from "../services/api"; // Import the API function

const NewSchedule = () => {
  const navigate = useNavigate();
  const [scheduleName, setScheduleName] = useState("");
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const { updateScheduleData } = useSchedule();

  const validateScheduleName = (name) => {
    if (!name.trim()) return "Schedule name is required";
    if (name.length < 3) return "Schedule name must be at least 3 characters";
    if (name.length > 50)
      return "Schedule name must be less than 50 characters";
    return "";
  };

  const handleNext = async () => {
    const validationError = validateScheduleName(scheduleName);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Call the API to create a new schedule
      const response = await createSchedule({ name: scheduleName.trim() });
      console.log("Schedule created:", response);

      // Update the context with the new schedule data
      updateScheduleData({ name: scheduleName.trim(), id: response.data._id });

      // Navigate to the settings page
      navigate("/new-schedule/settings", {
        state: {
          scheduleName: scheduleName.trim(),
          scheduleId: response.data._id,
        },
      });
    } catch (error) {
      console.error("Failed to create schedule:", error);
      setError(error.message || "Failed to create schedule");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center gap-4 shadow-lg">
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
        <h1 className="text-white text-xl font-medium">New Schedule</h1>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Input Label */}
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Schedule Name</label>
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center
                           text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                {/* Tooltip */}
                {showTooltip && (
                  <div
                    className="absolute right-0 top-8 w-64 p-2 bg-gray-800 text-white text-sm 
                                rounded-lg shadow-lg z-10"
                  >
                    Enter a unique name for your schedule. This will help you
                    identify it later.
                  </div>
                )}
              </div>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Enter schedule name"
                value={scheduleName}
                onChange={(e) => {
                  setScheduleName(e.target.value);
                  setError("");
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-purple-500
                text-gray-800 placeholder-gray-400 bg-white`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Character Count */}
            <div className="text-right text-sm text-gray-500">
              {scheduleName.length}/50 characters
            </div>
          </div>
        </div>

        {/* Suggestions Card (Optional) */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="text-purple-700 font-medium mb-2">Suggested Names</h3>
          <div className="flex flex-wrap gap-2">
            {["Morning Shift", "Night Shift", "Weekend Schedule"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setScheduleName(suggestion);
                    setError("");
                  }}
                  className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm
                         hover:bg-purple-100 transition-colors"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!scheduleName.trim()}
          className={`w-full bg-purple-700 text-white py-4 rounded-lg font-medium
                   transition-all duration-200 shadow-lg
                   ${
                     scheduleName.trim()
                       ? "hover:bg-purple-800 hover:shadow-xl"
                       : "opacity-50 cursor-not-allowed"
                   }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewSchedule;
