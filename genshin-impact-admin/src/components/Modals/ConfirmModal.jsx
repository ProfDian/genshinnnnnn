import React, { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melakukan tindakan ini?",
  confirmText = "Ya",
  cancelText = "Batal",
  type = "danger", // danger, warning, info
}) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle confirm button color based on type
  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-error hover:bg-red-700 text-white";
      case "warning":
        return "bg-warning hover:bg-yellow-600 text-gray-900";
      case "info":
        return "bg-primary hover:bg-primary-dark text-white";
      default:
        return "bg-error hover:bg-red-700 text-white";
    }
  };

  // Handle icon based on type
  const getIconClass = () => {
    switch (type) {
      case "danger":
        return "text-error";
      case "warning":
        return "text-warning";
      case "info":
        return "text-primary";
      default:
        return "text-error";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center">
            <div className={`mr-4 ${getIconClass()}`}>
              <FiAlertTriangle size={32} />
            </div>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
          <button onClick={onClose} className="btn btn-outline">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
