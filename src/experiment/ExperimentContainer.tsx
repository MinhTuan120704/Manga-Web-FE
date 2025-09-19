import React, { useState } from "react";
import MainComponent from "./MainComponent";
import SubComponent from "./SubComponent";

const ExperimentContainer: React.FC = () => {
  const [showSub, setShowSub] = useState(false);

  return (
    <div className="w-full h-screen bg-gray-100 flex relative">
      {/* Component chính - luôn full màn hình */}
      <div className="bg-white flex items-center justify-center h-full w-full z-10">
        <MainComponent showSub={showSub} setShowSub={setShowSub} />
      </div>
      {/* Component phụ - modal overlay */}
      <SubComponent show={showSub} />
    </div>
  );
};

export default ExperimentContainer;
