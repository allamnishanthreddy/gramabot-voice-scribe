
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Upload, X, FileImage, Loader2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

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
  const { currentLanguage } = useLanguage();

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
      
      // Simulate OCR processing with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock text extraction based on language
      const mockTexts = {
        English: "Application for Pension Scheme\nName: John Doe\nAadhaar: 1234-5678-9012\nAge: 65 years\nStatus: Pending Review",
        Hindi: "पेंशन योजना के लिए आवेदन\nनाम: जॉन डो\nआधार: 1234-5678-9012\nआयु: 65 वर्ष\nस्थिति: समीक्षाधीन",
        Telugu: "పెన్షన్ స్కీమ్ కోసం దరఖాస్తు\nపేరు: జాన్ డో\nఆధార్: 1234-5678-9012\nవయస్సు: 65 సంవత్సరాలు\nస్థితి: సమీక్షలో ఉంది",
        Tamil: "ஓய்வூதிய திட்டத்திற்கான விண்ணப்பம்\nபெயர்: ஜான் டோ\nஆதார்: 1234-5678-9012\nவயது: 65 வருடங்கள்\nநிலை: மறுஆய்வில் உள்ளது",
        Kannada: "ಪಿಂಚಣಿ ಯೋಜನೆಗಾಗಿ ಅರ್ಜಿ\nಹೆಸರು: ಜಾನ್ ಡೋ\nಆಧಾರ್: 1234-5678-9012\nವಯಸ್ಸು: 65 ವರ್ಷಗಳು\nಸ್ಥಿತಿ: ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ"
      };

      const extractedText = mockTexts[currentLanguage as keyof typeof mockTexts] || mockTexts.English;
      
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
                Select an image to extract text from government documents
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
