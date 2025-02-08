const EmailVerificationRequired = ({ email }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Email Verification Required
          </h3>
          <p className="text-gray-600 mt-2">
            Please verify your email address to access this feature. Check your
            inbox for the verification link.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Email sent to:{" "}
          <span className="font-medium text-gray-900">{email}</span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-purple-700 text-white py-2 rounded-lg
                     hover:bg-purple-800 transition-colors duration-200"
        >
          I've verified my email
        </button>
      </div>
    </div>
  </div>
);
