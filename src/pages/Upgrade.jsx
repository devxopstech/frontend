// pages/Upgrade.jsx
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:bg-purple-600 p-2 rounded-lg"
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
        <h1 className="text-white text-xl font-medium">Upgrade to Premium</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Current Plan */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Current Plan: Free</h2>
          <p className="text-gray-600">You have used {5} of 5 free builds</p>
        </div>

        {/* Premium Features */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Premium Features</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Unlimited work arrangement builds</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Export and share schedules</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Access to schedule archives</span>
            </li>
          </ul>
        </div>

        {/* Pricing */}
        <div className="bg-purple-700 text-white rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
            <div className="text-4xl font-bold mb-4">
              $9.99<span className="text-sm">/month</span>
            </div>
            <button
              onClick={() => {
                /* Implement payment logic */
              }}
              className="w-full bg-white text-purple-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
