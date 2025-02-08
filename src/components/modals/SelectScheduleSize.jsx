import { useState } from "react";
import { useSchedule } from "../../context/ScheduleContext";

const ScheduleSizeOption = ({ text, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-full mb-3 flex items-center justify-center 
                transition-all duration-200 
                ${
                  isSelected
                    ? "bg-orange-400 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
  >
    {text}
  </button>
);

// Removed the '=' after SelectScheduleSize
export default function SelectScheduleSize({ onClose, onContinue }) {
  const [selectedSize, setSelectedSize] = useState(null);

  const { updateScheduleData } = useSchedule();

  const handleContinue = () => {
    if (selectedSize) {
      updateScheduleData({ size: selectedSize });
      onContinue(selectedSize);
    }
  };
  const sizeOptions = [
    { id: "10", text: "Up to 10 Users" },
    { id: "20", text: "Up to 20 Users" },
    { id: "30", text: "Up to 30 Users" },
    { id: "50", text: "Up to 50 Users" },
    { id: "100", text: "Up to 100 Users" },
    { id: "enterprise", text: "Enterprise" },
  ];

  return (
    <div className="fixed inset-0 bg-purple-700 z-50 p-6">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="h-full flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-10 mt-8">
          Select Your Schedule Size
        </h1>

        <div className="flex-1">
          {sizeOptions.map((option) => (
            <ScheduleSizeOption
              key={option.id}
              text={option.text}
              isSelected={selectedSize === option.id}
              onClick={() => setSelectedSize(option.id)}
            />
          ))}
        </div>

        <p className="text-white text-center mb-6">
          Choose the package that best fits your company size. You can upgrade
          anytime as your team grows.
        </p>

        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-lg bg-teal-400 text-white font-medium
                    transition-all duration-200 
                    ${!selectedSize && "opacity-50 cursor-not-allowed"}`}
          disabled={!selectedSize}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
