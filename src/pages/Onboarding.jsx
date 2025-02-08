import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/stay-connected-dark.png",
      title: "Stay Connected",
      description:
        "By connecting with your employees, you no longer have to contact them yourself, they send the priorities for you on and everybody sees them on the platform.",
    },
    {
      image: "/algorithmic-calculation-dark.png",
      title: "Manage Schedules",
      description:
        "Create and manage employee schedules easily. Set shifts, track submissions, and keep everyone on the same page.",
    },
    {
      image: "/onboarding_6.png",
      title: "Track Progress",
      description:
        "Monitor schedule submissions and employee preferences in real-time. Make informed decisions with comprehensive data.",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => (prev + 1) % slides.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Image Carousel */}
        <div
          className="w-full aspect-square relative mb-8 overflow-hidden"
          {...handlers}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out`}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-4">
          {slides[currentSlide].title}
        </h1>

        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-purple-700 text-white py-4 rounded-lg
                   hover:bg-purple-800 transform hover:-translate-y-0.5
                   transition-all duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Start Now
        </button>

        {/* Progress Indicator */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200
                       ${
                         currentSlide === index
                           ? "bg-purple-700"
                           : "bg-gray-200"
                       }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
