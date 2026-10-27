'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function RabbitCompanion() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isMoving, setIsMoving] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset slightly so the rabbit sits near the cursor rather than directly under the tip
      targetRef.current = { x: e.clientX + 16, y: e.clientY + 14 };

      // Initialize instantly on first mouse entry
      if (currentRef.current.x === -100) {
        currentRef.current = { ...targetRef.current };
        setPos({ ...targetRef.current });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Physics loop: Smooth spring/lerp follow
    const loop = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Chase threshold
      if (dist > 3) {
        // Lerp factor (0.1 = smooth, playful chase speed)
        currentRef.current.x += dx * 0.1;
        currentRef.current.y += dy * 0.1;

        setPos({ x: currentRef.current.x, y: currentRef.current.y });
        setIsMoving(true);

        if (dx < -1) {
          setFacingLeft(true);
        } else if (dx > 1) {
          setFacingLeft(false);
        }

        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      } else {
        // Debounce stopping state to settle smoothly
        if (!stopTimeoutRef.current) {
          stopTimeoutRef.current = setTimeout(() => {
            setIsMoving(false);
            stopTimeoutRef.current = null;
          }, 80);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  if (pos.x < 0) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] select-none transition-transform duration-75"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) scaleX(${facingLeft ? -1 : 1})`,
      }}
    >
      <div className={`relative flex items-center justify-center ${isMoving ? 'animate-bounce' : ''}`}>
        {/* Glow halo underneath matching the cockpit vibe */}
        <div className="absolute -bottom-1 w-6 h-2 rounded-full bg-cyan-400/25 blur-sm" />

        {/* Crisp Pixel/Vector Bunny */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        >
          {/* Ears */}
          <path
            d="M8 3C7 3 6.5 4.5 7 7L8 10H10L9.5 5C9.3 3.8 8.7 3 8 3Z"
            fill="#E2E8F0"
          />
          <path d="M8 4.5C7.6 4.5 7.4 5.2 7.7 6.5L8.2 9H9L8.7 5.5C8.6 4.8 8.3 4.5 8 4.5Z" fill="#F472B6" />
          
          <path
            d="M12 2C11 2 10.5 3.5 11 6.5L12 10H14L13.5 4C13.3 2.8 12.7 2 12 2Z"
            fill="#E2E8F0"
          />
          <path d="M12 3.5C11.6 3.5 11.4 4.2 11.7 5.8L12.2 9H13L12.7 4.8C12.6 4 12.3 3.5 12 3.5Z" fill="#F472B6" />

          {/* Body & Head */}
          <ellipse cx="11" cy="13" rx="5" ry="4.5" fill="#F8FAFC" />
          <ellipse cx="14" cy="16" rx="5.5" ry="4" fill="#E2E8F0" />

          {/* Eyes (Glowing cockpit cyber-blue) */}
          <circle cx="9" cy="12" r="1.2" fill="#06B6D4" />
          <circle cx="9.4" cy="11.7" r="0.4" fill="#FFFFFF" />

          {/* Nose */}
          <polygon points="7,13.5 7.8,14.5 6.2,14.5" fill="#FB7185" />

          {/* Paws */}
          <ellipse cx="11" cy="19.5" rx="2.5" ry="1.2" fill="#CBD5E1" />
          <ellipse cx="16" cy="19" rx="2.5" ry="1.2" fill="#CBD5E1" />

          {/* Fluffy Tail */}
          <circle cx="19.5" cy="15" r="2" fill="#FFFFFF" />
        </svg>

        {/* Dynamic Running Dust Puffs */}
        {isMoving && (
          <span className="absolute -left-2 bottom-0 w-1.5 h-1.5 rounded-full bg-cyan-400/40 animate-ping" />
        )}
      </div>
    </div>
  );
}