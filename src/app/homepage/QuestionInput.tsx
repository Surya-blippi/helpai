import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage, onSubmit }) => {
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
    <form onSubmit={onSubmit} className="w-full max-w-lg">
      <div className="mb-4 relative">
        <label htmlFor="input" className="block text-gray-700 text-sm font-bold mb-2">
          Enter your math or science question or upload an image:
        </label>
        <div className="border rounded w-full p-2 min-h-[100px] relative">
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
          ) : image || previewUrl ? (
            <div className="relative">
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
            <textarea
              id="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-full resize-none focus:outline-none"
              placeholder="Type your question here..."
            />
          )}
        </div>
      </div>
      <div className="mb-4 flex space-x-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Take Photo
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Question
        </button>
      </div>
    </form>
  );
};

export default QuestionInput;