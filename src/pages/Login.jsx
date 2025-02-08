import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("handleSubmit called"); // Add this line
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      console.log(response);

      if (response.success) {
        // Successful login
        localStorage.setItem("authToken", response.data.authToken);
        navigate("/home");
      } else {
        // Failed login - show the error message
        setError(response.message);

        // Check if it's an unverified email error
        if (response.message.toLowerCase().includes("verify")) {
          navigate("/verify-email", {
            state: { email: formData.email },
          });
        }
      }
    } catch (error) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = (window.location.href =
        "http://localhost:3000/api/auth/google"); // Call the backend Google Auth API

      if (response.success) {
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate("/home");
      } else {
        setError(response.message || "Google sign-up failed");
      }
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      setError(error.message || "An unexpected error occurred");
    }
  };

  const handleAppleSignIn = () => {
    const response = (window.location.href =
      "http://localhost:3000/api/auth/apple");
    try {
      if (response.success) {
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate("/home");
      } else {
        setError(response.message || "Google sign-up failed");
      }
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      setError(error.message || "An unexpected error occurred"); // Redirect to backend for Apple OAuth
    }
  };
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/websiteLogo.jpg"
            alt="Scheduler Logo"
            className="w-24 h-24"
          />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">
          Please login to access your account.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    showPassword
                      ? "M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-purple-700 text-sm hover:text-purple-800"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 text-white py-3 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200
                     ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Phone Login Button */}
          <button
            type="button"
            onClick={() => navigate("/phone-login")}
            className="w-full border border-purple-700 text-purple-700 py-3 rounded-lg
                     hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center gap-2"
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Sign in with Phone Number
          </button>
          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-red-600 text-red-600 py-3 rounded-lg
           hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M24 9.5c3.69 0 6.45 1.53 8.08 2.81l6-6C34.82 2.69 29.86 0 24 0 14.79 0 6.88 5.39 3 13.19l6.99 5.42C12.02 12.4 17.48 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24.5c0-1.69-.15-3.31-.43-4.86H24v9.23h13.06c-.56 2.84-2.12 5.28-4.45 6.91l6.99 5.42c4.1-3.8 6.49-9.41 6.49-16.7z"
              />
              <path
                fill="#FBBC05"
                d="M10.19 28.92A14.48 14.48 0 019.5 24c0-1.69.3-3.32.84-4.83L3.36 13.19C1.8 16.51 1 20.11 1 24s.8 7.49 2.36 10.81l6.83-5.89z"
              />
              <path
                fill="#EA4335"
                d="M24 47c6.44 0 11.83-2.13 15.76-5.75l-6.99-5.42c-1.96 1.33-4.47 2.14-7.77 2.14-6.54 0-12.07-4.4-14.05-10.32l-6.99 5.42C8.1 41.61 15.5 47 24 47z"
              />
            </svg>
            Sign In with Google
          </button>
          {/* Apple Login Button */}
          <button
            type="button"
            onClick={handleAppleSignIn}
            className="w-full border border-black text-black py-3 rounded-lg hover:bg-black hover:text-white flex items-center justify-center gap-2"
          >
            🍏 Sign In with Apple
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-700 font-medium hover:text-purple-800"
          >
            Sign Up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
