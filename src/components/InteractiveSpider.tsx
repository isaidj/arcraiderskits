"use client";

import { useEffect, useRef, useState } from "react";

interface Vector2 {
  x: number;
  y: number;
}

interface Leg {
  basePos: Vector2;
  currentPos: Vector2;
  targetPos: Vector2;
  isMoving: boolean;
  offset: Vector2;
  stepHeight: number;
  stepProgress: number;
}

interface InteractiveSpiderProps {
  scale?: number; // Escala general de la araña (1 = tamaño normal)
}

export default function InteractiveSpider({ scale = 0.5 }: InteractiveSpiderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const spiderRef = useRef({
    x: 200,
    y: 0,
    targetX: 200,
    targetY: 0,
    bodySize: 15, // Cuerpo más pequeño
    legs: [] as Leg[],
    direction: 1,
    speed: 0.8, // Movimiento más lento
    groundLevel: 0,
    scale: scale, // Escala general
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const groundLevel = canvas.height;
      spiderRef.current.groundLevel = groundLevel;
      spiderRef.current.y = groundLevel - 15 * spiderRef.current.scale;
      spiderRef.current.targetY = groundLevel - 15 * spiderRef.current.scale;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Inicializar 4 patas
    const initLegs = () => {
      const spider = spiderRef.current;
      const legOffsets = [
        { x: -12 * spider.scale, y: -8 * spider.scale }, // Pata izquierda frontal
        { x: -12 * spider.scale, y: 8 * spider.scale }, // Pata izquierda trasera
        { x: 12 * spider.scale, y: 8 * spider.scale }, // Pata derecha trasera
        { x: 12 * spider.scale, y: -8 * spider.scale }, // Pata derecha frontal
      ];

      spider.legs = legOffsets.map((offset, index) => {
        const side = index < 2 ? -1 : 1;
        const legReach = 60 * spider.scale;
        return {
          basePos: { x: spider.x + offset.x, y: spider.y + offset.y },
          currentPos: {
            x: spider.x + offset.x + side * legReach,
            y: spider.groundLevel,
          },
          targetPos: {
            x: spider.x + offset.x + side * legReach,
            y: spider.groundLevel,
          },
          isMoving: false,
          offset: offset,
          stepHeight: 0,
          stepProgress: 0,
        };
      });
    };
    initLegs();

    const distance = (p1: Vector2, p2: Vector2) => {
      return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    };

    const lerp = (start: number, end: number, t: number) => {
      return start + (end - start) * t;
    };

    const updateLegs = () => {
      const spider = spiderRef.current;
      const stepDistance = 40 * spider.scale;
      const legReach = 60 * spider.scale;
      const stepHeightMax = 20 * spider.scale;

      spider.legs.forEach((leg, index) => {
        leg.basePos.x = spider.x + leg.offset.x;
        leg.basePos.y = spider.y + leg.offset.y;

        const side = index < 2 ? -1 : 1;

        if (!leg.isMoving) {
          const idealFootPos = {
            x: leg.basePos.x + side * legReach,
            y: spider.groundLevel,
          };

          const distToIdeal = distance(leg.currentPos, idealFootPos);

          if (distToIdeal > stepDistance) {
            const group = index === 0 || index === 3 ? 0 : 1;
            const otherLegsInGroup = spider.legs.filter((_, i) => i !== index && (i === 0 || i === 3 ? 0 : 1) === group);

            const groupIsMoving = otherLegsInGroup.some((l) => l.isMoving);

            if (!groupIsMoving) {
              leg.isMoving = true;
              leg.stepProgress = 0;
              leg.targetPos.x = idealFootPos.x + spider.direction * 15 * spider.scale;
              leg.targetPos.y = spider.groundLevel;
            }
          }
        }

        if (leg.isMoving) {
          leg.stepProgress += 0.08;

          if (leg.stepProgress >= 1) {
            leg.isMoving = false;
            leg.stepProgress = 0;
            leg.stepHeight = 0;
            leg.currentPos.x = leg.targetPos.x;
            leg.currentPos.y = leg.targetPos.y;
          } else {
            leg.currentPos.x = lerp(leg.currentPos.x, leg.targetPos.x, leg.stepProgress);
            const heightCurve = Math.sin(leg.stepProgress * Math.PI);
            leg.stepHeight = heightCurve * stepHeightMax;
            leg.currentPos.y = leg.targetPos.y - leg.stepHeight;
          }
        }
      });
    };

    const autoMove = () => {
      const spider = spiderRef.current;
      if (!isDragging) {
        spider.targetX += spider.speed * spider.direction;

        if (spider.targetX > canvas.width - 80 * spider.scale) {
          spider.direction = -1;
        } else if (spider.targetX < 80 * spider.scale) {
          spider.direction = 1;
        }

        spider.x = lerp(spider.x, spider.targetX, 0.1);
        spider.y = spider.groundLevel - 15 * spider.scale;
      }
    };

    const drawSpider = () => {
      const spider = spiderRef.current;

      // Patas minimalistas
      spider.legs.forEach((leg, index) => {
        const angle = Math.atan2(leg.currentPos.y - leg.basePos.y, leg.currentPos.x - leg.basePos.x);
        const side = index < 2 ? 1 : -1;
        const kneeOffset = 25 * spider.scale;
        const midX = (leg.basePos.x + leg.currentPos.x) / 2 + Math.cos(angle + Math.PI / 2) * kneeOffset * side;
        const midY = (leg.basePos.y + leg.currentPos.y) / 2 + Math.sin(angle + Math.PI / 2) * kneeOffset * side;

        // Segmento superior grueso
        ctx.strokeStyle = "#4a4a4a";
        ctx.lineWidth = 8 * spider.scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(leg.basePos.x, leg.basePos.y);
        ctx.lineTo(midX, midY);
        ctx.stroke();

        // Segmento inferior delgado
        ctx.strokeStyle = "#4a4a4a";
        ctx.lineWidth = 4 * spider.scale;

        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(leg.currentPos.x, leg.currentPos.y);
        ctx.stroke();
      });

      // Cuerpo simple
      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.arc(spider.x, spider.y, spider.bodySize * spider.scale, 0, Math.PI * 2);
      ctx.fill();

      // OJO con borde rojo brillante
      const eyeSize = spider.bodySize * 0.5 * spider.scale;
      const eyeX = spider.x + spider.direction * (spider.bodySize * 0.5 * spider.scale);
      const eyeY = spider.y - 2 * spider.scale;

      // Brillo rojo desde el borde
      const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, eyeSize * 0.7, eyeX, eyeY, eyeSize * 1.3);
      eyeGlow.addColorStop(0, "rgba(255, 0, 0, 0)");
      eyeGlow.addColorStop(0.5, "rgba(255, 0, 0, 0.2)");
      eyeGlow.addColorStop(0.8, "rgba(255, 0, 0, 0.1)");
      eyeGlow.addColorStop(1, "rgba(255, 0, 0, 0)");

      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeSize * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Círculo interior negro
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // Borde rojo brillante
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2 * spider.scale;
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 8 * spider.scale;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      autoMove();
      updateLegs();
      drawSpider();
      requestAnimationFrame(animate);
    };
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const spider = spiderRef.current;
      const dist = distance({ x: mouseX, y: mouseY }, { x: spider.x, y: spider.y });
      if (dist < (spider.bodySize + 20) * spider.scale) {
        setIsDragging(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const spider = spiderRef.current;
        spider.targetX = e.clientX - rect.left;
        spider.targetY = e.clientY - rect.top;
        spider.x = spider.targetX;
        spider.y = spider.targetY;
        if (e.movementX > 0) spider.direction = 1;
        else if (e.movementX < 0) spider.direction = -1;
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        spiderRef.current.targetY = spiderRef.current.groundLevel - 15 * spiderRef.current.scale;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      const spider = spiderRef.current;
      const dist = distance({ x: touchX, y: touchY }, { x: spider.x, y: spider.y });
      if (dist < (spider.bodySize + 20) * spider.scale) {
        setIsDragging(true);
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const spider = spiderRef.current;
        spider.targetX = touch.clientX - rect.left;
        spider.targetY = touch.clientY - rect.top;
        spider.x = spider.targetX;
        spider.y = spider.targetY;
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        spiderRef.current.targetY = spiderRef.current.groundLevel - 15 * spiderRef.current.scale;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        cursor: isDragging ? "grabbing" : "default",
        mixBlendMode: "normal",
      }}
    />
  );
}
