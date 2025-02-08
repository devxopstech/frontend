import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import NotificationsModal from "../components/modals/NotificationsModal";
import MenuModal from "../components/modals/MenuModal";
import {
  deleteSchedule,
  getSchedule,
  getWorkArrangement,
} from "../services/api";
import { toast } from "sonner";

const ActionCard = ({ icon, title, onClick, description }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 
              flex flex-col items-center gap-3 relative group"
  >
    <div className="text-purple-700 transition-transform group-hover:scale-110">
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-800">{title}</span>
    {description && (
      <span className="text-xs text-gray-500 text-center">{description}</span>
    )}
  </button>
);

const ScheduleMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpdate, setShowUpdate] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { scheduleId } = useParams(); // Will get the ID from URL
  const [sheduleData, setSheduleData] = useState("");
  console.log("Schedule ID from params:", scheduleId); // Debug log
  const [hasArrangement, setHasArrangement] = useState(false);

  useEffect(() => {
    const checkArrangement = async () => {
      try {
        const response = await getWorkArrangement(scheduleId);
        setHasArrangement(response.success);
      } catch (error) {
        console.error("Error checking arrangement:", error);
        setHasArrangement(false);
      }
    };

    if (scheduleId) {
      checkArrangement();
    }
  }, [scheduleId]);

  useEffect(() => {
    if (!scheduleId) {
      console.log("No schedule ID found");
      navigate("/schedules");
      return;
    }

    const fetchSchedule = async () => {
      try {
        const data = await getSchedule(scheduleId); // ✅ Wait for data
        setSheduleData(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule(); // Call the async function
  }, [scheduleId, navigate]);

  console.log(scheduleId);

  const handleDelete = async (scheduleId) => {
    try {
      if (!scheduleId || typeof scheduleId !== "string") {
        console.error("Invalid schedule ID:", scheduleId);
        return;
      }

      const res = await deleteSchedule(scheduleId);

      if (res?.success) {
        toast.success("Successfully deleted");
        navigate("/schedules");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const actions = [
    {
      title: "Submit Priorities",
      description: "Set your work preferences",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 3L5 7H8V14H10V7H13L9 3ZM16 17V10H14V17H11L15 21L19 17H16Z" />
        </svg>
      ),
      onClick: () => navigate(`/submit-priorities/${scheduleId}`),
    },
    {
      title: "Current Priorities",
      description: "View all submitted priorities",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" />
        </svg>
      ),
      onClick: () => navigate(`/current-priorities/${scheduleId}`),
    },
    {
      title: "Add Employee",
      description: "Set your work preferences",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 10C9.66 10 11 8.66 11 7C11 5.34 9.66 4 8 4C6.34 4 5 5.34 5 7C5 8.66 6.34 10 8 10ZM16 13C13.33 13 8 14.34 8 17V19H24V17C24 14.34 18.67 13 16 13ZM8 12C5.33 12 0 13.34 0 16V18H6V16C6 14.88 6.46 13.89 7.24 13.12C7.94 13.04 8.66 13 9.41 13C8.98 12.72 8.51 12.47 8 12ZM21 14H19V16H17V18H19V20H21V18H23V16H21V14Z" />
        </svg>
      ),
      onClick: () => navigate(`/add-employee/${scheduleId}`),
    },
    {
      title: "Delete Scheldue",
      description: "Set your work preferences",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2C5.45 2 5 2.45 5 3V4H3V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H21V4H19V3C19 2.45 18.55 2 18 2H16C15.45 2 15 2.45 15 3V4H9V3C9 2.45 8.55 2 8 2H6ZM7 6H17V20H7V6ZM10 9V17H12V9H10ZM14 9V17H16V9H14Z" />
        </svg>
      ),
      onClick: () => handleDelete(scheduleId),
    },
    {
      title: "Submit priorties on behalf of employee",
      description: "Set your work preferences",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 20H19V18H5V20ZM12 4L6 10H10V16H14V10H18L12 4Z" />
        </svg>
      ),
      onClick: () => navigate(`/employee-list/${scheduleId}`),
    },
    // {
    //   title: "Work Arrangement",
    //   description: "View generated work arrangements",
    //   icon: (
    //     <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    //       <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" />
    //     </svg>
    //   ),
    //   onClick: () => navigate(`/work-arrangements/${scheduleId}`),
    // },
    // {
    //   title: "Archive Priorities",
    //   description: "View and export past priorities",
    //   icon: (
    //     <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    //       <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z" />
    //     </svg>
    //   ),
    //   onClick: () => navigate(`/archive/${scheduleId}`),
    // },
    // ... other actions with descriptions and onClick handlers
  ];
  if (hasArrangement) {
    actions.push(
      {
        title: "Work Arrangement",
        description: "View generated work arrangements",
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" />
          </svg>
        ),
        onClick: () => navigate(`/work-arrangements/${scheduleId}`),
      },
      {
        title: "Archive Priorities",
        description: "View and export past priorities",
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27z" />
          </svg>
        ),
        onClick: () => navigate(`/archive/${scheduleId}`),
      }
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
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

        <h1 className="text-white text-xl font-medium">Main</h1>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Schedule Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {sheduleData?.data?.name}
              </h2>
              <p className="text-gray-500">
                Manage your schedule and priorities
              </p>
            </div>
            <button
              onClick={() => navigate(`/schedule/${scheduleId}/settings`)}
              className="text-purple-700 hover:text-purple-800"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {actions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(`/employee-list/${scheduleId}`)}
            className="w-full bg-purple-700 text-white py-4 rounded-lg font-medium
                     hover:bg-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Employee List & Add Requests
          </button>

          <button
            onClick={() => navigate(`/schedule/${scheduleId}/settings`)}
            className="w-full bg-white text-purple-700 py-4 rounded-lg font-medium
                     hover:bg-gray-50 transition-all duration-200 border border-purple-700"
          >
            Schedule Settings
          </button>
        </div>
      </div>

      {/* Modals */}
      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showMenu && <MenuModal onClose={() => setShowMenu(false)} />}
    </div>
  );
};

export default ScheduleMain;
