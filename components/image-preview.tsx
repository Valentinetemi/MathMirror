'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
  onRemove: () => void;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="mb-4 relative inline-block">
      <div className="relative border border-border rounded-md overflow-hidden bg-white">
        <img
          src={preview}
          alt="Your uploaded work"
          className="max-h-48 max-w-xs object-cover"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-accent text-white rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
          title="Remove image"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {file?.name || 'Uploaded image'}
      </p>
    </div>
  );
}
