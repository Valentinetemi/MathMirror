'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadButtonProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadButton({
  onImageSelected,
  disabled = false,
}: ImageUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    onImageSelected(file);
    setIsOpen(false);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="relative">
      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 bg-secondary hover:bg-muted border border-border disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload photo or take a picture of your work"
        aria-label="Upload photo or take a picture of your work"
      >
        <Camera className="w-5 h-5 text-accent" strokeWidth={2} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-md shadow-lg z-50">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors border-b border-border flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-accent" strokeWidth={2} />
            Upload Photo
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-accent" strokeWidth={2} />
            Take Picture
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInputChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
