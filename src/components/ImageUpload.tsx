
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, FileImage } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface ImageUploadProps {
  onImageProcessed: (text: string) => void;
  onClose: () => void;
}

const ImageUpload = ({ onImageProcessed, onClose }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { currentLanguage } = useLanguage();

  const processImageToText = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock text extraction based on language
    const mockTexts = {
      English: "Application for Pension Scheme\nName: John Doe\nAadhaar: 1234-5678-9012\nAge: 65 years\nStatus: Pending Review",
      Hindi: "पेंशन योजना के लिए आवेदन\nनाम: जॉन डो\nआधार: 1234-5678-9012\nआयु: 65 वर्ष\nस्थिति: समीक्षाधीन",
      Telugu: "పెన్షన్ స్కీమ్ కోసం దరఖాస్తు\nపేరు: జాన్ డో\nఆధార్: 1234-5678-9012\nవయస్సు: 65 సంవత్సరాలు\nస్థితి: సమీక్షలో ఉంది",
      Tamil: "ஓய்வூதிய திட்டத்திற்கான விண்ணப்பம்\nபெயர்: ஜான் டோ\nஆதார்: 1234-5678-9012\nவயது: 65 வருடங்கள்\nநிலை: மறுஆய்வில் உள்ளது",
      Kannada: "ಪಿಂಚಣಿ ಯೋಜನೆಗಾಗಿ ಅರ್ಜಿ\nಹೆಸರು: ಜಾನ್ ಡೋ\nಆಧಾರ್: 1234-5678-9012\nವಯಸ್ಸು: 65 ವರ್ಷಗಳು\nಸ್ಥಿತಿ: ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ"
    };

    const extractedText = mockTexts[currentLanguage as keyof typeof mockTexts];
    
    onImageProcessed(extractedText);
    setIsProcessing(false);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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

  return (
    <Card className="fixed inset-4 z-50 bg-white dark:bg-gray-800 shadow-2xl">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Government Document</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!selectedImage ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <FileImage className="w-16 h-16 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Select an image to extract text from government documents
            </p>
            
            <div className="flex gap-4">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
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
          <div className="flex-1 flex flex-col">
            <div className="flex-1 mb-4">
              <img
                src={previewUrl!}
                alt="Selected document"
                className="w-full h-full object-contain rounded-lg border"
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Select Different Image
              </Button>
              
              <Button
                onClick={handleProcessImage}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
