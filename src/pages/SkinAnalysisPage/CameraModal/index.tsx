import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCamera } from 'react-icons/fa';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, url: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      openCamera();
    } else {
      closeCamera();
    }

    // Cleanup when component unmounts
    return () => {
      closeCamera();
    };
  }, [isOpen]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Sử dụng camera sau cho chụp ảnh da
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      streamRef.current = mediaStream;

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
      onClose();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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
            onClose();

            // Gọi callback với file và URL
            onCapture(file, url);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleClose = () => {
    closeCamera();
    onClose();
  };

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-pink-light/50 to-pink-light/60 text-white">
          <div className="w-8 h-8" /> {/* Spacer */}
          <h2 className="text-base font-semibold">Take a Photo</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/50 cursor-pointer hover:scale-115 transition-all duration-300 text-primary-dark bg-opacity-20 hover:bg-opacity-30"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-gray-100 aspect-square">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Overlay hướng dẫn */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 border-4 border-white rounded-full opacity-70 shadow-lg" />
          </div>

          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
            <p className="text-xs text-center font-medium">Position your face in the circle</p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-white p-4 flex justify-center items-center">
          <button
            onClick={capturePhoto}
            className="bg-gradient-to-br from-pink-light/50 to-pink-light/60 hover:from-pink-light/60 hover:to-pink-light/70 text-white p-4 rounded-full transition-all duration-200 shadow-lg transform hover:scale-105"
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
    </div>,
    document.body
  );
};

export default CameraModal;