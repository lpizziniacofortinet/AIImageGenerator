import React, { useState, useMemo } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { GalleryPanel } from './components/GalleryPanel';
import { StylePanel } from './components/StylePanel';
import { CropperModal } from './components/CropperModal';
import { generateProfilePictures } from './services/geminiService';
import { Style, AspectRatio } from './types';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setIsCropperOpen(true);
  };

  const handleCropComplete = (image: string, newAspectRatio: AspectRatio) => {
    setCroppedImage(image);
    setAspectRatio(newAspectRatio);
    setIsCropperOpen(false);
  };

  const handleGenerate = async () => {
    if (!croppedImage || !selectedStyle) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateProfilePictures(
        croppedImage,
        selectedStyle,
        aspectRatio
      );
      setGeneratedImages(images);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setSelectedStyle(null);
    setGeneratedImages([]);
    setIsLoading(false);
    setError(null);
    setIsCropperOpen(false);
    setAspectRatio('1:1');
  };
  
  const isGenerateDisabled = useMemo(() => {
    if (isLoading || !croppedImage || !selectedStyle) return true;
    return false;
  }, [isLoading, croppedImage, selectedStyle]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
          <UploadPanel
            onImageUpload={handleImageUpload}
            image={croppedImage}
            onEditCrop={() => setIsCropperOpen(true)}
            onReset={handleReset}
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-3/5 flex-grow">
          <GalleryPanel
            images={generatedImages}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
          <StylePanel
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            onGenerate={handleGenerate}
            isGenerateDisabled={isGenerateDisabled}
            isLoading={isLoading}
          />
        </div>
      </main>
      {isCropperOpen && uploadedImage && (
        <CropperModal
          imageSrc={uploadedImage}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default App;