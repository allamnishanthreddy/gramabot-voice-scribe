
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VoiceControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (volume: number) => void;
}

const VoiceControls = ({ isPlaying, onTogglePlay, onSpeedChange, onVolumeChange }: VoiceControlsProps) => {
  const [speed, setSpeed] = useState([1]);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value);
    onSpeedChange(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
    onVolumeChange(value[0]);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume([80]);
      onVolumeChange(80);
    } else {
      setVolume([0]);
      onVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2 text-purple-800 dark:text-purple-300">
          <Volume2 className="w-5 h-5" />
          <span>Voice Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            onClick={onTogglePlay}
            className={`${
              isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMute}
            className="ml-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Speed: {speed[0]}x</label>
          <Slider
            value={speed}
            onValueChange={handleSpeedChange}
            max={2}
            min={0.5}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Volume: {volume[0]}%</label>
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceControls;
