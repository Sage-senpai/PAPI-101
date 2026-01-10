// src/components/MagicBackground.tsx
// ==========================================
import { useEffect, useRef } from 'react';

export const MagicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
      'rgba(138, 43, 226, 0.7)',
      'rgba(0, 212, 255, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(245, 158, 11, 0.7)',
    ];

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

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
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
        
        if (p.life <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
          particles.splice(i, 1);
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

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};