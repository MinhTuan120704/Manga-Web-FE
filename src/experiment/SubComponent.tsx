import React from "react";

interface SubComponentProps {
  show: boolean;
}

const SubComponent: React.FC<SubComponentProps> = ({ show }) => {
  console.log("SubComponent render, show:", show); // Debug log

  return (
    <>
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ${
          show ? "opacity-30" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 48, backgroundColor: 'rgba(0,0,0,0.5)' }}
      />

      {/* Preview modal */}
      <div
        className="fixed top-0 right-0 w-1/2 h-full transition-all duration-500 ease-in-out"
        style={{
          zIndex: 50,
          right: 0,
          transform: show ? "translateX(0)" : "translateX(100%)",
          backgroundColor: "#1e293b",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          borderLeft: "4px solid #3b82f6",
          padding: "2rem",
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <h3 style={{ color: "#ffffff", marginBottom: "1rem", fontSize: "1.875rem", fontWeight: "bold" }}>
              Preview Truyện
            </h3>
            <div style={{ backgroundColor: "#374151", borderRadius: "0.5rem", padding: "1.5rem" }}>
              <p style={{ color: "#f1f5f9", lineHeight: "1.6" }}>
                 Đây là preview pane
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubComponent;