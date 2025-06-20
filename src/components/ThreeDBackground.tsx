
import React, { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const ThreeDBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      type: 'code' | 'ai' | 'govt' | 'rural';
      symbol: string;
    }> = [];

    // Create particles representing hackathon themes
    const symbols = {
      code: ['</>', '{ }', 'AI', 'ML', 'API'],
      ai: ['🤖', '🧠', '💡', '⚡', '🔥'],
      govt: ['🏛️', '📋', '💳', '🏥', '🎓'],
      rural: ['🌾', '👨‍🌾', '🏘️', '📱', '🌍']
    };

    for (let i = 0; i < 60; i++) {
      const types = ['code', 'ai', 'govt', 'rural'] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      const symbolArray = symbols[type];
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 6 + 3,
        color: theme === 'dark' 
          ? ['#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)]
          : ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed'][Math.floor(Math.random() * 5)],
        type,
        symbol: symbolArray[Math.floor(Math.random() * symbolArray.length)]
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dynamic gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(17, 24, 39, 0.9)');
        gradient.addColorStop(0.5, 'rgba(31, 41, 55, 0.7)');
        gradient.addColorStop(1, 'rgba(55, 65, 81, 0.5)');
      } else {
        gradient.addColorStop(0, 'rgba(254, 249, 195, 0.4)');
        gradient.addColorStop(0.5, 'rgba(220, 252, 231, 0.3)');
        gradient.addColorStop(1, 'rgba(239, 246, 255, 0.2)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Wrap around screen
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;

        // Calculate depth-based properties
        const depth = particle.z / 1000;
        const size = particle.size * (1 - depth * 0.6);
        const opacity = (1 - depth * 0.8) * 0.8;

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = opacity;
        
        if (particle.type === 'code') {
          // Draw code symbols
          ctx.fillStyle = particle.color;
          ctx.font = `bold ${size * 2}px 'Courier New', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(particle.symbol, particle.x, particle.y);
        } else if (particle.symbol.length === 1 && /[\u{1F300}-\u{1F9FF}]/u.test(particle.symbol)) {
          // Draw emoji symbols
          ctx.font = `${size * 1.5}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(particle.symbol, particle.x, particle.y);
        } else {
          // Draw text symbols
          ctx.fillStyle = particle.color;
          ctx.font = `bold ${size * 1.2}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(particle.symbol, particle.x, particle.y);
        }

        ctx.restore();
      });

      // Draw connecting lines between nearby particles (digital network effect)
      ctx.strokeStyle = theme === 'dark' ? 'rgba(156, 163, 175, 0.15)' : 'rgba(107, 114, 128, 0.15)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.globalAlpha = (120 - distance) / 120 * 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Add floating hackathon theme words
      const time = Date.now() * 0.002;
      const hackathonTerms = ['Innovation', 'Technology', 'Rural Empowerment', 'Digital India', 'AI for Good', 'Smart Governance'];
      
      hackathonTerms.forEach((term, index) => {
        const x = canvas.width * 0.1 + (canvas.width * 0.8 * ((index + 1) / (hackathonTerms.length + 1)));
        const y = canvas.height * 0.5 + Math.sin(time + index * 0.5) * 30;
        
        ctx.globalAlpha = 0.2;
        ctx.font = 'bold 1.2rem "Inter", sans-serif';
        ctx.fillStyle = theme === 'dark' ? '#e5e7eb' : '#374151';
        ctx.textAlign = 'center';
        ctx.fillText(term, x, y);
      });

      // Add pulsing circles for emphasis
      const pulseTime = time * 2;
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.2 + i * 0.3);
        const y = canvas.height * 0.3;
        const radius = 30 + Math.sin(pulseTime + i) * 10;
        
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = theme === 'dark' ? '#60a5fa' : '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default ThreeDBackground;
