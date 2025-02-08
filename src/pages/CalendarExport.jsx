import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPriorities } from "../services/api";

const CalendarExport = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [enableExport, setEnableExport] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("default");
  const [dateRange, setDateRange] = useState("Current Week");

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const response = await getPriorities(scheduleId);
        if (response.success) {
          // Process the priorities data into schedule format
          const processedData = processScheduleData(response.data);
          setScheduleData(processedData);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleData();
    }
  }, [scheduleId]);

  const processScheduleData = (priorities) => {
    const schedule = {};

    priorities.forEach((priority) => {
      priority.preferences.forEach((pref) => {
        const [day, shift] = pref.split("-");
        if (!schedule[day]) {
          schedule[day] = {};
        }
        schedule[day][shift] = priority.userId.name;
      });
    });

    return schedule;
  };

  const generateICalContent = () => {
    if (!scheduleData) return null;

    let iCalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Scheduler//EN",
    ];

    Object.entries(scheduleData).forEach(([day, shifts]) => {
      Object.entries(shifts).forEach(([shift, name]) => {
        const dateStr = getDateFromDay(day);
        const [startTime, endTime] = getShiftTimes(shift);

        iCalContent.push(
          "BEGIN:VEVENT",
          `DTSTART:${dateStr}T${startTime}Z`,
          `DTEND:${dateStr}T${endTime}Z`,
          `SUMMARY:${shift} Shift - ${name}`,
          `DESCRIPTION:${name} is scheduled for ${shift} shift`,
          "END:VEVENT"
        );
      });
    });

    iCalContent.push("END:VCALENDAR");
    return iCalContent.join("\n");
  };

  const getDateFromDay = (day) => {
    // Convert day name to actual date based on current week
    const date = new Date(); // You'll need to adjust this based on your schedule's week
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  const getShiftTimes = (shift) => {
    const times = {
      Morning: ["060000", "140000"],
      Afternoon: ["140000", "220000"],
      Night: ["220000", "060000"],
    };
    return times[shift] || ["000000", "000000"];
  };

  const handleExport = () => {
    if (!enableExport || !scheduleData) return;

    const iCalContent = generateICalContent();
    const blob = new Blob([iCalContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "schedule.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <h1 className="text-white text-xl font-medium">Calendar Export</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg">
          <span>Enable Export</span>
          <button
            onClick={() => setEnableExport(!enableExport)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 
                     ${enableExport ? "bg-purple-700" : "bg-gray-200"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200
                         ${enableExport ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        <div className="bg-white rounded-lg divide-y">
          <button
            onClick={() =>
              setSelectedCalendar(
                selectedCalendar === "default" ? "google" : "default"
              )
            }
            className="w-full p-4 flex justify-between items-center"
          >
            <span>Default Calendar</span>
            <div className="flex items-center gap-2 text-gray-500">
              <span>{selectedCalendar}</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={() =>
              setDateRange(
                dateRange === "Current Week" ? "Next Week" : "Current Week"
              )
            }
            className="w-full p-4 flex justify-between items-center"
          >
            <span>Shift Calendars</span>
            <div className="flex items-center gap-2 text-gray-500">
              <span>{dateRange}</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        <button
          onClick={handleExport}
          className={`w-full py-3 rounded-lg ${
            enableExport
              ? "bg-purple-700 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
          disabled={!enableExport || loading}
        >
          {loading ? "Loading..." : "Start Export"}
        </button>
      </div>
    </div>
  );
};

export default CalendarExport;
