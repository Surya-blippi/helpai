import React, { useRef } from 'react';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg">
      <div className="mb-4">
        <label htmlFor="question" className="block text-gray-700 text-sm font-bold mb-2">
          Enter your math or science question:
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Or upload an image:
        </label>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
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
      {image && (
        <div className="mb-4">
          <p>Image selected: {image.name}</p>
        </div>
      )}
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