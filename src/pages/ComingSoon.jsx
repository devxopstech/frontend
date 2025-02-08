import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <img
        src="https://www.svgrepo.com/show/331773/under-construction.svg"
        alt="Coming Soon"
        className="w-64 h-64"
      />
      <h1 className="text-2xl font-semibold text-gray-800 mt-4">
        Feature Coming Soon
      </h1>
      <p className="text-gray-500 mt-2 text-center max-w-md">
        We're working hard on this feature. Stay tuned!
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ComingSoon;
