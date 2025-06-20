
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from './AuthProvider';
import { useLanguage } from './LanguageProvider';
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Demo authentication - accept demo credentials or any email/password
      if ((email === 'demo@gramabot.com' && password === 'demo123') || 
          (email && password && email.includes('@'))) {
        const success = await login(email, password);
        if (success) {
          toast.success("Login successful!");
          onClose();
          setEmail('');
          setPassword('');
        } else {
          setError('Login failed. Please try again.');
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        setError('Please enter valid email and password');
        toast.error("Invalid credentials. Use demo@gramabot.com / demo123 for demo.");
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      toast.error("An error occurred during login.");
      console.error('Login error:', err);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('nav.login')}</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rural.citizen@example.com"
              required
              disabled={loading}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              className="mt-1"
            />
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <p className="font-medium">Demo credentials:</p>
            <p>Email: demo@gramabot.com</p>
            <p>Password: demo123</p>
            <p className="text-xs mt-1 italic">Or use any valid email format with any password</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : t('nav.login')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
