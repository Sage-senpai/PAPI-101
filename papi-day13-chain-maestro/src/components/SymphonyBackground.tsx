//src/components/SymphonyBackground.tsx
import React, { useEffect, useRef } from 'react';

export const SymphonyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const notesRef = useRef<Array<{x: number; y: number; type: string; createdAt: number}>>([]);

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

    // Chain nodes (representing different chains)
    const nodes = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, color: '#E6007A', label: 'Polkadot' },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, color: '#000000', label: 'Kusama' },
      { x: canvas.width * 0.8, y: canvas.height * 0.3, color: '#00AEEF', label: 'Westend' },
    ];

    // Particles for connections
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      origin: number;
      target: number;
    }> = [];

    // Create particles between nodes
    const createConnectionParticles = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.7) {
            const startX = nodes[i].x;
            const startY = nodes[i].y;
            const endX = nodes[j].x;
            const endY = nodes[j].y;
            
            const particleCount = Math.floor(Math.random() * 2) + 1;
            
            for (let k = 0; k < particleCount; k++) {
              const progress = Math.random();
              particles.push({
                x: startX + (endX - startX) * progress,
                y: startY + (endY - startY) * progress,
                vx: (endX - startX) * 0.01,
                vy: (endY - startY) * 0.01,
                size: Math.random() * 2 + 1,
                color: `rgba(${parseInt(nodes[i].color.slice(1, 3), 16)}, ${parseInt(nodes[i].color.slice(3, 5), 16)}, ${parseInt(nodes[i].color.slice(5, 7), 16)}, 0.7)`,
                life: 1,
                origin: i,
                target: j
              });
            }
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 35, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      ctx.strokeStyle = 'rgba(109, 40, 217, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        
        // Remove dead particles
        if (p.life <= 0 || 
            p.x < 0 || p.x > canvas.width || 
            p.y < 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.7', p.life.toString());
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((node, index) => {
        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 40
        );
        gradient.addColorStop(0, `${node.color}40`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 35);
      });

      // Create new particles occasionally
      if (Math.random() > 0.95) {
        createConnectionParticles();
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Create initial particles
    createConnectionParticles();

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