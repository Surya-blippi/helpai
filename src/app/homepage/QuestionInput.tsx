import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setQuestion('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPreviewUrl(imageSrc);
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            setImage(file);
            setQuestion('');
          });
        setShowCamera(false);
      }
    }
  }, [webcamRef, setImage, setQuestion]);

  const clearInput = () => {
    setQuestion('');
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="relative w-full">
      {showCamera ? (
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />
          <button
            type="button"
            onClick={handleCameraCapture}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Capture
          </button>
        </div>
      ) : (
        <div className="border rounded-lg p-2 flex items-center">
          {image || previewUrl ? (
            <div className="relative w-full">
              <Image 
                src={previewUrl!} 
                alt="Uploaded question" 
                width={300} 
                height={200} 
                layout="responsive" 
                objectFit="contain"
              />
              <button
                type="button"
                onClick={clearInput}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow focus:outline-none"
                placeholder="Type your question here..."
              />
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <CameraIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <PhotoIcon className="h-6 w-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionInput;