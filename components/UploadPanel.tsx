
import React, { useRef } from 'react';
import { UploadIcon, EditIcon } from './IconComponents';

interface UploadPanelProps {
  onImageUpload: (imageDataUrl: string) => void;
  image: string | null;
  onEditCrop: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onImageUpload, image, onEditCrop }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full flex flex-col shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">1. Upload Photo</h2>
      <div className="flex-grow flex flex-col items-center justify-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {image ? (
          <div className="w-full aspect-square rounded-lg overflow-hidden relative group">
            <img src={image} alt="Uploaded preview" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={onEditCrop} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  <EditIcon className="w-5 h-5" />
                  Edit Crop
               </button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="w-full aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:border-indigo-500 cursor-pointer transition-colors"
          >
            <UploadIcon className="w-12 h-12 mb-2" />
            <span className="font-medium">Click to upload</span>
            <span className="text-sm">PNG, JPG, or WEBP</span>
          </div>
        )}
      </div>
      {image && <p className="text-xs text-gray-400 mt-4 text-center">Your photo is ready. Choose a style and generate!</p>}
    </div>
  );
};
