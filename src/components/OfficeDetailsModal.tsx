
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";

interface Office {
  name: string;
  address: string;
  phone: string;
  email?: string;
  hours: string;
  rating: number;
}

interface OfficeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  office: Office | null;
}

const OfficeDetailsModal = ({ open, onClose, office }: OfficeDetailsModalProps) => {
  if (!office) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Office Details</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{office.name}</h3>
            <p className="text-gray-600 text-sm">{office.address}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{office.phone}</span>
            </div>
            
            {office.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-sm">{office.email}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm">{office.hours}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">{office.rating} / 5.0</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={() => window.open(`tel:${office.phone}`, '_blank')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            {office.email && (
              <Button 
                variant="outline"
                onClick={() => window.open(`mailto:${office.email}`, '_blank')}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeDetailsModal;
