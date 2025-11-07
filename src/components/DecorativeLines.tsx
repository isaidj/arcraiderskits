'use client';

import { useEffect, useRef } from 'react';

export default function DecorativeLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = '400px';
    canvas.style.height = '400px';
    ctx.scale(dpr, dpr);

    const drawLines = () => {
      ctx.clearRect(0, 0, 400, 400);

      const colors = ['#73fefc', '#1aff8e', '#fff822', '#fd1822'];
      const lineWidth = 20;
      const angle = (-65 * Math.PI) / 180;
      const length = 600;
      const spacing = 45;
      const startX = 20;
      const startY = 100;
      const translateX = -180;  // Desplazamiento horizontal adicional
      const translateY = -180;  // Desplazamiento vertical adicional
      const bendPercent = 0.7;  // Punto donde inicia el doblez (0.0-1.0)
      const bendDegrees = 15;  // Ángulo del doblez en grados (positivo = abajo, negativo = arriba)

      colors.forEach((color, index) => {
        const offsetX = index * spacing * Math.cos(angle + Math.PI / 2);
        const offsetY = index * spacing * Math.sin(angle + Math.PI / 2);
        
        const x1 = startX + offsetX + translateX;
        const y1 = startY + offsetY + translateY;
        const x2 = x1 + length * Math.cos(angle);
        const y2 = y1 - length * Math.sin(angle);

        // Bloom effect con múltiples capas
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'bevel';

        // Si es la primera línea (índice 0, que es cyan), agregar doblez al final
        if (index === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          // Línea principal hasta el punto de doblez
          const bendPoint = bendPercent;
          const bendX = x1 + length * bendPoint * Math.cos(angle);
          const bendY = y1 - length * bendPoint * Math.sin(angle);
          ctx.lineTo(bendX, bendY);
          
          // Doblez con curva suave usando quadraticCurveTo
          const bendAngle = angle - (bendDegrees * Math.PI) / 180;
          const remainingLength = length * (1 - bendPoint);
          const endX = bendX + remainingLength * Math.cos(bendAngle);
          const endY = bendY - remainingLength * Math.sin(bendAngle);
          
          // Punto de control para la curva (en el medio entre bendPoint y final)
          const controlDistance = remainingLength * 0.5;
          const controlX = bendX + controlDistance * Math.cos(angle);
          const controlY = bendY - controlDistance * Math.sin(angle);
          
          ctx.quadraticCurveTo(controlX, controlY, endX, endY);
          
          ctx.stroke();

          // Capa adicional de brillo para bloom más intenso
          ctx.shadowBlur = 60;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          // Líneas normales sin doblez
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Capa adicional de brillo para bloom más intenso
          ctx.shadowBlur = 60;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Resetear sombras
      ctx.shadowBlur = 0;
    };

    drawLines();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 left-0 pointer-events-none z-0"
      style={{ width: '400px', height: '400px' }}
    />
  );
}
