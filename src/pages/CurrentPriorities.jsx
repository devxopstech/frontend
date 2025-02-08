import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";
import { getPriorities, generateWorkArrangement } from "../services/api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const CurrentPriorities = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const { user } = useContext(UserContext);
  const isPremium = user?.subscriptionTier === "premium";

  const [showHelp, setShowHelp] = useState(false);
  const [priorities, setPriorities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { isWithinUsageLimit, checkAndShowUpgradePrompt } = useSubscription();
  const [buildCount, setBuildCount] = useState(() => {
    // Only track build count for free users
    if (!isPremium) {
      const stored = localStorage.getItem("buildCount");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

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

  // Only update localStorage for free users
  useEffect(() => {
    if (!isPremium) {
      localStorage.setItem("buildCount", buildCount.toString());
    }
  }, [buildCount, isPremium]);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setLoading(true);
        const response = await getPriorities(scheduleId);

        if (response.success && response.data) {
          const formattedPriorities = {};
          response.data.forEach((priority) => {
            priority.preferences.forEach((pref) => {
              if (!formattedPriorities[pref]) {
                formattedPriorities[pref] = [];
              }
              formattedPriorities[pref].push({
                name:
                  priority.userId?.name ||
                  priority.userId?.email ||
                  "Unknown User",
                station: priority.station || "No Station",
              });
            });
          });
          setPriorities(formattedPriorities);
        } else {
          setError("No priorities found");
        }
      } catch (err) {
        console.error("Error fetching priorities:", err);
        setError(err.message || "Failed to fetch priorities");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchPriorities();
    }
  }, [scheduleId]);

  const PriorityCell = ({ day, shift }) => {
    const key = `${day.name}-${shift.name}`;
    const cellPriorities = priorities[key] || [];

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm min-h-[100px] transition-all duration-200 hover:shadow-md">
        {cellPriorities.length > 0 ? (
          cellPriorities.map((priority, index) => (
            <div
              key={`${priority.name}-${index}`}
              className="flex items-center justify-between mb-2 last:mb-0"
            >
              <span className="text-gray-800 font-medium">{priority.name}</span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                {priority.station}
              </span>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No priorities
          </div>
        )}
      </div>
    );
  };

  const handleGenerateArrangement = async () => {
    if (!isPremium && buildCount >= 5) {
      toast.error(
        "You've reached the free trial limit. Upgrade to Premium for unlimited builds!"
      );
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateWorkArrangement(scheduleId);

      if (response.success) {
        if (!isPremium) {
          setBuildCount((prev) => prev + 1);
        }
        navigate(`/work-arrangements/${scheduleId}`);
      } else {
        setError("Failed to generate work arrangement");
      }
    } catch (err) {
      console.error("Error generating arrangement:", err);
      setError(err.message || "Failed to generate work arrangement");
    } finally {
      setIsGenerating(false);
    }
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
          <h1 className="text-white text-xl font-medium">Current Priorities</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            <p className="mt-4 text-gray-600">Loading priorities...</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Week of January 12 - 18, 2025
              </h2>
              <p className="text-gray-600">
                Priority submissions for all employees
              </p>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1"></div>
              {shifts.map((shift) => (
                <div
                  key={shift.name}
                  className="text-center bg-gray-100 p-4 rounded-lg"
                >
                  <div className="font-medium text-gray-800">{shift.name}</div>
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
                    <div className="font-medium text-gray-800">{day.name}</div>
                    <div className="text-sm text-gray-500">{day.date}</div>
                  </div>
                  {shifts.map((shift) => (
                    <PriorityCell
                      key={`${day.name}-${shift.name}`}
                      day={day}
                      shift={shift}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="relative mt-8">
              {!isPremium && (
                <div className="mb-4 text-sm text-gray-600 text-center">
                  Builds remaining: {5 - buildCount} of 5 (Free tier)
                </div>
              )}

              <button
                onClick={handleGenerateArrangement}
                disabled={isGenerating || (!isPremium && buildCount >= 5)}
                className={`w-full bg-purple-700 text-white py-4 rounded-lg font-medium
                  hover:bg-purple-800 transition-colors duration-200 flex items-center justify-center gap-2
                  shadow-sm hover:shadow-md ${
                    isGenerating || (!isPremium && buildCount >= 5)
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    Generate Work Arrangement
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHelp(!showHelp);
                      }}
                      className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 
                        flex items-center justify-center text-sm"
                    >
                      ?
                    </button>
                  </>
                )}
              </button>

              {showHelp && (
                <div
                  className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-gray-800 
                  text-white text-sm rounded-lg shadow-lg"
                >
                  This will automatically generate optimal work arrangements
                  based on submitted priorities and scheduling rules.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentPriorities;
