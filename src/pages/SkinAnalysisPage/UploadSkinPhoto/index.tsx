import React, { useRef, useState, useEffect } from "react";
import { FaUpload, FaCamera, FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const UploadSkinPhoto: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Cleanup stream khi component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url);
      navigate("skin-photo", {
        state: { file, url },
      });
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Sử dụng camera sau cho chụp ảnh da
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      setIsCameraOpen(true);

      // Đợi một chút để đảm bảo video element đã được render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(error => {
            console.error("Lỗi khi phát video:", error);
          });
        }
      }, 100);
    } catch (error) {
      console.error("Lỗi khi mở camera:", error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera và thử lại.");
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Đặt kích thước canvas theo video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Vẽ frame hiện tại từ video lên canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Chuyển canvas thành blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `skin-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            const url = URL.createObjectURL(file);

            // Đóng camera
            closeCamera();

            // Navigate với ảnh đã chụp
            navigate("skin-photo", {
              state: { file, url },
            });
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Camera Modal Component
  const CameraModal = () => (
    <div className="fixed inset-0 z-[9999] bg-white/10 backdrop-blur-md bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-pink-light/90 to-pink-light text-white">
          <button
            onClick={closeCamera}
            className="p-2 rounded-full bg-gradient-to-br from-pink-light/70 to-pink-light hover:scale-110 transition-colors"
          >
            <FaTimes size={16} color="white" />
          </button>
          <h2 className="text-base font-semibold"> Take a Photo</h2>
          <div className="w-8 h-8" /> {/* Spacer */}
        </div>

        {/* Video Container */}
        <div className="relative bg-white/10 aspect-square">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Overlay hướng dẫn */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-60 h-60 border-3 border-white rounded-full opacity-70 shadow-lg" />
          </div>

          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-primary-dark bg-opacity-70 text-white px-3 py-1 rounded-lg">
            <p className="text-xs text-center font-medium">Move camera to circle area</p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-white p-4 flex justify-center items-center">
          <button
            onClick={capturePhoto}
            className="bg-gradient-to-br from-pink-light/70 to-pink-light hover:scale-110 text-white p-4 rounded-full transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            <FaCamera size={20} />
          </button>
        </div>

        {/* Text hướng dẫn */}
        <div className="bg-gray-50 px-4 py-2 text-center">
          <p className="text-xs text-gray-600">Click the button to take a photo of your skin.</p>
        </div>
      </div>

      {/* Canvas ẩn để capture ảnh */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  if (isCameraOpen) {
    return createPortal(<CameraModal />, document.body);
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <div className={`flex justify-center items-center`}>
        <h1 className="text-3xl font-semibold text-pink-light my-10">Analyze Skin</h1>
      </div>
      <div className="flex-grow flex w-full justify-around items-center px-6 pb-28">
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

        <div
          className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105"
          onClick={openCamera}
        >
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