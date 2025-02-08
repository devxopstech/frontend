import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectScheduleSize from "../components/modals/SelectScheduleSize";
const CreateSchedule = () => {
  const [showSizeModal, setShowSizeModal] = useState(true);
  const navigate = useNavigate();

  const handleSizeSelection = (size) => {
    setShowSizeModal(false);

    navigate("/upgrade");
    // Continue with schedule creation with selected size
    console.log("Selected size:", size);
  };

  return (
    <>
      {showSizeModal && (
        <SelectScheduleSize
          onClose={() => navigate(-1)}
          onContinue={handleSizeSelection}
        />
      )}
    </>
  );
};

export default CreateSchedule;
