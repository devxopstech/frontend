import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSchedule } from "../context/ScheduleContext";
import { updateSchedule } from "../services/api"; // Import the API function

const TimePicker = ({ value, onChange, error }) => (
  <input
    type="time"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-2 rounded-lg border ${
      error ? "border-red-500" : "border-gray-200"
    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
  />
);

const ScheduleSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState({
    stations: 1,
    shifts: {
      morning: { checked: true, startTime: "07:00", endTime: "15:00" },
      afternoon: { checked: true, startTime: "15:00", endTime: "23:00" },
      night: { checked: true, startTime: "23:00", endTime: "07:00" },
    },
    deadlineEnabled: true,
    submissionDay: "",
    submissionTime: "",
  });

  const { scheduleData, updateScheduleData } = useSchedule();
  const { scheduleId } = location.state || {}; // Get the schedule ID from the location state

  const validateSettings = () => {
    const newErrors = {};

    if (Object.values(settings.shifts).every((shift) => !shift.checked)) {
      newErrors.shifts = "At least one shift must be selected";
    }

    if (settings.deadlineEnabled && !settings.submissionDay) {
      newErrors.submissionDay = "Please select a submission day";
    }

    if (settings.deadlineEnabled && !settings.submissionTime) {
      newErrors.submissionTime = "Please set a submission time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateSettings()) return;

    const updatedData = {
      stations: settings.stations,
      shifts: settings.shifts,
      deadline: {
        enabled: settings.deadlineEnabled,
        day: settings.submissionDay,
        time: settings.submissionTime,
      },
    };

    try {
      // Call the API to update the schedule
      const response = await updateSchedule(scheduleId, updatedData);
      console.log("Schedule updated:", response);

      // Update the context with the new data
      updateScheduleData(updatedData);

      // Navigate to the schedule details page
      navigate(`/schedule/${scheduleId}`);
    } catch (error) {
      console.error("Failed to update schedule:", error);
      setErrors({ general: error.message || "Failed to update schedule" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <h1 className="text-white text-xl font-medium">Schedule Settings</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Stations Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-900">
                Number of stations
              </label>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
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
            </div>
            <select
              value={settings.stations}
              onChange={(e) =>
                setSettings({ ...settings, stations: parseInt(e.target.value) })
              }
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shifts Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-medium text-gray-900">Active Shifts</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
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
          </div>

          <div className="space-y-4">
            {Object.entries(settings.shifts).map(([shift, value]) => (
              <div
                key={shift}
                className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={value.checked}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shifts: {
                        ...settings.shifts,
                        [shift]: { ...value, checked: e.target.checked },
                      },
                    })
                  }
                  className="w-5 h-5 text-purple-700 rounded focus:ring-purple-500"
                />
                <span className="capitalize font-medium w-24">{shift}</span>
                <div className="flex items-center gap-2 flex-1">
                  <TimePicker
                    value={value.startTime}
                    onChange={(newTime) =>
                      setSettings({
                        ...settings,
                        shifts: {
                          ...settings.shifts,
                          [shift]: { ...value, startTime: newTime },
                        },
                      })
                    }
                  />
                  <span className="text-gray-500">to</span>
                  <TimePicker
                    value={value.endTime}
                    onChange={(newTime) =>
                      setSettings({
                        ...settings,
                        shifts: {
                          ...settings.shifts,
                          [shift]: { ...value, endTime: newTime },
                        },
                      })
                    }
                  />
                </div>
              </div>
            ))}
            {errors.shifts && (
              <p className="text-red-500 text-sm">{errors.shifts}</p>
            )}
          </div>
        </div>

        {/* Deadline Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900">
                Shift Submission Deadline
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
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
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deadlineEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deadlineEnabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {settings.deadlineEnabled && (
            <div className="space-y-4">
              <select
                value={settings.submissionDay}
                onChange={(e) =>
                  setSettings({ ...settings, submissionDay: e.target.value })
                }
                className={`w-full border ${
                  errors.submissionDay ? "border-red-500" : "border-gray-200"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Select Submission Day</option>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day.toLowerCase()} value={day.toLowerCase()}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.submissionDay && (
                <p className="text-red-500 text-sm">{errors.submissionDay}</p>
              )}

              <div className="relative">
                <input
                  type="time"
                  value={settings.submissionTime}
                  onChange={(e) =>
                    setSettings({ ...settings, submissionTime: e.target.value })
                  }
                  className={`w-full border ${
                    errors.submissionTime ? "border-red-500" : "border-gray-200"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Set deadline time"
                />
                {errors.submissionTime && (
                  <p className="text-red-500 text-sm">
                    {errors.submissionTime}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-purple-700 text-white py-4 rounded-lg font-medium
                   hover:bg-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ScheduleSettings;
