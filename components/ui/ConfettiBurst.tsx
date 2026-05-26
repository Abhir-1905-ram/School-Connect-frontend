"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#8B5CF6",
  "#EF4444",
];

interface ConfettiBurstProps {
  active: boolean;
  className?: string;
  particleCount?: number;
}

export function ConfettiBurst({
  active,
  className,
  particleCount = 24,
}: ConfettiBurstProps) {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; color: string; size: number }[]
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    setParticles(
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        delay: Math.random() * 0.3,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
      }))
    );
    const t = setTimeout(() => setParticles([]), 2200);
    return () => clearTimeout(t);
  }, [active, particleCount]);

  if (!active || particles.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle absolute bottom-1/2 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
