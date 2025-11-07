
import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  title: string;
  id: string;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, title, id }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const onButtonClick = () => {
      fileInputRef.current?.click();
  }

  const baseClasses = "relative flex flex-col items-center justify-center w-full h-64 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors duration-300";
  const draggingClasses = "border-amber-500 bg-amber-50";

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`${baseClasses} ${isDragging ? draggingClasses : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="object-cover h-full w-full rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadIcon />
            <p className="mb-2 text-sm text-stone-500"><span className="font-semibold">{title}</span></p>
            <p className="text-xs text-stone-500">Drag & drop or click to upload</p>
          </div>
        )}
        <input ref={fileInputRef} id={id} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
      </label>
       {preview && (
        <button onClick={onButtonClick} className="mt-2 w-full text-sm text-amber-700 hover:text-amber-900 font-medium">Change Image</button>
      )}
    </div>
  );
};
