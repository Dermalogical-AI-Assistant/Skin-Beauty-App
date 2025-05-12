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
      console.log(url)
      navigate("skin-photo", {
        state: { file, url },
      });
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <div className={`flex justify-center items-center`}>
        <h1 className="text-3xl font-semibold text-pink-light my-10">Analyze Skin</h1>
      </div>
      <div className="flex-grow flex w-full justify-around items-center px-6  pb-28">
        <div
          className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105"
          onClick={openFileExplorer}
        >
          <div className="mb-2 rounded-full bg-pink-light drop-shadow-pink-light drop-shadow-lg p-5 text-4xl text-white">
            <FaUpload />
          </div>
          <span className="text-primary-dark/70 text-3xl font-bold py-3">Upload image</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105">
          <div className="mb-2 rounded-full bg-pink-light drop-shadow-pink-light drop-shadow-lg p-5 text-4xl text-white">
            <FaCamera />
          </div>
          <span className="text-primary-dark/70 text-3xl font-bold py-3">Take photo</span>
        </div>
      </div>
    </div>
  );
};

export default UploadSkinPhoto;
