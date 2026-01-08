// src/components/TurboBackground.tsx
import React, { useEffect, useRef } from 'react';

export const TurboBackground: React.FC = () => {
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

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    }> = [];

    const colors = [
      'rgba(0, 212, 255, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(230, 0, 122, 0.7)',
    ];

    // Create particles
    const createParticles = () => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (Math.random() > 0.8) {
        createParticles();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        
        if (p.life <= 0 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.7', p.life.toString());
        ctx.fill();
      }

      // Draw grid
      ctx.strokeStyle = 'rgba(42, 42, 58, 0.3)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
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