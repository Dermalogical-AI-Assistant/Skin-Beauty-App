// components/Sidebar.tsx
import React, {useEffect, useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {

  const [isOpen, setIsOpen] = useState(props.isOpen);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const handleDelete = () => {
    props.onDelete();
    setIsOpen(false);
  };

  const handleClose = () => {
    props.onClose();
    setIsOpen(false);
  };

  return (
    <div className={`fixed z-100 top-0 w-full h-full flex items-center justify-center bg-white/25 backdrop-blur-xs ${isOpen ? "block" : "hidden"}`}>
      <div className="w-96 p-7 bg-primary shadow-lg rounded-lg ring-1 ring-gray-200">
        <h1 className={`font-extrabold text-2xl`}>{props.title}</h1>
        <p className={`py-4`}>{props.subtitle}</p>
        <div className={`flex justify-end gap-4 mt-4`}>
          <button
            className="border border-gray-300 hover:bg-secondary text-black px-4 py-2 rounded-md"
            onClick={() => handleClose()}
          >
            Cancel
          </button>
          <button
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
