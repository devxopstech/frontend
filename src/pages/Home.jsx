import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsModal from "../components/modals/NotificationsModal";
import MenuModal from "../components/modals/MenuModal";
import { getUserDetails } from "../services/api";
import Loader from "../components/Loader";

const Home = () => {
  const navigate = useNavigate();
  const [showUpdate, setShowUpdate] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      // Try fetching user details from backend if exists
      const response = await getUserDetails({ authToken: token });
      console.log(response);

      if (response?.success) {
        setUserData(response.data);
      } else {
        // If token is invalid, check if user logged in with Google
        const storedUser = localStorage.getItem("userData");

        if (storedUser) {
          setUserData(JSON.parse(storedUser)); // Load Google user data
        } else {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex justify-between items-center">
        <button
          onClick={() => setShowMenu(true)}
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-white text-xl font-medium">Home</h1>

        <button
          onClick={() => setShowNotifications(true)}
          className="text-white hover:bg-purple-600 p-2 rounded-lg transition-colors relative"
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
      </header>

      {/* Update Banner */}
      {showUpdate && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 mx-4 mt-4 rounded-xl text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <img
                src="/websiteLogo.jpg"
                alt="App Icon"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">A new version is available.</h3>
              <p className="text-sm opacity-90 mb-3">
                The update is available in the store. Updating the app will get
                you the latest features and the best experience.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowUpdate(false)}
                  className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Dismiss
                </button>
                <button className="px-4 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 mt-8">
        <h2 className="text-2xl font-bold mb-8">
          Hello{" "}
          {userData?.name ||
            JSON.parse(localStorage.getItem("userData"))?.name ||
            "User"}
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/schedules")}
            className="w-full bg-purple-700 text-white py-4 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200
                     shadow-sm hover:shadow-md"
          >
            My Schedules
          </button>

          <button
            onClick={() => navigate("/new-schedule/name")}
            className="w-full bg-purple-700 text-white py-4 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200
                     shadow-sm hover:shadow-md"
          >
            Create New Schedule
          </button>
        </div>
      </div>

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showMenu && (
        <MenuModal onClose={() => setShowMenu(false)} userData={userData} />
      )}
    </div>
  );
};

export default Home;
