import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        // Decode token to get email
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const { email } = JSON.parse(window.atob(base64));

        const response = await verifyEmail(email);

        if (response.success) {
          setStatus("success");
          // Redirect to login after 3 seconds
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Email Verified!
            </h2>
            <p className="text-gray-600">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-gray-600">
              We couldn't verify your email. The link might be expired or
              invalid.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 text-purple-700 hover:text-purple-800"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
