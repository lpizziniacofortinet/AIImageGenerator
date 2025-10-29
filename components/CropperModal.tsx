
import React, { useState, useMemo } from 'react';
import { AspectRatio } from '../types';
import { CropIcon } from './IconComponents';

interface CropperModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (image: string, aspectRatio: AspectRatio) => void;
}

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
];

export const CropperModal: React.FC<CropperModalProps> = ({ imageSrc, onClose, onCropComplete }) => {
  const [activeAspectRatio, setActiveAspectRatio] = useState<AspectRatio>('1:1');
  
  const aspectClass = useMemo(() => {
    switch(activeAspectRatio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      default: return 'aspect-square';
    }
  }, [activeAspectRatio]);

  const handleConfirm = () => {
    onCropComplete(imageSrc, activeAspectRatio);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CropIcon className="w-6 h-6 text-indigo-400" />
            Set Aspect Ratio
           </h2>
           <p className="text-gray-400 text-sm mt-1">Choose the desired shape for your generated photos.</p>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-2/3">
                <div className={`mx-auto w-full max-w-md ${aspectClass} bg-black rounded-lg overflow-hidden ring-2 ring-indigo-500`}>
                    <img src={imageSrc} alt="Crop preview" className="w-full h-full object-cover"/>
                </div>
            </div>
            <div className="w-full md:w-1/3">
                 <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-300">Aspect Ratios:</p>
                    {aspectRatios.map(({label, value}) => (
                         <button
                            key={value}
                            onClick={() => setActiveAspectRatio(value)}
                            className={`w-full text-center px-4 py-2 border-2 rounded-md transition-colors ${
                                activeAspectRatio === value
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                            }`}
                         >
                            {label}
                         </button>
                    ))}
                 </div>
            </div>
        </div>

        <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end gap-4 rounded-b-xl">
           <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium">Cancel</button>
           <button onClick={handleConfirm} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-bold">Confirm</button>
        </div>
      </div>
    </div>
  );
};
