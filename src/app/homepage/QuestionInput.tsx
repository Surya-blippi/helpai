import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setQuestion('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Here you would typically open a modal or overlay with the camera stream
        // and allow the user to capture an image. For simplicity, we'll just log the stream.
        console.log('Camera stream:', stream);
        // Don't forget to stop the stream when done
        stream.getTracks().forEach(track => track.stop());
        // For demonstration, let's pretend we captured an image
        const mockFile = new File([""], "camera_capture.jpg", { type: "image/jpeg" });
        setImage(mockFile);
        setQuestion('');
        setPreviewUrl(URL.createObjectURL(mockFile));
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

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
          {image ? (
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
          onClick={handleCameraCapture}
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