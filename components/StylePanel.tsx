import React from 'react';
import { Style } from '../types';
import { SparklesIcon } from './IconComponents';

interface StylePanelProps {
  selectedStyle: Style | null;
  onStyleSelect: (style: Style) => void;
  onGenerate: () => void;
  isGenerateDisabled: boolean;
  isLoading: boolean;
}

const StyleButton: React.FC<{
  style: Style;
  isSelected: boolean;
  onClick: (style: Style) => void;
  label: string;
  description: string;
}> = ({ style, isSelected, onClick, label, description }) => {
  return (
    <button
      onClick={() => onClick(style)}
      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500 shadow-lg'
          : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500/50'
      }`}
    >
      <h3 className="font-bold text-white">{label}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </button>
  );
};


export const StylePanel: React.FC<StylePanelProps> = ({
  selectedStyle,
  onStyleSelect,
  onGenerate,
  isGenerateDisabled,
  isLoading
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full flex flex-col justify-between shadow-lg">
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">2. Choose a Style</h2>
        <div className="space-y-3">
          <StyleButton
            style={Style.PRO}
            isSelected={selectedStyle === Style.PRO}
            onClick={onStyleSelect}
            label="Pro"
            description="Corporate headshots for LinkedIn, etc."
          />
          <StyleButton
            style={Style.CASUAL}
            isSelected={selectedStyle === Style.CASUAL}
            onClick={onStyleSelect}
            label="Casual"
            description="Friendly, relaxed photos for social media."
          />
          <StyleButton
            style={Style.BEACH}
            isSelected={selectedStyle === Style.BEACH}
            onClick={onStyleSelect}
            label="Beach"
            description="Relaxed on a Ligurian beach at sunset."
          />
          <StyleButton
            style={Style.ANIME}
            isSelected={selectedStyle === Style.ANIME}
            onClick={onStyleSelect}
            label="Anime"
            description="Dark fantasy art in Kentaro Miura's style."
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};