"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize handler
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        // Animation loop
        const animate = () => {
            timeRef.current += 1;
            const t = timeRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Flowing mesh grid
            ctx.strokeStyle = "rgba(15, 40, 84, 0.09)";
            ctx.lineWidth = 0.6;
            const gridSize = 60;
            const rows = Math.ceil(canvas.height / gridSize) + 1;
            const cols = Math.ceil(canvas.width / gridSize) + 1;

            // Horizontal flowing lines
            for (let row = 0; row < rows; row++) {
                ctx.beginPath();
                for (let col = 0; col <= cols; col++) {
                    const x = col * gridSize;
                    const baseY = row * gridSize;
                    const wave = Math.sin(x * 0.01 + t * 0.015 + row) * 8 +
                                 Math.cos(x * 0.008 - t * 0.01) * 5;
                    const y = baseY + wave;

                    const mdx = mouseRef.current.x - x;
                    const mdy = mouseRef.current.y - y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    const mouseWarp = mdist < 200 ? (200 - mdist) / 200 * 12 : 0;

                    if (col === 0) {
                        ctx.moveTo(x, y + mouseWarp);
                    } else {
                        ctx.lineTo(x, y + mouseWarp);
                    }
                }
                ctx.stroke();
            }

            // Vertical flowing lines
            for (let col = 0; col < cols; col++) {
                ctx.beginPath();
                for (let row = 0; row <= rows; row++) {
                    const y = row * gridSize;
                    const baseX = col * gridSize;
                    const wave = Math.sin(y * 0.01 + t * 0.012 + col) * 8 +
                                 Math.cos(y * 0.007 - t * 0.008) * 5;
                    const x = baseX + wave;

                    const mdx = mouseRef.current.x - x;
                    const mdy = mouseRef.current.y - y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    const mouseWarp = mdist < 200 ? (200 - mdist) / 200 * 12 : 0;

                    if (row === 0) {
                        ctx.moveTo(x + mouseWarp, y);
                    } else {
                        ctx.lineTo(x + mouseWarp, y);
                    }
                }
                ctx.stroke();
            }

            // Glowing dots at grid intersections
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const baseX = col * gridSize;
                    const baseY = row * gridSize;
                    const waveX = Math.sin(baseY * 0.01 + t * 0.012 + col) * 8;
                    const waveY = Math.sin(baseX * 0.01 + t * 0.015 + row) * 8;
                    const x = baseX + waveX;
                    const y = baseY + waveY;

                    const mdx = mouseRef.current.x - x;
                    const mdy = mouseRef.current.y - y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    const dotSize = mdist < 150 ? 2.5 + (150 - mdist) / 150 * 2 : 1.5;
                    const dotOpacity = mdist < 150 ? 0.15 + (150 - mdist) / 150 * 0.3 : 0.06;

                    ctx.beginPath();
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(15, 40, 84, ${dotOpacity})`;
                    ctx.fill();
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            style={{ pointerEvents: "auto" }}
        />
    );
}
