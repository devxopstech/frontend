import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("URLSearchParams:", params.toString());
    console.log("Extracted Token:", token);

    if (token) {
      // Store the token in localStorage and then navigate
      localStorage.setItem("authToken", token);
      console.log(
        "Token saved to localStorage:",
        localStorage.getItem("authToken")
      );

      // Ensure navigation happens after storage
      setTimeout(() => {
        navigate("/home");
      }, 100); // Add a slight delay to ensure localStorage sync
    } else {
      console.log("🚨 No token found! Inspect error in URL.");
      // ❌ Commenting out redirection for debugging
      // navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Authenticating...</h1>
      <p>Check console logs for debugging...</p>
    </div>
  );
};

export default AuthSuccess;
