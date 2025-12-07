import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string) => void;
  selectedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  return (
    <div className="w-full">
      <div className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${selectedImage 
          ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700' 
          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
        }
      `}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {selectedImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={selectedImage} 
              alt="Selected Product" 
              className="max-h-64 rounded-lg shadow-md object-contain mb-4 bg-white dark:bg-slate-800/50" 
            />
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">Click or Drop to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-slate-400 dark:text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 1 5.25 21h13.5A2.25 2.25 0 0 1 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Upload Product Image</p>
            <p className="text-sm mt-1">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;