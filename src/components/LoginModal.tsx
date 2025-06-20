
import React from 'react';
import AuthModal from './AuthModal';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

const LoginModal = ({ open, onClose, onAuthSuccess }: LoginModalProps) => {
  return (
    <AuthModal 
      open={open} 
      onClose={onClose} 
      defaultTab="login" 
      onAuthSuccess={onAuthSuccess}
    />
  );
};

export default LoginModal;
