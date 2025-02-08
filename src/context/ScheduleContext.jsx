// src/context/ScheduleContext.jsx
import { createContext, useContext, useState } from "react";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [scheduleData, setScheduleData] = useState({
    size: null,
    name: "",
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

  const updateScheduleData = (newData) => {
    setScheduleData((prev) => ({ ...prev, ...newData }));
    console.log("Updated Schedule Data:", { ...scheduleData, ...newData });
  };

  return (
    <ScheduleContext.Provider value={{ scheduleData, updateScheduleData }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
