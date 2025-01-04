import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Blob {
  centerX: number;
  centerY: number;
  radius: number;
  points: Point[];
  noiseOffset: number;
}

const POINTS_NUMBER = 24; // Increased number of points for smoother waves

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create blobs with fixed positions
    const blobs: Blob[] = [
      {
        centerX: dimensions.width, // Top right
        centerY: 0,
        radius: 450,
        points: [],
        noiseOffset: 1000
      },
      {
        centerX: 0, // Bottom left
        centerY: dimensions.height,
        radius: 400,
        points: [],
        noiseOffset: 1000 // Different offset for varied animation
      }
    ];

    // Initialize points for each blob
    blobs.forEach(blob => {
      blob.points = Array.from({ length: POINTS_NUMBER }, (_, i) => {
        const angle = (i / POINTS_NUMBER) * Math.PI * 2;
        return {
          x: blob.centerX + Math.cos(angle) * blob.radius,
          y: blob.centerY + Math.sin(angle) * blob.radius
        };
      });
    });

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      ctx.filter = 'blur(100px)';

      blobs.forEach(blob => {
        // Update points positions with enhanced wave effect
        blob.points.forEach((point, i) => {
          const angle = (i / POINTS_NUMBER) * Math.PI * 2;
          
          // More complex wave pattern
          const waveX = Math.sin(time * 0.001 + blob.noiseOffset + i * 0.5) * 80 +
                       Math.cos(time * 0.002 - i * 0.3) * 40;
          const waveY = Math.cos(time * 0.001 + blob.noiseOffset + i * 0.5) * 80 +
                       Math.sin(time * 0.002 - i * 0.3) * 40;
          
          point.x = blob.centerX + Math.cos(angle) * (blob.radius + waveX);
          point.y = blob.centerY + Math.sin(angle) * (blob.radius + waveY);
        });

        // Draw blob
        ctx.beginPath();
        ctx.moveTo(blob.points[0].x, blob.points[0].y);

        // Create smooth curve through points
        for (let i = 0; i <= blob.points.length; i++) {
          const point = blob.points[i % blob.points.length];
          const nextPoint = blob.points[(i + 1) % blob.points.length];
          
          const xc = (point.x + nextPoint.x) / 2;
          const yc = (point.y + nextPoint.y) / 2;
          
          ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }

        ctx.fillStyle = 'rgba(245, 233, 165, 0.20)';
        ctx.fill();
      });

      ctx.filter = 'none';
      time++;
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions.width, dimensions.height]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed top-0 left-0 -z-10"
    />
  );
};

export default Background; 
