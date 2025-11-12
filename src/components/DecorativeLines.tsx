"use client";

import { useEffect, useRef } from "react";

export default function DecorativeLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const widthCanvas = 500;
    canvas.width = widthCanvas * dpr;
    canvas.height = widthCanvas * dpr;
    canvas.style.width = `${widthCanvas}px`;
    canvas.style.height = `${widthCanvas}px`;

    ctx.scale(dpr, dpr);

    // Detectar si es un dispositivo móvil o de baja potencia
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : isMobile;

    // Ajustar calidad de blur según el dispositivo
    const baseBlur = isLowPower ? 5 : 10;
    const glowBlur = isLowPower ? 30 : 60;

    // Precalcular todas las constantes
    const colors = ["#73fefc", "#1aff8e", "#fff822", "#fd1822"];
    const lineWidth = 20;
    const angle = (-65 * Math.PI) / 180;
    const length = 700;
    const spacing = 45;
    const startX = 20;
    const startY = 100;
    const translateX = -180;
    const translateY = -180;
    const bendPercent = 0.7;
    const bendDegrees = 15;
    const drawDuration = 0.8;
    const startDelay = 0.15;
    const totalDuration = (colors.length - 1) * startDelay + drawDuration;

    // Precalcular valores trigonométricos
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const cosAnglePerpendicular = Math.cos(angle + Math.PI / 2);
    const sinAnglePerpendicular = Math.sin(angle + Math.PI / 2);
    const bendAngle = angle - (bendDegrees * Math.PI) / 180;
    const cosBendAngle = Math.cos(bendAngle);
    const sinBendAngle = Math.sin(bendAngle);

    // Precalcular geometría de cada línea
    const linesData = colors.map((color, index) => {
      const offsetX = index * spacing * cosAnglePerpendicular;
      const offsetY = index * spacing * sinAnglePerpendicular;
      const x1 = startX + offsetX + translateX;
      const y1 = startY + offsetY + translateY;
      const x2 = x1 + length * cosAngle;
      const y2 = y1 - length * sinAngle;

      // Para la línea con doblez (index 0)
      let bendData = null;
      if (index === 0) {
        const bendX = x1 + length * bendPercent * cosAngle;
        const bendY = y1 - length * bendPercent * sinAngle;
        const remainingLength = length * (1 - bendPercent);
        const endX = bendX + remainingLength * cosBendAngle;
        const endY = bendY - remainingLength * sinBendAngle;
        const controlDistance = remainingLength * 0.5;
        const controlX = bendX + controlDistance * cosAngle;
        const controlY = bendY - controlDistance * sinAngle;

        // Precalcular puntos de la curva
        const curvePoints = [];
        const curveSteps = isLowPower ? 15 : 20;
        for (let i = 0; i <= curveSteps; i++) {
          const t = i / curveSteps;
          const pointX = (1 - t) * (1 - t) * bendX + 2 * (1 - t) * t * controlX + t * t * endX;
          const pointY = (1 - t) * (1 - t) * bendY + 2 * (1 - t) * t * controlY + t * t * endY;
          curvePoints.push({ x: pointX, y: pointY });
        }

        bendData = { bendX, bendY, endX, endY, controlX, controlY, curvePoints };
      }

      return {
        color,
        x1,
        y1,
        x2,
        y2,
        lineStartTime: index * startDelay,
        lineEndTime: index * startDelay + drawDuration,
        bendData,
      };
    });

    let animationFrame: number;
    let startTime = Date.now();
    let lastProgress = -1;

    const drawLines = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      // Solo limpiar el canvas si hay cambios en la animación
      const currentProgress = Math.min(elapsed / totalDuration, 1);
      if (currentProgress !== lastProgress) {
        ctx.clearRect(0, 0, widthCanvas, widthCanvas);
        lastProgress = currentProgress;

        linesData.forEach((lineData) => {
          const { color, x1, y1, x2, y2, lineStartTime, lineEndTime, bendData } = lineData;

          // Calcular el progreso de dibujo (0 a 1)
          let drawProgress = 0;
          if (elapsed >= lineStartTime && elapsed <= lineEndTime) {
            drawProgress = (elapsed - lineStartTime) / drawDuration;
          } else if (elapsed > lineEndTime) {
            drawProgress = 1;
          }

          // Solo dibujar si hay progreso
          if (drawProgress > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = baseBlur;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";

            // Si tiene doblez (primera línea)
            if (bendData) {
              const { bendX, bendY, endX, endY, controlX, controlY, curvePoints } = bendData;

              ctx.beginPath();
              ctx.moveTo(x1, y1);

              if (drawProgress < 1) {
                // Durante la animación
                if (drawProgress <= bendPercent) {
                  // Parte recta antes del doblez
                  const currentProgress = drawProgress / bendPercent;
                  const currentX = x1 + length * bendPercent * currentProgress * cosAngle;
                  const currentY = y1 - length * bendPercent * currentProgress * sinAngle;
                  ctx.lineTo(currentX, currentY);
                } else {
                  // Parte recta completa + curva progresiva
                  ctx.lineTo(bendX, bendY);

                  const curveProgress = (drawProgress - bendPercent) / (1 - bendPercent);
                  const pointsToDraw = Math.ceil(curveProgress * curvePoints.length);

                  for (let i = 0; i < pointsToDraw; i++) {
                    ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
                  }
                }
              } else {
                // Completado: usar quadraticCurveTo para máxima suavidad
                ctx.lineTo(bendX, bendY);
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
              }

              ctx.stroke();

              // Capa de brillo
              ctx.shadowBlur = glowBlur;
              ctx.globalAlpha = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else {
              // Líneas normales sin doblez
              const currentX = x1 + length * drawProgress * cosAngle;
              const currentY = y1 - length * drawProgress * sinAngle;

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(currentX, currentY);
              ctx.stroke();

              // Capa de brillo
              ctx.shadowBlur = glowBlur;
              ctx.globalAlpha = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        });

        // Resetear sombras
        ctx.shadowBlur = 0;
      }

      // Continuar la animación solo hasta que todas las líneas estén completamente dibujadas
      if (elapsed < totalDuration) {
        animationFrame = requestAnimationFrame(drawLines);
      }
    };

    drawLines();

    // Limpiar la animación al desmontar
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed bottom-0 left-0 pointer-events-none -z-10" style={{ width: "400px", height: "400px" }} />;
}
