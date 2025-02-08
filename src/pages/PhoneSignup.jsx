import { useState } from "react";
import { useNavigate } from "react-router-dom";

const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  // Add more as needed
];

const PhoneSignup = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here

    navigate("/home");
  };
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/websiteLogo.jpg"
            alt="Scheduler Logo"
            className="w-24 h-24"
          />
        </div>

        {/* Illustration*/}
        <div className="w-full mb-8">
          <img
            src="/customizable-approach-dark.png"
            alt="People working"
            className="w-full h-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-gray-900 text-xl mb-6 text-center">
          Type in your phone number below to register.
        </h2>

        {/* Phone Input */}
        <div className="mb-6">
          <div className="flex items-center border rounded-lg p-3 bg-gray-50">
            <div className="relative">
              <button
                className="flex items-center gap-2 pr-3 border-r"
                onClick={() => setShowCountryList(!showCountryList)}
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-gray-600">{selectedCountry.code}</span>
                <svg
                  className="w-4 h-4 text-gray-500"
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

              {/* Country Dropdown */}
              {showCountryList && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {countryCodes.map((country) => (
                    <button
                      key={country.code}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryList(false);
                      }}
                    >
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                      <span className="text-gray-500 text-sm">
                        {country.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-transparent ml-3 focus:outline-none"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-700 text-white py-4 rounded-lg mb-6
                   hover:bg-purple-800 transition-colors duration-200"
        >
          Sign In with Phone
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-500 text-sm">Or sign up with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Alternative Sign In Options */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/signup")}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Continue with Email
          </button>

          <button className="w-full border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneSignup;
