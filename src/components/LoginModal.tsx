
import React from 'react';
import AuthModal from './AuthModal';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  return <AuthModal open={open} onClose={onClose} defaultTab="login" />;
};

export default LoginModal;
