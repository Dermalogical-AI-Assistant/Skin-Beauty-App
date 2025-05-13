import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import useFiles from "../../../hooks/useFiles";
import useSkinAnalysis from "../../../hooks/useSkinAnalysis.ts";

const SkinPhoto: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uploadFile } = useFiles();

  const { file: imageFile, url: imageURL } = location.state || {};

  const { onSubmitAnalyzeSkin } = useSkinAnalysis()

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("No image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    onSubmitAnalyzeSkin(
      formData,
      // success
      (response) => {
        toast.success("Upload successful!");
        console.log("response", response);
        navigate('../result', {
          state: { data: response,   url: imageURL },
        });
      },
      // error
      (error) => {
        toast.error("Upload failed: " + error.message);
      }
    )

    uploadFile.mutate(formData, {
      onSuccess: (data) => {
        // const uploadFileResponse = data.data;
        // console.log({uploadFileResponse})
        navigate('../result')
      },
      onError: (err) => toast.error("Upload failed: " + err.message),
    });
  };

  const handleCancel = () => {
    navigate(-1)
  };

  if (!imageURL) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No image selected</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">

      <img
        src={imageURL}
        alt="Skin Preview"
        className="w-1/3 aspect-square object-contain rounded-2xl shadow-primary bg-white/50 mb-6"
      />

      <div className="flex gap-6">
        <button
          onClick={handleUpload}
          className="p-4 rounded-full bg-[#F3BBA5] text-white text-xl shadow-md hover:scale-105 transition"
        >
          <FaUpload />
        </button>
        <button
          onClick={handleCancel}
          className="p-4 rounded-full bg-[#F3BBA5] text-white text-xl shadow-md hover:scale-105 transition"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default SkinPhoto;
