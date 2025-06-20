
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "919059597465"; // WhatsApp number with country code
  const message = "Hey! I'm GramaBot. How can I help you with government services today?";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-xl animate-bounce"
      size="icon"
    >
      <MessageCircle className="h-8 w-8 text-white" />
    </Button>
  );
};

export default WhatsAppButton;
