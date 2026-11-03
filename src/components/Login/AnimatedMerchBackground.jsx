import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function AnimatedMerchBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
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

    // Mouse tracking for interactive thread deflection
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Core apparel merchandising domain modules
    const merchModules = [
      {
        icon: '✂️',
        title: 'Marker Order',
        badge: 'CUTTING YIELD',
        metric: 'Efficiency: 89.4%',
        sub: 'Plies: 48 • Ratio 2:3:2:1',
        color: isDark ? '#38bdf8' : '#0284c7',
      },
      {
        icon: '📐',
        title: 'Marker Ratio',
        badge: 'SIZE BALANCE',
        metric: 'Ratio: S:1 M:2 L:2 XL:1',
        sub: 'Cut Plan • Zero Waste',
        color: isDark ? '#818cf8' : '#4f46e5',
      },
      {
        icon: '🧶',
        title: 'Fabric Consumption',
        badge: 'YARDAGE / DZN',
        metric: '1.42 Yds / Garment',
        sub: 'Width: 58" • Shrinkage 3%',
        color: isDark ? '#34d399' : '#059669',
      },
      {
        icon: '🧵',
        title: 'Thread Consumption',
        badge: 'SPI & CONES',
        metric: '128.5 m / Piece',
        sub: '14 SPI • 40/2 Polyester',
        color: isDark ? '#f472b6' : '#db2777',
      },
      {
        icon: '⏱️',
        title: 'GSD / SAM',
        badge: 'SEWING DATA',
        metric: 'SAM: 14.85 Mins',
        sub: 'Pitch: 0.82 • Target: 420 pcs',
        color: isDark ? '#fbbf24' : '#d97706',
      },
      {
        icon: '👔',
        title: 'Sample Development',
        badge: 'PROTOTYPE',
        metric: 'Status: Approved (PP)',
        sub: 'TechPack Sync • Fit V2',
        color: isDark ? '#a78bfa' : '#7c3aed',
      },
      {
        icon: '📊',
        title: 'Order Allocation',
        badge: 'MERCH FLOW',
        metric: 'PO: #884920 YAI',
        sub: 'Shipment On-Schedule',
        color: isDark ? '#2dd4bf' : '#0d9488',
      },
    ];

    // Initialize floating nodes
    const nodes = merchModules.map((item, i) => {
      const angle = (i / merchModules.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.36;
      return {
        ...item,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 80,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        baseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.018,
        width: 175,
        height: 60,
      };
    });

    // Flowing thread paths (sewing stitches running across screen)
    const threadPaths = [
      { yRatio: 0.18, freq: 0.0018, amp: 45, speed: 0.008, dash: [10, 6], color: isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)' },
      { yRatio: 0.38, freq: 0.0014, amp: 60, speed: -0.006, dash: [6, 4], color: isDark ? 'rgba(167, 139, 250, 0.35)' : 'rgba(124, 58, 237, 0.25)' },
      { yRatio: 0.65, freq: 0.002, amp: 50, speed: 0.007, dash: [14, 8, 4, 8], color: isDark ? 'rgba(244, 114, 182, 0.3)' : 'rgba(219, 39, 119, 0.2)' },
      { yRatio: 0.84, freq: 0.0016, amp: 40, speed: -0.005, dash: [8, 5], color: isDark ? 'rgba(52, 211, 153, 0.35)' : 'rgba(5, 150, 105, 0.22)' },
    ];

    let time = 0;

    const render = () => {
      time += 1;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw dynamic ambient light orbs directly on canvas
      const orb1X = width * 0.2 + Math.sin(time * 0.008) * 90;
      const orb1Y = height * 0.22 + Math.cos(time * 0.006) * 70;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, 340);
      grad1.addColorStop(0, isDark ? 'rgba(167, 139, 250, 0.22)' : 'rgba(139, 92, 246, 0.22)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(orb1X, orb1Y, 340, 0, Math.PI * 2);
      ctx.fill();

      const orb2X = width * 0.82 + Math.cos(time * 0.007) * 80;
      const orb2Y = height * 0.78 + Math.sin(time * 0.009) * 70;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, 320);
      grad2.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.18)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, 320, 0, Math.PI * 2);
      ctx.fill();

      const orb3X = width * 0.72 + Math.sin(time * 0.01) * 60;
      const orb3Y = height * 0.32 + Math.cos(time * 0.008) * 50;
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 10, orb3X, orb3Y, 280);
      grad3.addColorStop(0, isDark ? 'rgba(52, 211, 153, 0.16)' : 'rgba(5, 150, 105, 0.15)');
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(orb3X, orb3Y, 280, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw flowing sewing threads with dashed stitches
      threadPaths.forEach((tp) => {
        ctx.beginPath();
        ctx.setLineDash(tp.dash);
        ctx.lineDashOffset = -time * (tp.speed * 80);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = tp.color;

        const baseY = height * tp.yRatio;

        for (let x = 0; x <= width; x += 12) {
          let y = baseY + Math.sin(x * tp.freq + time * tp.speed) * tp.amp;

          // Interactive deflection from mouse
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180) {
              const force = (1 - dist / 180) * 35;
              y += (dy / dist) * force;
            }
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // 3. Connecting dashed threads between nearby nodes
      ctx.setLineDash([4, 4]);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 260) {
            const alpha = (1 - dist / 260) * (isDark ? 0.35 : 0.22);
            ctx.strokeStyle = isDark ? `rgba(167, 139, 250, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Render floating merchandising data cards
      ctx.setLineDash([]);
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Keep inside bounds with smooth bounce margin
        const margin = 80;
        if (node.x < margin) { node.x = margin; node.vx *= -1; }
        if (node.x > width - margin) { node.x = width - margin; node.vx *= -1; }
        if (node.y < margin) { node.y = margin; node.vy *= -1; }
        if (node.y > height - margin) { node.y = height - margin; node.vy *= -1; }

        const floatOffsetY = Math.sin(time * node.pulseSpeed + node.baseAngle) * 6;
        const currentY = node.y + floatOffsetY;

        const mouseDist = Math.hypot(node.x - mouse.x, currentY - mouse.y);
        const isHovered = mouseDist < 120;

        // Push away from center where the login form card is positioned
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.hypot(node.x - centerX, currentY - centerY);
        if (distFromCenter < 250) {
          const angleFromCenter = Math.atan2(currentY - centerY, node.x - centerX);
          node.x += Math.cos(angleFromCenter) * 0.85;
          node.y += Math.sin(angleFromCenter) * 0.85;
        }

        // Draw Card Background
        const cardW = node.width;
        const cardH = node.height;
        const cardX = node.x - cardW / 2;
        const cardY = currentY - cardH / 2;
        const radius = 10;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, radius);

        ctx.fillStyle = isDark
          ? (isHovered ? 'rgba(30, 41, 59, 0.88)' : 'rgba(15, 23, 42, 0.72)')
          : (isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.82)');
        ctx.fill();

        ctx.lineWidth = isHovered ? 1.8 : 1;
        ctx.strokeStyle = isHovered ? node.color : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)');
        ctx.stroke();

        // Corner stitch detail lines
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cardX + 4, cardY + 2);
        ctx.lineTo(cardX + 12, cardY + 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cardX + cardW - 12, cardY + cardH - 2);
        ctx.lineTo(cardX + cardW - 4, cardY + cardH - 2);
        ctx.stroke();

        // Icon
        ctx.font = '16px system-ui, sans-serif';
        ctx.fillText(node.icon, cardX + 10, cardY + 24);

        // Badge
        ctx.font = 'bold 9px system-ui, sans-serif';
        ctx.fillStyle = node.color;
        ctx.fillText(node.badge, cardX + 34, cardY + 16);

        // Title
        ctx.font = '600 12px system-ui, sans-serif';
        ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
        ctx.fillText(node.title, cardX + 34, cardY + 31);

        // Metric
        ctx.font = '500 10.5px system-ui, monospace';
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.fillText(node.metric, cardX + 10, cardY + 49);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Slow pan & zoom for the background image; scale stays above 1 so its edges never show */}
      <style>{`
        @keyframes loginBgDrift {
          from { transform: scale(1.03) translate(0, 0); }
          to { transform: scale(1.12) translate(-1.5%, -1%); }
        }
        .login-bg-image {
          animation: loginBgDrift 30s ease-in-out infinite alternate;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .login-bg-image { animation: none; }
        }
      `}</style>

      {/* Apparel Merchandising Background Image Layer */}
      <div
        className="login-bg-image"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/login_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isDark ? 0.38 : 0.68,
          filter: isDark ? 'brightness(0.65) contrast(1.1)' : 'brightness(1.02) saturate(1.05)',
          transition: 'opacity 0.4s ease, filter 0.4s ease',
        }}
      />

      {/* Tactile Textile Weave Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: isDark
            ? 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255, 255, 255, 0.025) 5px, rgba(255, 255, 255, 0.025) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255, 255, 255, 0.025) 5px, rgba(255, 255, 255, 0.025) 6px)'
            : 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(15, 23, 42, 0.02) 5px, rgba(15, 23, 42, 0.02) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(15, 23, 42, 0.02) 5px, rgba(15, 23, 42, 0.02) 6px)',
          opacity: 0.9,
        }}
      />

      {/* Interactive 60fps Canvas for Thread Stitches, Glowing Orbs & Merch Nodes */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
}
