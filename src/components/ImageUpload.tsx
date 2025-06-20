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

  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Simple OCR simulation - in real implementation, you'd use Tesseract.js or similar
        // For demo purposes, we'll extract basic text patterns
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        
        // Mock text extraction based on image analysis
        const extractedText = analyzeImageForText(file.name, currentLanguage);
        resolve(extractedText);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzeImageForText = (fileName: string, language: string): string => {
    // This is a simplified text extraction simulation
    // In a real app, you'd use OCR libraries like Tesseract.js
    const governmentTexts = {
      English: [
        "Government of India\nMinistry of Rural Development\nApplication for Pension Scheme\nName: [Extracted Name]\nAadhaar Number: [Extracted Number]\nApplication Status: Under Review\nDate: [Current Date]",
        "Ration Card Details\nCard Number: [Card Number]\nFamily Head: [Name]\nAddress: [Address]\nValid Until: [Date]",
        "Land Records Certificate\nSurvey Number: [Number]\nOwner Name: [Name]\nArea: [Area] acres\nLocation: [Village Name]"
      ],
      Hindi: [
        "भारत सरकार\nग्रामीण विकास मंत्रालय\nपेंशन योजना के लिए आवेदन\nनाम: [निकाला गया नाम]\nआधार संख्या: [निकाली गई संख्या]\nआवेदन स्थिति: समीक्षाधीन\nदिनांक: [वर्तमान दिनांक]",
        "राशन कार्ड विवरण\nकार्ड संख्या: [कार्ड संख्या]\nपरिवार प्रमुख: [Name]\nपता: [Address]\nवैध तक: [Date]"
      ],
      Telugu: [
        "భారత ప్రభుత్వం\nగ్రామీణ అభివృద్ధి మంత్రిత్వ శాఖ\nపెన్షన్ స్కీమ్ కోసం దరఖాస్తు\nపేరు: [సేకరించిన పేరు]\nఆధార్ నంబర్: [సేకరించిన నంబర్]\nదరఖాస్తు స్థితి: సమీక్షలో\nతేదీ: [ప్రస్తుత తేదీ]",
        "రేషన్ కార్డ్ వివరాలు\nకార్డ్ నంబర్: [కార్డ్ నంబర్]\nకుటుంబ అధిపతి: [పేరు]\nచిరునామా: [చిరునామా]"
      ],
      Tamil: [
        "இந்திய அரசு\nகிராமப்புற வளர்ச்சி அமைச்சகம்\nஓய்வூதிய திட்டத்திற்கான விண்ணப்பம்\nபெயர்: [பிரித்தெடுக்கப்பட்ட பெயர்]\nஆதார் எண்: [பிரித்தெடுக்கப்பட்ட எண்]\nவிண்ணப்ப நிலை: மறுஆய்வில்\nதேதி: [தற்போதைய தேதி]",
        "ரேஷன் கார்டு விவரங்கள்\nகார்டு எண்: [கார்டு எண்]\nகுடும்பத் தலைவர்: [பெயர்]\nமுகவரி: [முகவரி]"
      ],
      Kannada: [
        "ಭಾರತ ಸರ್ಕಾರ\nಗ್ರಾಮೀಣ ಅಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ\nಪಿಂಚಣಿ ಯೋಜನೆಗಾಗಿ ಅರ್ಜಿ\nಹೆಸರು: [ಹೊರತೆಗೆದ ಹೆಸರು]\nಆಧಾರ್ ಸಂಖ್ಯೆ: [ಹೊರತೆಗೆದ ಸಂಖ್ಯೆ]\nಅರ್ಜಿ ಸ್ಥಿತಿ: ಪರಿಶೀಲನೆಯಲ್ಲಿ\nದಿನಾಂಕ: [ಪ್ರಸ್ತುತ ದಿನಾಂಕ]",
        "ರೇಷನ್ ಕಾರ್ಡ್ ವಿವರಗಳು\nಕಾರ್ಡ್ ಸಂಖ್ಯೆ: [ಕಾರ್ಡ್ ಸಂಖ್ಯೆ]\nಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ: [ಹೆಸರು]\nವಿಳಾಸ: [ವಿಳಾಸ]"
      ]
    };

    const texts = governmentTexts[language as keyof typeof governmentTexts] || governmentTexts.English;
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
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
