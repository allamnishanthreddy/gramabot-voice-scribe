
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
      type: 'data' | 'connection' | 'govt';
    }> = [];

    // Create particles representing digital governance
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: theme === 'dark' 
          ? ['#60a5fa', '#34d399', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
          : ['#2563eb', '#059669', '#d97706', '#dc2626'][Math.floor(Math.random() * 4)],
        type: ['data', 'connection', 'govt'][Math.floor(Math.random() * 3)] as 'data' | 'connection' | 'govt'
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(17, 24, 39, 0.8)');
        gradient.addColorStop(0.5, 'rgba(31, 41, 55, 0.6)');
        gradient.addColorStop(1, 'rgba(55, 65, 81, 0.4)');
      } else {
        gradient.addColorStop(0, 'rgba(254, 249, 195, 0.3)');
        gradient.addColorStop(0.5, 'rgba(220, 252, 231, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 246, 255, 0.1)');
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
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;

        // Calculate depth-based properties
        const depth = particle.z / 1000;
        const size = particle.size * (1 - depth * 0.5);
        const opacity = 1 - depth * 0.7;

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;

        if (particle.type === 'data') {
          // Draw data nodes as circles
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'connection') {
          // Draw connections as lines
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = size / 2;
          ctx.beginPath();
          ctx.moveTo(particle.x - size * 2, particle.y);
          ctx.lineTo(particle.x + size * 2, particle.y);
          ctx.stroke();
        } else if (particle.type === 'govt') {
          // Draw government symbols as squares
          ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
        }

        ctx.restore();
      });

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Add floating government service icons
      const time = Date.now() * 0.001;
      const icons = ['🏛️', '📋', '💳', '🏥', '🎓', '🌾'];
      
      icons.forEach((icon, index) => {
        const x = canvas.width * 0.1 + (canvas.width * 0.8 * ((index + 1) / (icons.length + 1)));
        const y = canvas.height * 0.5 + Math.sin(time + index) * 50;
        
        ctx.globalAlpha = 0.3;
        ctx.font = '2rem serif';
        ctx.fillStyle = theme === 'dark' ? '#e5e7eb' : '#374151';
        ctx.textAlign = 'center';
        ctx.fillText(icon, x, y);
      });

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
