import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  setInputType: (type: 'text' | 'image') => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, setQuestion, image, setImage, setInputType }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setPreviewUrl(URL.createObjectURL(image));
      setInputType('image');
    } else {
      setPreviewUrl(null);
      setInputType('text');
    }
  }, [image, setInputType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setQuestion('');
    }
  };

  const clearInput = () => {
    setQuestion('');
    setImage(null);
    setPreviewUrl(null);
    setInputType('text');
  };

  return (
    <div className="relative w-full">
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
              onChange={(e) => {
                setQuestion(e.target.value);
                setInputType('text');
              }}
              className="flex-grow focus:outline-none bg-transparent text-lg resize-none"
              placeholder="Type your question here..."
              rows={5}
            />
            <div className="flex justify-end mt-2">
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
    </div>
  );
};

export default QuestionInput;