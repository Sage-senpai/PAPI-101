//src/components/MagicBackground.tsx
import React, { useEffect, useRef } from 'react';

export const MagicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Particle system for magic effect
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      type: 'sparkle' | 'wave' | 'orb';
    }> = [];

    const colors = [
      'rgba(138, 43, 226, 0.7)', // Magic purple
      'rgba(0, 212, 255, 0.7)', // Sparkle blue
      'rgba(16, 185, 129, 0.7)', // Success emerald
      'rgba(245, 158, 11, 0.7)', // Warning amber
    ];

    // Create initial particles
    const createParticles = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: Math.random() * 0.5 + 0.5,
          type: ['sparkle', 'wave', 'orb'][Math.floor(Math.random() * 3)] as any,
        });
      }
    };

    createParticles(50);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating hex bytes in background
      ctx.font = '14px "Courier New", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      
      for (let i = 0; i < 20; i++) {
        const x = (Date.now() / 1000 + i * 100) % canvas.width;
        const y = (Math.sin(Date.now() / 1000 + i) * 50 + i * 50) % canvas.height;
        const byte = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        ctx.fillText(`0x${byte}`, x, y);
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update position based on type
        if (p.type === 'sparkle') {
          p.x += p.speedX;
          p.y += p.speedY;
        } else if (p.type === 'wave') {
          p.x += p.speedX;
          p.y += Math.sin(Date.now() / 1000 + i) * 0.5;
        } else {
          p.x += p.speedX * 0.5;
          p.y += p.speedY * 0.5;
        }
        
        p.life -= 0.005;
        
        // Remove dead particles
        if (p.life <= 0 || 
            p.x < -10 || p.x > canvas.width + 10 || 
            p.y < -10 || p.y > canvas.height + 10) {
          particles.splice(i, 1);
          
          // Replace with new particle
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: Math.random() * 0.5 + 0.5,
            type: ['sparkle', 'wave', 'orb'][Math.floor(Math.random() * 3)] as any,
          });
          
          continue;
        }

        // Draw particle based on type
        ctx.beginPath();
        
        if (p.type === 'sparkle') {
          // Draw sparkle as star
          for (let j = 0; j < 5; j++) {
            const angle = (j * 72 * Math.PI) / 180;
            const x2 = p.x + Math.cos(angle) * p.size * 2;
            const y2 = p.y + Math.sin(angle) * p.size * 2;
            if (j === 0) {
              ctx.moveTo(x2, y2);
            } else {
              ctx.lineTo(x2, y2);
            }
          }
          ctx.closePath();
        } else if (p.type === 'wave') {
          // Draw wave as sine wave
          ctx.moveTo(p.x - p.size * 2, p.y);
          for (let j = -2; j <= 2; j += 0.1) {
            const x2 = p.x + j * p.size;
            const y2 = p.y + Math.sin(j * 2 + Date.now() / 1000) * p.size;
            ctx.lineTo(x2, y2);
          }
        } else {
          // Draw orb as circle
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = p.color.replace('0.7', p.life.toString());
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};