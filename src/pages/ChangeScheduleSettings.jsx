import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSchedule, updateSchedule } from "../services/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ChangeScheduleSettings = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    scheduleName: "",
    stations: 1,
    shifts: {
      morning: { enabled: true, time: "07:00-15:00" },
      afternoon: { enabled: true, time: "15:00-23:00" },
      night: { enabled: true, time: "23:00-07:00" },
    },
    deadline: {
      enabled: false,
      day: "",
      time: "",
    },
  });

  // Fetch schedule details
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        setLoading(true);
        const response = await getSchedule(scheduleId);

        if (response.success) {
          const scheduleData = response.data;
          setSettings({
            scheduleName: scheduleData.name || "",
            stations: scheduleData.stations || 1,
            shifts: scheduleData.shifts || {
              morning: { enabled: true, time: "07:00-15:00" },
              afternoon: { enabled: true, time: "15:00-23:00" },
              night: { enabled: true, time: "23:00-07:00" },
            },
            deadline: scheduleData.deadline || {
              enabled: false,
              day: "",
              time: "",
            },
          });
        }
      } catch (error) {
        setError(error.message || "Failed to fetch schedule details");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleDetails();
    }
  }, [scheduleId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = {
        name: settings.scheduleName,
        stations: settings.stations,
        shifts: settings.shifts,
        deadline: settings.deadline,
      };

      const response = await updateSchedule(scheduleId, updatedData);

      if (response.success) {
        navigate(`/schedule/${scheduleId}`, {
          state: { message: "Schedule settings updated successfully" },
        });
      }
    } catch (error) {
      setError(error.message || "Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center gap-4">
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
        <h1 className="text-white text-xl font-medium">Schedule Settings</h1>
      </header>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        )}
        {/* Schedule Name */}
        <div className="space-y-1">
          <label className="text-gray-600 text-sm">Schedule Name</label>
          <input
            type="text"
            value={settings.scheduleName}
            onChange={(e) =>
              setSettings({ ...settings, scheduleName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg focus:outline-none"
          />
        </div>

        {/* Number of Stations */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Number of stations</span>
            <button className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              ?
            </button>
          </div>
          <select
            value={settings.stations}
            onChange={(e) =>
              setSettings({ ...settings, stations: Number(e.target.value) })
            }
            className="border-2 border-purple-700 rounded px-3 py-2 w-16 text-center"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Shifts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Shifts</span>
            <button className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              ?
            </button>
          </div>

          {Object.entries(settings.shifts).map(([shift, { enabled, time }]) => (
            <div key={shift} className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shifts: {
                      ...settings.shifts,
                      [shift]: {
                        ...settings.shifts[shift],
                        enabled: e.target.checked,
                      },
                    },
                  })
                }
                className="w-5 h-5 text-purple-700 rounded border-2 border-purple-700"
              />
              <span className="capitalize w-24">{shift}</span>
              <input
                type="text"
                value={time}
                className="flex-1 px-4 py-2 border-2 border-purple-700 rounded-lg focus:outline-none"
                readOnly
              />
            </div>
          ))}
        </div>

        {/* Submission Deadline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Shift Submission Deadline</span>
              <button className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                ?
              </button>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  deadline: {
                    ...settings.deadline,
                    enabled: !settings.deadline.enabled,
                  },
                })
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 
                         ${
                           settings.deadline.enabled
                             ? "bg-purple-700"
                             : "bg-gray-300"
                         }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200
                             ${
                               settings.deadline.enabled ? "left-7" : "left-0.5"
                             }`}
              />
            </button>
          </div>

          {settings.deadline.enabled && (
            <>
              <select
                value={settings.deadline.day}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deadline: { ...settings.deadline, day: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg focus:outline-none"
              >
                <option value="">Submission Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="text"
                  value={settings.deadline.time}
                  placeholder="Click here to set the time of deadline"
                  className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg focus:outline-none"
                  readOnly
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full bg-purple-700 text-white py-3 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200
                     ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ChangeScheduleSettings;
