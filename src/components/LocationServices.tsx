
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Phone, Clock, Star, Navigation } from "lucide-react";
import OfficeDetailsModal from "./OfficeDetailsModal";
import { useLanguage } from "./LanguageProvider";

const LocationServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { t } = useLanguage();

  const telanganaCities = ['all', 'Warangal', 'Hyderabad', 'Karimnagar', 'Nizamabad', 'Khammam', 'Mahbubnagar'];

  const locations = [
    {
      id: 1,
      name: "District Collector Office",
      address: "Main Road, Warangal, Telangana - 506002",
      phone: "+91-870-2421234",
      email: "collector.warangal@telangana.gov.in",
      services: ["Pension", "Land Records", "Revenue Services"],
      hours: "9:00 AM - 5:00 PM",
      rating: 4.2,
      distance: "2.3 km",
      city: "Warangal",
      coordinates: { lat: 17.9689, lng: 79.5941 }
    },
    {
      id: 2,
      name: "Tehsil Office Warangal",
      address: "Kazipet Road, Warangal, Telangana - 506003",
      phone: "+91-870-2445678",
      email: "tehsil.warangal@telangana.gov.in",
      services: ["Ration Card", "Income Certificate", "Caste Certificate"],
      hours: "10:00 AM - 4:00 PM",
      rating: 3.8,
      distance: "1.8 km",
      city: "Warangal",
      coordinates: { lat: 17.9784, lng: 79.6008 }
    },
    {
      id: 3,
      name: "Primary Health Center",
      address: "Hospital Road, Warangal, Telangana - 506001",
      phone: "+91-870-2467890",
      email: "phc.warangal@telangana.gov.in",
      services: ["Health Schemes", "Medical Certificates", "Vaccination"],
      hours: "8:00 AM - 6:00 PM",
      rating: 4.5,
      distance: "3.1 km",
      city: "Warangal",
      coordinates: { lat: 17.9756, lng: 79.5969 }
    },
    {
      id: 4,
      name: "GHMC Office",
      address: "Tank Bund Road, Hyderabad, Telangana - 500001",
      phone: "+91-40-23234567",
      email: "ghmc.hyderabad@telangana.gov.in",
      services: ["Property Tax", "Building Permits", "Water Connection"],
      hours: "9:30 AM - 5:30 PM",
      rating: 4.1,
      distance: "5.2 km",
      city: "Hyderabad",
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    {
      id: 5,
      name: "Karimnagar Collectorate",
      address: "Collectorate Road, Karimnagar, Telangana - 505001",
      phone: "+91-878-2228899",
      email: "collector.karimnagar@telangana.gov.in",
      services: ["Land Registration", "Passport Services", "Revenue Records"],
      hours: "9:00 AM - 5:00 PM",
      rating: 4.0,
      distance: "1.5 km",
      city: "Karimnagar",
      coordinates: { lat: 18.4386, lng: 79.1288 }
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'all' || location.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const openDirections = (coordinates: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleCallOffice = (office: any) => {
    setSelectedOffice(office);
    setShowDetailsModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center flex items-center justify-center space-x-3">
            <MapPin className="h-8 w-8" />
            <span>Government Office Locator - Telangana</span>
          </CardTitle>
          <p className="text-green-100 text-center text-lg">
            Find nearby government offices and service centers in Telangana
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {telanganaCities.map(city => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className="capitalize"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations Grid */}
      <div className="grid gap-6">
        {filteredLocations.map(location => (
          <Card key={location.id} className="hover:shadow-xl transition-all bg-white dark:bg-gray-800 border-2 hover:border-green-300 dark:hover:border-green-600">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full mt-1">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{location.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{location.address}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{location.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map(service => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{location.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>{location.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:items-end">
                  <Button 
                    size="sm" 
                    onClick={() => openDirections(location.coordinates)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full lg:w-auto"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {t('common.getDirections')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCallOffice(location)}
                    className="w-full lg:w-auto"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {t('common.callOffice')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredLocations.length}+</div>
            <div className="text-sm text-green-700 dark:text-green-300">Government Offices in Telangana</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Emergency Services</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.1</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      <OfficeDetailsModal 
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        office={selectedOffice}
      />
    </div>
  );
};

export default LocationServices;
