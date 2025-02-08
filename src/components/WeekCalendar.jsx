import { useState } from "react";

const WeekCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // Get week dates starting from currentDate
  const getWeekDates = (date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push({
        date: day.getDate(),
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: day,
      });
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const start = weekDates[0].fullDate;
    const end = weekDates[6].fullDate;
    return `${start.getDate()}.${
      start.getMonth() + 1
    }.${start.getFullYear()} - ${end.getDate()}.${
      end.getMonth() + 1
    }.${end.getFullYear()}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-xl">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-gray-100 rounded"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded"
          >
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
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center">
        {/* Days Row */}
        {weekDates.map(({ day }) => (
          <div key={day} className="text-gray-600 text-sm mb-4">
            {day}
          </div>
        ))}

        {/* Dates Row */}
        {weekDates.map(({ date, fullDate }) => (
          <div key={date} className="flex justify-center">
            <button
              onClick={() => {
                setSelectedDate(date);
                onDateSelect?.(fullDate);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center
                       transition-colors duration-200 text-sm
                       ${
                         selectedDate === date
                           ? "bg-purple-700 text-white"
                           : "hover:bg-gray-100"
                       }`}
            >
              {date}
            </button>
          </div>
        ))}
      </div>

      {/* Date Range */}
      <div className="text-center text-gray-600 mt-6">{formatDateRange()}</div>
    </div>
  );
};

export default WeekCalendar;
