import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        setStatus({
          type: "success",
          message: "Password reset link has been sent to your email",
        });
        // Optionally redirect after a delay
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus({
          type: "error",
          message: response.message,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/websiteLogo.jpg" alt="Logo" className="w-24 h-24" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {/* Status Messages */}
        {status.message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 text-white py-3 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200
                     ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 text-purple-700 hover:text-purple-800 w-full text-center"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
