import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const { theme } = useTheme();

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const cubes: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      rotation: number;
      opacity: number;
      hovered: boolean;
      depression: number;
    }> = [];

    // Initialize cubes with tighter spacing and larger size
    const gridSize = 45; // Reduced from 60 for tighter grid
    const baseSize = 30; // Increased from 20 for larger cubes
    
    for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
      for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
        cubes.push({
          x: x + Math.random() * 15 - 7.5,
          y: y + Math.random() * 15 - 7.5,
          z: Math.random() * 100,
          size: baseSize + Math.random() * 12, // 25-30% larger
          rotation: Math.random() * Math.PI,
          opacity: 0.15 + Math.random() * 0.25,
          hovered: false,
          depression: 0
        });
      }
    }

    const drawCube = (cube: typeof cubes[0]) => {
      const { x, y, z, size, rotation, opacity, depression } = cube;
      
      // Calculate distance from mouse for hover effect
      const mouseDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - x, 2) + Math.pow(mouseRef.current.y - y, 2)
      );
      
      const isHovered = mouseDistance < 40;
      cube.hovered = isHovered;
      
      // Animate depression
      if (isHovered) {
        cube.depression = Math.min(cube.depression + 0.1, 1);
      } else {
        cube.depression = Math.max(cube.depression - 0.05, 0);
      }
      
      const influence = Math.max(0, 1 - mouseDistance / 150);
      const dynamicOpacity = opacity + influence * 0.3;
      const dynamicSize = size + influence * 8;
      const depthOffset = cube.depression * 8; // Depression effect
      
      ctx.save();
      ctx.translate(x, y + depthOffset);
      ctx.rotate(rotation + influence * 0.3);
      
      // Theme-based colors
      let baseColor, shadowColor, leftColor, rightColor;
      
      if (theme === 'light') {
        baseColor = isHovered ? '200, 200, 200' : '220, 220, 220'; // Light grey
        shadowColor = '180, 180, 180'; // Darker shadow for light theme
        leftColor = isHovered ? '190, 190, 190' : '210, 210, 210';
        rightColor = isHovered ? '170, 170, 170' : '190, 190, 190';
      } else {
        baseColor = isHovered ? '64, 64, 64' : '43, 43, 43'; // #404040 : #2B2B2B
        shadowColor = '26, 26, 26'; // Darker shadow
        leftColor = isHovered ? '51, 51, 51' : '35, 35, 35';
        rightColor = isHovered ? '45, 45, 45' : '30, 30, 30';
      }
      
      // Draw cube faces with isometric perspective
      const halfSize = dynamicSize / 2;
      
      // Shadow (bottom face)
      ctx.fillStyle = `rgba(${shadowColor}, ${dynamicOpacity * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(-halfSize * 0.866, halfSize * 0.5 + 4);
      ctx.lineTo(0, halfSize + 4);
      ctx.lineTo(halfSize * 0.866, halfSize * 0.5 + 4);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fill();
      
      // Top face (lightest)
      ctx.fillStyle = `rgba(${baseColor}, ${dynamicOpacity * 0.9})`;
      ctx.beginPath();
      ctx.moveTo(0, -halfSize);
      ctx.lineTo(halfSize * 0.866, -halfSize * 0.5);
      ctx.lineTo(0, 0);
      ctx.lineTo(-halfSize * 0.866, -halfSize * 0.5);
      ctx.closePath();
      ctx.fill();
      
      // Left face (medium)
      ctx.fillStyle = `rgba(${leftColor}, ${dynamicOpacity * 0.7})`;
      ctx.beginPath();
      ctx.moveTo(-halfSize * 0.866, -halfSize * 0.5);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, halfSize);
      ctx.lineTo(-halfSize * 0.866, halfSize * 0.5);
      ctx.closePath();
      ctx.fill();
      
      // Right face (darkest)
      ctx.fillStyle = `rgba(${rightColor}, ${dynamicOpacity * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(halfSize * 0.866, -halfSize * 0.5);
      ctx.lineTo(halfSize * 0.866, halfSize * 0.5);
      ctx.lineTo(0, halfSize);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      
      // Highlight edge on hover
      if (isHovered) {
        const highlightColor = theme === 'light' ? '160, 160, 160' : '77, 77, 77';
        ctx.strokeStyle = `rgba(${highlightColor}, ${influence * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize * 0.866, -halfSize * 0.5);
        ctx.lineTo(0, 0);
        ctx.lineTo(-halfSize * 0.866, -halfSize * 0.5);
        ctx.closePath();
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      cubes.forEach((cube, index) => {
        cube.rotation += 0.001 + Math.sin(Date.now() * 0.0008 + index) * 0.0005;
        drawCube(cube);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  const backgroundColor = theme === 'light' ? '#F8F9FA' : '#1A1A1A';

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: backgroundColor }}
    />
  );
};

export default AnimatedBackground;