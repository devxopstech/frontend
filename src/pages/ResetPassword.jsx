import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePassword } from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      // Decode token to get email
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const { email } = JSON.parse(window.atob(base64));

      const response = await updatePassword({
        email,
        password: passwords.password,
      });

      if (response.success) {
        setStatus({
          type: "success",
          message: "Password updated successfully",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({
          type: "error",
          message: response.message,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Invalid or expired reset link",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        </div>

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
              type="password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              placeholder="New Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              placeholder="Confirm New Password"
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
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
