import React, { useEffect, useRef } from 'react';

/**
 * SpringBackground Component
 * Provides an animated spring atmosphere with fluttering white cherry/apple blossoms,
 * fresh green leaves, and glowing pollen/fireflies.
 * Works seamlessly in both Light and Dark mode.
 */
export default function SpringBackground({ theme = 'light' }) {
  const canvasRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: 'flower' (5 petals), 'petal' (single flower petal), 'leaf' (green leaf), 'sparkle' (glowing particle)
    const particleCount = width < 768 ? 44 : 75;
    const particles = [];

    const createParticle = (initialY = null) => {
      const typeRand = Math.random();
      let type = 'petal';
      if (typeRand < 0.28) type = 'flower';
      else if (typeRand < 0.62) type = 'petal';
      else if (typeRand < 0.88) type = 'leaf';
      else type = 'sparkle';

      const size = type === 'flower' 
        ? Math.random() * 12 + 14 
        : type === 'leaf' 
          ? Math.random() * 10 + 12 
          : type === 'petal'
            ? Math.random() * 8 + 8
            : Math.random() * 4 + 2;

      return {
        type,
        x: Math.random() * (width + 100) - 50,
        y: initialY !== null ? initialY : Math.random() * -height,
        size,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 1.0 - 0.3,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayDistance: Math.random() * 1.8 + 0.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        flipAngle: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.4 + 0.55,
        phase: Math.random() * Math.PI * 2,
      };
    };

    // Pre-populate particles on screen
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    // Helper: Draw 5-petal spring blossom
    const drawFlower = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const scaleX = Math.cos(p.flipAngle);
      ctx.scale(scaleX, 1);
      ctx.globalAlpha = p.opacity;

      const r = p.size;
      const petalCount = 5;

      for (let i = 0; i < petalCount; i++) {
        const petalAngle = (i * Math.PI * 2) / petalCount;
        ctx.save();
        ctx.rotate(petalAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(r * 0.5, -r * 0.35, r * 0.8, -r * 0.5, r, 0);
        ctx.bezierCurveTo(r * 0.8, r * 0.5, r * 0.5, r * 0.35, 0, 0);

        if (isDark) {
          // Bioluminescent mint/white in dark mode
          const grad = ctx.createRadialGradient(0, 0, 1, r * 0.6, 0, r);
          grad.addColorStop(0, 'rgba(167, 243, 208, 0.95)');
          grad.addColorStop(0.6, 'rgba(52, 211, 153, 0.7)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.35)');
          ctx.fillStyle = grad;
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 8;
        } else {
          // Delicate pure white & fresh emerald spring blossom
          const grad = ctx.createRadialGradient(0, 0, 1, r * 0.7, 0, r);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.65, '#f7fdfa');
          grad.addColorStop(1, 'rgba(167, 243, 208, 0.90)');
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.25)';
          ctx.shadowBlur = 6;
        }

        ctx.fill();
        if (!isDark) {
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Flower Center (Pistil/Stamens)
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#fef08a' : '#f59e0b';
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw single petal
    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const scaleX = Math.cos(p.flipAngle);
      ctx.scale(scaleX, 1);
      ctx.globalAlpha = p.opacity;

      const r = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.bezierCurveTo(r * 0.6, -r * 0.6, r * 0.6, r * 0.6, 0, r);
      ctx.bezierCurveTo(-r * 0.6, r * 0.6, -r * 0.6, -r * 0.6, 0, -r);

      if (isDark) {
        ctx.fillStyle = 'rgba(167, 243, 208, 0.85)';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 6;
      } else {
        const grad = ctx.createLinearGradient(0, -r, 0, r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.7, '#f0fdf4');
        grad.addColorStop(1, '#a7f3d0');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.2)';
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      ctx.restore();
    };

    // Helper: Draw fresh spring green leaf
    const drawLeaf = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const scaleX = Math.cos(p.flipAngle);
      ctx.scale(scaleX, 1);
      ctx.globalAlpha = p.opacity;

      const w = p.size;
      const h = p.size * 1.6;

      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.quadraticCurveTo(w, -h / 4, 0, h / 2);
      ctx.quadraticCurveTo(-w, -h / 4, 0, -h / 2);

      if (isDark) {
        const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(1, '#059669');
        ctx.fillStyle = grad;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 6;
      } else {
        const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
        grad.addColorStop(0, '#86efac');
        grad.addColorStop(0.5, '#22c55e');
        grad.addColorStop(1, '#15803d');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.25)';
        ctx.shadowBlur = 5;
      }
      ctx.fill();

      // Leaf central vein
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(0, h / 2);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    // Helper: Draw floating pollen/sparkle/firefly
    const drawSparkle = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const pulse = (Math.sin(p.phase) + 1) * 0.5;
      ctx.globalAlpha = p.opacity * (0.4 + 0.6 * pulse);

      ctx.beginPath();
      ctx.arc(0, 0, p.size * (0.8 + 0.4 * pulse), 0, Math.PI * 2);

      if (isDark) {
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 6;
      }
      ctx.fill();
      ctx.restore();
    };

    // Animation Loop
    let lastTime = performance.now();
    const render = (time) => {
      const dt = Math.min((time - lastTime) / 16.6, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics
        p.phase += p.swaySpeed * dt;
        p.y += p.speedY * dt;
        p.x += (Math.sin(p.phase) * p.swayDistance + p.speedX) * dt;
        p.angle += p.angularSpeed * dt;
        p.flipAngle += p.flipSpeed * dt;

        // Draw particle
        if (p.type === 'flower') drawFlower(p);
        else if (p.type === 'petal') drawPetal(p);
        else if (p.type === 'leaf') drawLeaf(p);
        else if (p.type === 'sparkle') drawSparkle(p);

        // Recycle if moved out of bounds
        if (p.y > height + 40 || p.x < -60 || p.x > width + 60) {
          particles[i] = createParticle(-20);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background canvas for floating petals, flowers, leaves, and fireflies */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Top Left Spring Floral Branch Garland Silhouette */}
      <div 
        className={`absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-44 sm:w-64 h-44 sm:h-64 transition-opacity duration-700 pointer-events-none opacity-85 select-none ${
          isDark ? 'drop-shadow-[0_8px_24px_rgba(16,185,129,0.35)]' : 'drop-shadow-[0_8px_20px_rgba(16,185,129,0.2)]'
        }`}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full animate-[gentleSway_6s_ease-in-out_infinite]">
          {/* Branch */}
          <path d="M-10,-10 C40,20 80,45 130,55 C160,60 185,50 200,65" stroke={isDark ? "#064e3b" : "#15803d"} strokeWidth="5" strokeLinecap="round" />
          <path d="M40,20 C50,55 70,80 90,110" stroke={isDark ? "#064e3b" : "#166534"} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80,45 C95,30 120,25 150,20" stroke={isDark ? "#064e3b" : "#166534"} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Leaves */}
          <ellipse cx="65" cy="30" rx="14" ry="7" transform="rotate(-25 65 30)" fill={isDark ? "#10b981" : "#22c55e"} />
          <ellipse cx="115" cy="50" rx="16" ry="8" transform="rotate(15 115 50)" fill={isDark ? "#34d399" : "#4ade80"} />
          <ellipse cx="75" cy="85" rx="12" ry="6" transform="rotate(45 75 85)" fill={isDark ? "#059669" : "#16a34a"} />
          <ellipse cx="150" cy="40" rx="15" ry="7" transform="rotate(-15 150 40)" fill={isDark ? "#10b981" : "#22c55e"} />
          
          {/* Spring Blossom Flowers (White with golden center) */}
          <g transform="translate(90, 48)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx={Math.cos((deg * Math.PI) / 180) * 10} cy={Math.sin((deg * Math.PI) / 180) * 10} r="6.5" fill={isDark ? "#e6fffa" : "#ffffff"} />
            ))}
            <circle cx="0" cy="0" r="4" fill={isDark ? "#34d399" : "#f59e0b"} />
          </g>

          <g transform="translate(145, 60)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx={Math.cos((deg * Math.PI) / 180) * 8} cy={Math.sin((deg * Math.PI) / 180) * 8} r="5" fill={isDark ? "#e6fffa" : "#ffffff"} />
            ))}
            <circle cx="0" cy="0" r="3" fill={isDark ? "#34d399" : "#f59e0b"} />
          </g>

          <g transform="translate(55, 65)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx={Math.cos((deg * Math.PI) / 180) * 7} cy={Math.sin((deg * Math.PI) / 180) * 7} r="4.5" fill={isDark ? "#e6fffa" : "#ffffff"} />
            ))}
            <circle cx="0" cy="0" r="2.8" fill={isDark ? "#34d399" : "#f59e0b"} />
          </g>
        </svg>
      </div>

      {/* Top Right Spring Floral Branch Garland Silhouette */}
      <div 
        className={`absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-44 sm:w-64 h-44 sm:h-64 transition-opacity duration-700 pointer-events-none opacity-85 select-none ${
          isDark ? 'drop-shadow-[0_8px_24px_rgba(16,185,129,0.35)]' : 'drop-shadow-[0_8px_20px_rgba(16,185,129,0.2)]'
        }`}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full scale-x-[-1] animate-[gentleSway_7s_ease-in-out_infinite_reverse]">
          <path d="M-10,-10 C40,20 80,45 130,55 C160,60 185,50 200,65" stroke={isDark ? "#064e3b" : "#15803d"} strokeWidth="5" strokeLinecap="round" />
          <path d="M40,20 C50,55 70,80 90,110" stroke={isDark ? "#064e3b" : "#166534"} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80,45 C95,30 120,25 150,20" stroke={isDark ? "#064e3b" : "#166534"} strokeWidth="2.5" strokeLinecap="round" />
          
          <ellipse cx="65" cy="30" rx="14" ry="7" transform="rotate(-25 65 30)" fill={isDark ? "#10b981" : "#22c55e"} />
          <ellipse cx="115" cy="50" rx="16" ry="8" transform="rotate(15 115 50)" fill={isDark ? "#34d399" : "#4ade80"} />
          <ellipse cx="75" cy="85" rx="12" ry="6" transform="rotate(45 75 85)" fill={isDark ? "#059669" : "#16a34a"} />
          
          <g transform="translate(90, 48)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx={Math.cos((deg * Math.PI) / 180) * 10} cy={Math.sin((deg * Math.PI) / 180) * 10} r="6.5" fill={isDark ? "#e6fffa" : "#ffffff"} />
            ))}
            <circle cx="0" cy="0" r="4" fill={isDark ? "#34d399" : "#f59e0b"} />
          </g>

          <g transform="translate(130, 52)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx={Math.cos((deg * Math.PI) / 180) * 7.5} cy={Math.sin((deg * Math.PI) / 180) * 7.5} r="4.8" fill={isDark ? "#e6fffa" : "#ffffff"} />
            ))}
            <circle cx="0" cy="0" r="3" fill={isDark ? "#34d399" : "#f59e0b"} />
          </g>
        </svg>
      </div>

      {/* Atmospheric Ambient Glow Layer */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isDark 
            ? 'bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18)_0%,_transparent_60%)]' 
            : 'bg-[radial-gradient(ellipse_at_50%_0%,_rgba(52,211,153,0.30)_0%,_rgba(254,240,138,0.16)_35%,_transparent_70%)]'
        }`} 
      />
    </div>
  );
}
