import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#2f80ff", "#7fb0ff", "#ffc144", "#2fae66", "#c6cbd2"];
export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fire = confetti.create(canvasRef.current, { resize: true });
    const burst = (delay, options) =>
      setTimeout(
        () =>
          fire({
            colors: COLORS,
            startVelocity: 32,
            gravity: 1.1,
            decay: 0.91,
            ticks: 120,
            ...options,
          }),
        delay,
      );

    const timers = [
      burst(0, { particleCount: 90, spread: 360, origin: { x: 0.5, y: 0.42 } }),

      burst(180, {
        particleCount: 40,
        spread: 260,
        origin: { x: 0.3, y: 0.5 },
      }),
    ];

    return () => {
      timers.forEach(clearTimeout);
      fire.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
