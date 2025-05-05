import React, { useRef } from "react";
import { FaUpload, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UploadSkinPhoto: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      navigate("skin-photo", {
        state: { file, url },
      });
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold text-[#D28F77]">Analyze Skin</h1>

      <div className="mt-16 flex w-full justify-around px-6">
        <div
          className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105"
          onClick={openFileExplorer}
        >
          <div className="mb-2 rounded-full bg-[#F2907E] p-5 text-4xl text-white">
            <FaUpload />
          </div>
          <span className="text-gray-600">Upload image</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105">
          <div className="mb-2 rounded-full bg-[#F2907E] p-5 text-4xl text-white">
            <FaCamera />
          </div>
          <span className="text-gray-600">Take photo</span>
        </div>
      </div>
    </div>
  );
};

export default UploadSkinPhoto;
