import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  getWorkArrangement,
  generateWorkArrangement,
  getUserBuilds,
  incrementUserBuilds,
} from "../services/api";
import { toast } from "react-toastify";

const WorkArrangements = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const { user, loading: userLoading } = useContext(UserContext);
  const isPremium = user?.subscriptionTier === "premium";

  const [arrangements, setArrangements] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buildCount, setBuildCount] = useState(0);
  const [hasExistingArrangement, setHasExistingArrangement] = useState(false);

  const shifts = [
    { name: "Morning", time: "07:00 - 15:00" },
    { name: "Afternoon", time: "15:00 - 23:00" },
    { name: "Night", time: "23:00 - 07:00" },
  ];

  const days = [
    { name: "Sunday", date: "2/2/2025" },
    { name: "Monday", date: "3/2/2025" },
    { name: "Tuesday", date: "4/2/2025" },
    { name: "Wednesday", date: "5/2/2025" },
    { name: "Thursday", date: "6/2/2025" },
  ];

  useEffect(() => {
    const fetchArrangements = async () => {
      try {
        if (!user) return;
        setLoading(true);
        const response = await getWorkArrangement(scheduleId);

        if (response.success) {
          setArrangements(response.data.arrangements);
          setHasExistingArrangement(true);

          // Only update build count for free users
          if (!isPremium && user._id) {
            const serverCount = await getUserBuilds(user._id);
            setBuildCount(serverCount);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch arrangements");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchArrangements();
    }
  }, [scheduleId, user?._id, isPremium]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  const handleGenerateNew = async () => {
    if (!isPremium && buildCount >= 5) {
      toast.error(
        "You've reached the free trial limit. Upgrade to Premium for unlimited builds!"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await generateWorkArrangement(scheduleId);

      if (response.success) {
        setArrangements(response.data.arrangements);

        // Only increment count for free users
        if (!isPremium) {
          const newCount = await incrementUserBuilds(user._id);
          setBuildCount(newCount);
        }

        toast.success("New arrangement generated successfully!");
        setHasExistingArrangement(true);
      }
    } catch (err) {
      setError(err.message || "Failed to generate arrangement");
      toast.error("Failed to generate arrangement");
    } finally {
      setLoading(false);
    }
  };

  const ArrangementCell = ({ day, shift }) => {
    const key = `${day.name}-${shift.name}`;
    const cellArrangements = arrangements[key] || [];

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm min-h-[100px]">
        {cellArrangements.length > 0 ? (
          cellArrangements.map((arrangement) => (
            <div
              key={arrangement._id}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-gray-800 font-medium">
                {arrangement.name}
              </span>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Vacant
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
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
          <h1 className="text-white text-xl font-medium">Work Arrangements</h1>
        </div>

        {!hasExistingArrangement && (isPremium || buildCount < 5) && (
          <button
            onClick={handleGenerateNew}
            className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50"
          >
            Generate New Arrangement
          </button>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!isPremium && !hasExistingArrangement && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">
              {buildCount >= 5
                ? "Free trial limit reached! Upgrade to Premium for unlimited builds."
                : `Free tier: ${5 - buildCount} builds remaining`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            <p className="mt-4 text-gray-600">Loading arrangements...</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Week of February 2 - 8, 2025
              </h2>
              <p className="text-gray-600">
                {hasExistingArrangement
                  ? "Current Arrangement"
                  : "No arrangement generated yet"}
              </p>
            </div>

            {hasExistingArrangement && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1"></div>
                  {shifts.map((shift) => (
                    <div
                      key={shift.name}
                      className="text-center bg-gray-100 p-4 rounded-lg"
                    >
                      <div className="font-medium text-gray-800">
                        {shift.name}
                      </div>
                      <div className="text-sm text-gray-500">{shift.time}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {days.map((day) => (
                    <div
                      key={day.name}
                      className="grid grid-cols-4 gap-4 items-start"
                    >
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-medium text-gray-800">
                          {day.name}
                        </div>
                        <div className="text-sm text-gray-500">{day.date}</div>
                      </div>
                      {shifts.map((shift) => (
                        <ArrangementCell
                          key={`${day.name}-${shift.name}`}
                          day={day}
                          shift={shift}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Attendance</span>
                    <span className="text-white">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-0"></div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkArrangements;
