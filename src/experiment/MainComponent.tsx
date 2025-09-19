import React from "react";

interface MainComponentProps {
  showSub: boolean;
  setShowSub: (show: boolean) => void;
}

const MainComponent: React.FC<MainComponentProps> = ({
  showSub,
  setShowSub,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Component Chính</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => setShowSub(!showSub)}
      >
        {showSub ? "Ẩn Component Phụ" : "Hiện Component Phụ"}
      </button>
    </div>
  );
};

export default MainComponent;
