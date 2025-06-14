import React, { useEffect, useState } from "react";
import { Upload, Camera, History, ArrowDown } from "lucide-react";
import { FaTimes, FaUpload } from "react-icons/fa";
import useSkinAnalysis from "../../../hooks/useSkinAnalysis.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DotLoader from "../../../components/DotLoader";
import CameraModal from "../CameraModal";
import { ToggleButton } from "@mui/material";
import { AiFillCaretDown } from "react-icons/ai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const AnalyzeSkinApp: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const {useFetchAnalysisHistory, onSubmitAnalyzeSkin, isLoading} = useSkinAnalysis();
  const [historyPage, setHistoryPage] = useState(1);

  const {data: analysisHistory, refetch: refetchHistory, isLoading: isHistoryLoading} = useFetchAnalysisHistory({
    page: historyPage,
    per_page: 10
  });

  useEffect(() => {
    console.log("Analysis History Data:", selectedImage);
  }, [selectedImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("No image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      onSubmitAnalyzeSkin(
        formData,
        // success
        (response) => {
          console.log("response", response);
          toast.success("Upload successful!");
          const imageURL = URL.createObjectURL(imageFile);
          navigate('/skin-analysis/result', {
            state: {
              data: response,
              url: imageURL,
              fileName: imageFile.name
            },
          })
        },
        // error
        (error) => {
          alert("Upload failed: " + error.message);
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'none':
        return 'bg-green-100 text-green-800';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Xử lý khi mở camera
  const handleTakePhoto = () => {
    setIsCameraOpen(true);
  };

  // Xử lý khi đóng camera
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  // Xử lý khi chụp ảnh từ camera
  const handleCameraCapture = (file: File, url: string) => {
    setImageFile(file);
    setSelectedImage(url);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  return (
    <div
      className="from-orange-25 via-amber-25 to-yellow-25 min-h-screen bg-gradient-to-br p-4 lg:p-8"
      style={{
        background:
          "linear-gradient(135deg, #fefcf9 0%, #fefbf7 50%, #fefaf5 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center lg:mb-12">
          <h1 className="from-pink-light to-pink-light/50 mb-4 bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent drop-shadow-2xl lg:text-4xl">
            Analyze Skin
          </h1>
          <p className="text-primary-dark/70 mx-auto max-w-xl text-lg lg:text-lg">
            Upload or capture your skin image for comprehensive analysis using
            advanced AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 space-y-10">
          {/* Left Column - Main Actions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image Preview Area - Only show when image is selected */}
            {selectedImage && (
              <div className="rounded-3xl border border-orange-50 bg-white/10 p-6 shadow-lg lg:p-8">
                <h2 className="text-primary-dark mb-6 text-2xl font-semibold">
                  Image Preview
                </h2>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="bg-pink-light/5 h-80 w-80 overflow-hidden rounded-2xl shadow-lg lg:h-96 lg:w-96">
                      <div
                        className={`${isLoading ? "" : "hidden"} absolute h-full w-full bg-white/20 backdrop-blur-xs`}
                      >
                        <div
                          className={`absolute inset-0 flex items-center justify-center`}
                        >
                          <DotLoader />
                        </div>
                      </div>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <div className="mt-6 flex w-full justify-center gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={!imageFile || isLoading}
                    className="bg-pink-light/70 hover:bg-pink-light/90 disabled:bg-pink-light/30 transform rounded-full p-4 text-xl text-white shadow-md transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed"
                  >
                    <FaUpload />
                  </button>
                  <button
                    onClick={handleClearImage}
                    disabled={isLoading}
                    className="bg-pink-light/70 disabled:bg-pink-light/30 transform rounded-full p-4 text-xl text-white shadow-md transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!selectedImage && (
              <div className="rounded-3xl border border-orange-50 bg-white/40 p-6 shadow-lg lg:p-8">
                <h2 className="text-primary-dark mb-6 text-2xl font-semibold">
                  Choose Action
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row lg:gap-6">
                  {/* Upload Image Button */}
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="from-pink-light/60 to-pink-light/20 hover:from-pink-light/40 hover:to-pink-light/90 text-primary-dark/70 transform cursor-pointer rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-lg lg:p-8">
                      <div className="text-center">
                        <Upload className="mx-auto mb-4 h-10 w-10 lg:h-12 lg:w-12" />
                        <span className="block text-lg font-semibold lg:text-xl">
                          Upload Image
                        </span>
                        <span className="mt-2 block text-sm opacity-90 lg:text-base">
                          From your device
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Take Photo Button */}
                  <button
                    onClick={handleTakePhoto}
                    className="from-pink-light/60 to-pink-light/20 hover:from-pink-light/40 hover:to-pink-light/90 text-primary-dark/70 flex-1 transform rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-lg lg:p-8"
                  >
                    <div className="text-center">
                      <Camera className="mx-auto mb-4 h-10 w-10 lg:h-12 lg:w-12" />
                      <span className="block text-lg font-semibold lg:text-xl">
                        Take Photo
                      </span>
                      <span className="mt-2 block text-sm opacity-90 lg:text-base">
                        Use camera
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-orange-50 bg-white/40 p-6 shadow-lg lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-primary-dark text-2xl font-semibold">
                  History
                </h2>
                <button
                  onClick={toggleHistory}
                  className="text-primary-dark transition-all duration-200 hover:scale-110 rounded-full  hover:shadow-lg lg:p-2"
                >
                  {showHistory ? <FiChevronDown size={30} /> : <FiChevronUp size={30} />}
                </button>
              </div>

              {analysisHistory && analysisHistory.analyses.length > 0 ? (
                <>
                  {showHistory && (
                    <div className="max-h-96 space-y-4 overflow-x-hidden overflow-y-auto lg:max-h-[500px]">
                      {analysisHistory?.analyses.map((item) => (
                        <div
                          key={item.id}
                          className="cursor-pointer rounded-xl border border-orange-100 bg-gradient-to-r from-white/60 to-white/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                          {/* Header with date and severity */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              {formatDate(item.created_at)}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${item?.severity_level && getSeverityColor(item?.severity_level)}`}
                            >
                              {item.severity_level}
                            </span>
                          </div>

                          {/* Image thumbnail */}
                          <div className="mb-3 flex items-center gap-3">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={item.image_url}
                                alt="Analysis"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMyNCAzNiAyNCAzNiAyNCAzNlpNMjQgMTJDMjQgMTIgMjQgMTIgMjQgMTJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=";
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-semibold text-gray-800">
                                {item.skin_type}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.total_detections} acne detections found
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center lg:py-12">
                  <History className="mx-auto mb-4 h-16 w-16 text-orange-200 lg:h-20 lg:w-20" />
                  <p className="text-primary-dark/70"> No history found</p>
                  <p className={`text-primary-dark/70 mb-6`}>
                    {" "}
                    Click the button below to refresh history.
                  </p>
                  <button
                    onClick={() => refetchHistory}
                    className="text-pink-light font-black drop-shadow-2xl transition-colors duration-200"
                  >
                    Refresh History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={handleCloseCamera}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default AnalyzeSkinApp;