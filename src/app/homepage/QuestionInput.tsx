import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  setInputType: (type: 'text' | 'image') => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage, setInputType }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('QuestionInput useEffect triggered');
    try {
      if (image) {
        setPreviewUrl(URL.createObjectURL(image));
        setInputType('image');
      } else if (question) {
        setInputType('text');
      } else {
        setPreviewUrl(null);
        setInputType('text');
      }
    } catch (err) {
      console.error('Error in QuestionInput useEffect:', err);
      setError('An error occurred while processing the input');
    }
  }, [image, question, setInputType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setQuestion('');
    }
  };

  const handleCameraCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative w-full">
      {showCamera ? (
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg"
          />
          <button
            type="button"
            onClick={handleCameraCapture}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
          >
            Capture
          </button>
        </div>
      ) : (
        <div className="border-2 border-gray-300 rounded-lg p-4 min-h-[200px] flex flex-col">
          {previewUrl ? (
            <div className="relative w-full h-[200px]">
              <Image 
                src={previewUrl}
                alt="Uploaded question"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={clearInput}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow focus:outline-none bg-transparent text-lg resize-none"
                placeholder="Type your question here..."
                rows={5}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  <CameraIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700"
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
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionInput;