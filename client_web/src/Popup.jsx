import React, { useEffect } from "react";

const Popup = ({ isOpen, onClose, title, message, color }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(5px)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border-t-4"
        style={{ borderColor: color }}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center pb-2">
          <h2 className={`text-indigo-700 text-lg font-semibold text-center`}>
            {title}
          </h2>
        </div>

        <div className="mt-4 text-center text-indigo-700 ">{message}</div>
      </div>
    </div>
  );
};

export default Popup;
