import React from 'react';

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  setInputType: (type: 'text' | 'image') => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  setQuestion,
  image,
  setImage,
  setInputType
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    setInputType('text');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setInputType('image');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          Enter your question
        </label>
        <textarea
          id="question"
          name="question"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Type your math or science question here"
          value={question}
          onChange={handleTextChange}
        />
      </div>
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
          Or upload an image
        </label>
        <input
          id="image-upload"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>
      {image && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Selected image: {image.name}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionInput;