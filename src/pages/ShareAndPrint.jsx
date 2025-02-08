import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPriorities } from "../services/api";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const ShareAndPrint = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [selectedView, setSelectedView] = useState("Week");
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("12.1.2025 - 18.1.2025");

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const response = await getPriorities(scheduleId);
        if (response.success) {
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

  const SchedulePDF = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Schedule for {dateRange}</Text>
        {Object.entries(scheduleData).map(([date, shifts]) => (
          <View key={date} style={styles.section}>
            <Text style={styles.date}>{date}</Text>
            {Object.entries(shifts).map(([shift, assignment]) => (
              <View key={shift} style={styles.shift}>
                <Text>{shift}:</Text>
                <Text>{assignment}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );

  const sharePDF = async () => {
    try {
      const pdfBlob = await new Promise((resolve) => {
        const doc = <SchedulePDF />;
        PDFDownloadLink.create(doc)
          .toBlob()
          .then((blob) => resolve(blob));
      });

      if (navigator.share) {
        const file = new File([pdfBlob], "schedule.pdf", {
          type: "application/pdf",
        });

        await navigator.share({
          files: [file],
          title: "Schedule",
          text: "Check out the schedule",
        });
      } else {
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Share via WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=Check out the schedule: ${encodeURIComponent(
          pdfUrl
        )}`;
        window.open(whatsappUrl, "_blank");

        // Share via Telegram
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
          pdfUrl
        )}&text=Check out the schedule`;
        window.open(telegramUrl, "_blank");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
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
        <h1 className="text-xl font-medium">Share & Print</h1>
      </header>

      {/* View Selector */}
      <div className="px-4 mb-4">
        <div className="bg-gray-800 p-1 rounded-lg flex">
          {["Week", "Month", "Year"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`flex-1 py-2 text-center rounded-md transition-colors
                       ${
                         selectedView === view
                           ? "bg-gray-700 text-white"
                           : "text-gray-400 hover:bg-gray-700"
                       }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Schedule Preview</h2>
          <div className="space-y-4">
            {Object.entries(scheduleData).map(([date, shifts]) => (
              <div key={date} className="bg-gray-700 rounded-lg p-4">
                <div className="font-medium mb-2">{date}</div>
                <div className="space-y-2">
                  {Object.entries(shifts).map(([shift, assignment]) => (
                    <div
                      key={shift}
                      className="flex justify-between items-center p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      <span className="text-sm">{shift}</span>
                      <span className="text-sm text-purple-400">
                        {assignment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="p-4">
        <div className="space-y-4">
          <button className="w-full flex justify-between items-center py-3 border-b border-gray-700 hover:bg-gray-800 transition-colors">
            <span>Range</span>
            <div className="flex items-center gap-2">
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

          <button className="w-full flex justify-between items-center py-3 border-b border-gray-700 hover:bg-gray-800 transition-colors">
            <span>Shifts</span>
            <div className="flex items-center gap-2">
              <span>All</span>
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
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 inset-x-0 p-4 flex gap-4 bg-gray-900">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-800 py-3 rounded-lg text-center hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <PDFDownloadLink
          document={<SchedulePDF />}
          fileName="schedule.pdf"
          className="flex-1 bg-purple-600 py-3 rounded-lg text-center hover:bg-purple-700 transition-colors"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? "Generating PDF..." : "Download PDF"
          }
        </PDFDownloadLink>
        <button
          onClick={sharePDF}
          className="flex-1 bg-green-600 py-3 rounded-lg text-center hover:bg-green-700 transition-colors"
        >
          Share via WhatsApp/Telegram
        </button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
  },
  shift: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});

export default ShareAndPrint;
