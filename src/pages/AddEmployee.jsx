import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEmployee } from "../services/api";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams(); // Get scheduleId from the URL
  const [addMethod, setAddMethod] = useState("phone"); // "phone" or "email"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "🇺🇸",
    name: "US",
  });
  const [showCountryList, setShowCountryList] = useState(false);
  const [error, setError] = useState("");

  const countries = [
    { code: "+1", flag: "🇺🇸", name: "US" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+91", flag: "🇮🇳", name: "IN" },
    // Add more countries as needed
  ];

  const handleAdd = async () => {
    try {
      const data =
        addMethod === "phone"
          ? { phoneNumber: `${selectedCountry.code}${phoneNumber}` }
          : { email };

      const response = await addEmployee(scheduleId, data);
      console.log("Employee added:", response);

      // Navigate back or to confirmation
      navigate(`/schedule/${scheduleId}`);
    } catch (error) {
      console.error("Failed to add employee:", error);
      setError(error.message || "Failed to add employee");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center gap-4">
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
        <h1 className="text-white text-xl font-medium">Add Employee</h1>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* Title */}
        <h2 className="text-xl font-medium text-center">Add employee with</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setAddMethod("phone")}
            className={`px-6 py-2 rounded-full border ${
              addMethod === "phone"
                ? "border-purple-700 bg-purple-700 text-white"
                : "border-purple-700 text-purple-700"
            } transition-colors duration-200`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Phone
            </span>
          </button>
          <button
            onClick={() => setAddMethod("email")}
            className={`px-6 py-2 rounded-full border ${
              addMethod === "email"
                ? "border-purple-700 bg-purple-700 text-white"
                : "border-purple-700 text-purple-700"
            } transition-colors duration-200`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Email
            </span>
          </button>
        </div>

        {/* Input Field */}
        {addMethod === "phone" ? (
          <div className="relative">
            <div className="flex items-center border-2 border-purple-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowCountryList(!showCountryList)}
                className="flex items-center gap-2 px-3 py-3 border-r border-purple-700 bg-gray-50"
              >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 px-4 py-3 focus:outline-none"
              />
            </div>

            {/* Country Dropdown */}
            {showCountryList && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryList(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                    <span className="text-gray-500">{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg focus:outline-none"
          />
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="w-full bg-purple-700 text-white py-4 rounded-lg
                  hover:bg-purple-800 transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddEmployee;
