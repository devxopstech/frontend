import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Add resend verification email logic here
      setIsResending(false);
    } catch (error) {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto text-center">
        {/* Email Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-purple-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify your email
          </h1>

          <div className="text-gray-600">
            <p>We've sent a verification email to:</p>
            <p className="font-medium text-gray-900 mt-1">{email}</p>
          </div>

          <p className="text-gray-600">
            Click the link in the email to verify your account. If you don't see
            the email, check your spam folder.
          </p>

          {/* Resend Email Button */}
          <div className="pt-4">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`text-purple-700 hover:text-purple-800 font-medium
                       ${isResending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isResending ? "Resending..." : "Resend verification email"}
            </button>
          </div>

          {/* Back to Login */}
          <div className="pt-8 border-t">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-gray-800"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
