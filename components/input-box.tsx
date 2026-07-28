'use client'

import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'

interface InputBoxProps {
  onSubmit: (data: { text?: string; image?: File }) => void
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export default function InputBox({ onSubmit, value, onChange, isLoading = false }: InputBoxProps) {
  const [isEmpty, setIsEmpty] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsEmpty(newValue.trim().length === 0 && !uploadedImage)
  }

  const handleSubmit = () => {
    if ((value.trim() || uploadedImage) && !isLoading) {
      onSubmit({
        text: value.trim() || undefined,
        image: uploadedImage || undefined,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (!e.nativeEvent.isComposing) {
        e.preventDefault()
        handleSubmit()
      }
    }
  }

  const handleFileSelect = (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image')
      return
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadedImage(file)
    setIsEmpty(false)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setIsMenuOpen(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    setIsEmpty(value.trim().length === 0)
  }

  return (
    <div className="space-y-4">
      {imagePreview && (
        <div className="relative inline-block mb-2 animate-slideIn">
          <div className="premium-card relative overflow-hidden shadow-md">
            <img
              src={imagePreview}
              alt="Your uploaded work"
              className="max-h-48 max-w-xs object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-accent text-white rounded-full hover:bg-accent/80 transition-smooth shadow-md"
              title="Remove image"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{uploadedImage?.name}</p>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Show me where you got stuck — I'll figure out why"
            className="premium-input notebook-input w-full p-4 resize-none h-32 focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-secondary/10 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload photo or take a picture of your work"
            aria-label="Upload photo or take a picture of your work"
          >
            <Camera className="w-5 h-5" strokeWidth={2} />
          </button>

          {isMenuOpen && (
            <div className="premium-card absolute top-full right-0 mt-2 w-48 z-50 shadow-lg animate-slideIn">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-background-secondary transition-smooth border-b border-border flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photo
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-background-secondary transition-smooth flex items-center gap-2 font-medium"
              >
                <Camera className="w-4 h-4 text-secondary" strokeWidth={2} />
                Take Picture
              </button>
            </div>
          )}

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
      </div>

      <button
        onClick={handleSubmit}
        disabled={isEmpty || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-smooth transform ${
          isEmpty || isLoading
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'button-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
            Reading your work...
          </span>
        ) : (
          'Check My Work'
        )}
      </button>
    </div>
  )
}
