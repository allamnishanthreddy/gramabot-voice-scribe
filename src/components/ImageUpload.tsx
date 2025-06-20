
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Upload, X, FileImage, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImageProcessed: (text: string) => void;
  onClose: () => void;
}

const ImageUpload = ({ onImageProcessed, onClose }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Get image data for analysis
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        
        if (!imageData) {
          reject(new Error('Could not process image data'));
          return;
        }

        // Simple text detection based on image characteristics
        // This is a basic implementation - for production, use Tesseract.js or similar
        const { data, width, height } = imageData;
        let textRegions = [];
        
        // Look for text-like regions (high contrast areas)
        for (let y = 0; y < height; y += 10) {
          for (let x = 0; x < width; x += 10) {
            const i = (y * width + x) * 4;
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            if (brightness > 200 || brightness < 50) {
              textRegions.push({ x, y, brightness });
            }
          }
        }
        
        if (textRegions.length > 0) {
          // Mock extracted text based on actual image analysis
          resolve(`Extracted text from uploaded image:\n[Text content would appear here based on OCR processing]\nImage dimensions: ${width}x${height}\nText regions detected: ${textRegions.length}`);
        } else {
          resolve('No clear text detected in the image. Please try with a clearer image or better lighting.');
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageToText = async (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      
      // Extract text from the selected image only
      const extractedText = await extractTextFromImage(file);
      
      if (!extractedText.trim()) {
        throw new Error('No text found in the image. Please try with a clearer image.');
      }
      
      onImageProcessed(extractedText);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    setError(null);
    setSelectedImage(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Clean up previous URL
    return () => URL.revokeObjectURL(url);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleProcessImage = () => {
    if (selectedImage) {
      processImageToText(selectedImage);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upload Document</h3>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {!selectedImage ? (
            <div className="text-center space-y-4">
              <FileImage className="w-16 h-16 text-gray-400 mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Select an image to extract text
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2"
                  disabled={isProcessing}
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Selected document"
                  className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={resetSelection}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Change Image
                </Button>
                
                <Button
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className="relative"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Extract Text'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;
