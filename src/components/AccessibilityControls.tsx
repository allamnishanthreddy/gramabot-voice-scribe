
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Accessibility, Eye, Type, Contrast } from "lucide-react";

const AccessibilityControls = () => {
  const [fontSize, setFontSize] = useState([16]);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    document.documentElement.style.fontSize = `${value[0]}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2 text-indigo-800 dark:text-indigo-300">
          <Accessibility className="w-5 h-5" />
          <span>Accessibility</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 block">
            <Type className="w-4 h-4 inline mr-1" />
            Font Size: {fontSize[0]}px
          </label>
          <Slider
            value={fontSize}
            onValueChange={handleFontSizeChange}
            max={24}
            min={12}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex items-center">
            <Contrast className="w-4 h-4 mr-1" />
            High Contrast
          </label>
          <Switch
            checked={highContrast}
            onCheckedChange={toggleHighContrast}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Screen Reader
          </label>
          <Switch
            checked={screenReader}
            onCheckedChange={setScreenReader}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Reduced Motion
          </label>
          <Switch
            checked={reducedMotion}
            onCheckedChange={setReducedMotion}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityControls;
