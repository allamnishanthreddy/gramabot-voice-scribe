
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import LoginModal from "@/components/LoginModal";

const Index = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to GramaBot</h1>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">Welcome back!</p>
              <p className="text-green-600">{user?.name}</p>
              <p className="text-green-600 text-sm">{user?.email}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Please log in to access your account and start using GramaBot.
            </p>
            <Button 
              onClick={handleLoginClick}
              className="w-full"
            >
              Login / Register
            </Button>
          </div>
        )}
      </div>

      <LoginModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default Index;
