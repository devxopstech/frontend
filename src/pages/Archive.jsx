import { useNavigate, useParams } from "react-router-dom";
import WeekCalendar from "../components/WeekCalendar";
import { useEffect, useState } from "react";
import { getPriorities } from "../services/api";
import { useSubscription } from "../hooks/useSubscription";

const getShiftTime = (shift) => {
  const shiftTimes = {
    Morning: "6:00 AM - 2:00 PM",
    Afternoon: "2:00 PM - 10:00 PM",
    Night: "10:00 PM - 6:00 AM",
  };
  return shiftTimes[shift] || "";
};

const getDayFromPref = (pref) => pref.split("-")[0];
const getShiftFromPref = (pref) => pref.split("-")[1];

const Archive = () => {
  const { scheduleId } = useParams();
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [days, setDays] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const navigate = useNavigate();
  const { canAccess, checkAndShowUpgradePrompt } = useSubscription();

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setLoading(true);
        const response = await getPriorities(scheduleId);
        console.log("API Response:", response);

        if (response.success) {
          setPriorities(response.data);

          // Process shifts
          const uniqueShifts = new Set();
          const shiftData = [];
          response.data.forEach((priority) => {
            priority.preferences.forEach((pref) => {
              const shiftName = getShiftFromPref(pref);
              if (!uniqueShifts.has(shiftName)) {
                uniqueShifts.add(shiftName);
                shiftData.push({
                  name: shiftName,
                  time: getShiftTime(shiftName),
                });
              }
            });
          });
          setShifts(Array.from(shiftData));

          // Process schedule data
          const scheduleMapping = {};
          response.data.forEach((priority) => {
            priority.preferences.forEach((pref) => {
              scheduleMapping[pref] = priority.userId.name;
            });
          });
          setScheduleData(scheduleMapping);

          // Process days
          const uniqueDays = new Set();
          response.data.forEach((priority) => {
            priority.preferences.forEach((pref) => {
              uniqueDays.add(getDayFromPref(pref));
            });
          });

          // Fixed: Using the first priority's createdAt as reference date
          const referenceDate = response.data[0]?.createdAt
            ? new Date(response.data[0].createdAt)
            : new Date();

          const daysArray = Array.from(uniqueDays).map((dayName) => ({
            name: dayName,
            date: referenceDate.toLocaleDateString(),
          }));

          setDays(daysArray);
        }
      } catch (error) {
        console.error("Error fetching priorities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchPriorities();
    }
  }, [scheduleId]);

  const handleExport = () => {
    if (checkAndShowUpgradePrompt("exportSchedule")) {
      navigate(`/share/${scheduleId}`);
    }
  };

  const handleShare = () => {
    if (checkAndShowUpgradePrompt("shareSchedule")) {
      navigate(`/export/${scheduleId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-purple-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
          <h1 className="text-white text-xl font-medium">Archive</h1>
        </div>
        <div className="flex items-center gap-4">
          {" "}
          {canAccess("exportSchedule") ? (
            <>
              <button onClick={handleExport} className="text-white p-2">
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </button>
              <button onClick={handleShare} className="text-white p-2">
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      </header>

      <div className="p-6">
        <WeekCalendar />
        <h3 className="text-center mt-8 mb-6">Station 1</h3>

        {shifts.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div></div>
              {shifts.map((shift) => (
                <div
                  key={shift.name}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <div className="font-medium">{shift.name}</div>
                  <div className="text-sm text-gray-500">{shift.time}</div>
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={day.name} className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">{day.name}</div>
                  <div className="text-sm text-gray-500">{day.date}</div>
                </div>
                {shifts.map((shift) => (
                  <div
                    key={shift.name}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    {scheduleData[`${day.name}-${shift.name}`] && (
                      <span className="text-purple-600">
                        {scheduleData[`${day.name}-${shift.name}`]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {!shifts.length && (
          <div className="text-center text-gray-500 mt-8">
            No schedule data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
