import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture } from "../services/api"; // Add this import
import { UserContext } from "../context/UserContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Shay Panuilov");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // Update state when user data becomes available
    if (user) {
      setDisplayName(user.name || "");
      setProfileImage(user.profilePicture || null);
    }
  }, [user]);
  // Handle photo selection
  const handlePhotoSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        setError("");

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);

        // Create FormData
        const formData = new FormData();
        formData.append("profilePicture", file);

        // Log what's being sent
        console.log("File being sent:", file);
        console.log("FormData entries:", Array.from(formData.entries()));

        const response = await updateProfilePicture(formData);
        if (response.success) {
          console.log("Upload successful:", response);
        } else {
          setError(response.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setError(error.message || "Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Add your update profile logic here

      // Show success message or redirect
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-white">
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
        <h1 className="text-white text-xl font-medium">Profile Settings</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">{error}</div>
        )}

        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className={`px-4 py-2 border border-purple-700 text-purple-700 rounded-lg
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 border-2 border-purple-700 rounded-lg focus:outline-none"
            maxLength={15}
          />
          <div className="text-right text-sm text-gray-500">
            {displayName.length}/15
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-purple-700 text-white py-3 rounded-lg
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Delete Account */}
        <div className="pt-40">
          <button
            disabled={loading}
            className="w-full text-red-600 py-2 hover:underline"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
