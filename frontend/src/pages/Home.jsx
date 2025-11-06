import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Expanded hero zone (avoid overlap)
    const heroZone = { top: height * 0.2, bottom: height * 0.6 };

    const symbols = [
      "{ }", "O(n)", "λ", "∑", "⊕", "→", "⊂", "⊆", "π", "√", "∫", "[]", "<>",
      "if", "else", "heap", "queue", "graph", "DFS", "BFS", "recursion"
    ];

    // Floating symbols avoiding hero zone
    const particles = Array.from({ length: 40 }).map(() => {
      let y;
      if (Math.random() < 0.5) y = Math.random() * heroZone.top;
      else y = heroZone.bottom + Math.random() * (height - heroZone.bottom);

      return {
        baseX: Math.random() * width,
        baseY: y,
        x: 0,
        y: 0,
        size: 18 + Math.random() * 14,
        driftRadius: 10 + Math.random() * 15,
        speed: 0.002 + Math.random() * 0.004,
        angle: Math.random() * Math.PI * 2,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        hue: 170 + Math.random() * 60,
        opacity: 0.2 + Math.random() * 0.5,
        glowPhase: Math.random() * Math.PI * 2,
      };
    });

    // Floating structures (edges only)
    const shapes = [
      { type: "stack", baseX: width * 0.15, baseY: height * 0.25, drift: 12 },
      { type: "tree", baseX: width * 0.85, baseY: height * 0.25, drift: 12 },
      { type: "linkedlist", baseX: width * 0.2, baseY: height * 0.75, drift: 14 },
      { type: "tree", baseX: width * 0.8, baseY: height * 0.75, drift: 14 },
      { type: "stack", baseX: width * 0.5, baseY: height * 0.9, drift: 10 },
    ];

    shapes.forEach((s) => {
      s.angle = Math.random() * Math.PI * 2;
      s.speed = 0.002 + Math.random() * 0.003;
    });

    function drawStack(x, y, hue, glow) {
      const boxWidth = 30;
      const boxHeight = 15;
      const layers = 4;
      ctx.lineWidth = 2;
      for (let i = 0; i < layers; i++) {
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${glow})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.strokeRect(x, y - i * (boxHeight + 4), boxWidth, boxHeight);
      }
    }

    function drawTree(x, y, hue, glow) {
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${glow})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

      const nodeR = 7;
      const yGap = 30;
      const xGap = 25;

      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI * 2);
      ctx.stroke();

      const left = { x: x - xGap, y: y + yGap };
      const right = { x: x + xGap, y: y + yGap };

      ctx.beginPath();
      ctx.moveTo(x, y + nodeR);
      ctx.lineTo(left.x, left.y - nodeR);
      ctx.moveTo(x, y + nodeR);
      ctx.lineTo(right.x, right.y - nodeR);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(left.x, left.y, nodeR, 0, Math.PI * 2);
      ctx.arc(right.x, right.y, nodeR, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawLinkedList(x, y, hue, glow) {
      const nodeWidth = 25;
      const nodeHeight = 20;
      const count = 5;
      const gap = 35;

      for (let i = 0; i < count; i++) {
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${glow})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.strokeRect(x + i * gap, y, nodeWidth, nodeHeight);

        if (i < count - 1) {
          ctx.beginPath();
          ctx.moveTo(x + i * gap + nodeWidth, y + nodeHeight / 2);
          ctx.lineTo(x + (i + 1) * gap, y + nodeHeight / 2);
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.angle += p.speed;
        p.glowPhase += 0.03;
        const glow = 0.4 + Math.sin(p.glowPhase) * 0.3;
        p.x = p.baseX + Math.cos(p.angle) * p.driftRadius;
        p.y = p.baseY + Math.sin(p.angle) * p.driftRadius;

        ctx.save();
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${glow})`;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      });

      shapes.forEach((s) => {
        s.angle += s.speed;
        const x = s.baseX + Math.cos(s.angle) * s.drift;
        const y = s.baseY + Math.sin(s.angle) * s.drift;
        const hue = 180 + Math.random() * 40;
        const glow = 0.5 + Math.sin(Date.now() * 0.001 + x) * 0.3;

        if (s.type === "stack") drawStack(x, y, hue, glow);
        if (s.type === "tree") drawTree(x, y, hue, glow);
        if (s.type === "linkedlist") drawLinkedList(x, y, hue, glow);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home-container">
      <canvas ref={canvasRef} className="background-canvas"></canvas>

      <header className="navbar">
        <div className="logo">DSA Visualizer</div>
        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn">Register</Link>
        </div>
      </header>

      <main className="hero">
        <h1>Master DSA through Visualization</h1>
        <p>Understand algorithms like never before — visualize, code, and learn efficiently.</p>
        <div className="hero-buttons">
          <Link to="/Visualize" className="primary-btn">Try Visualizer</Link>
          <Link to="/NotebookPage" className="secondary-btn">Go to Notebook</Link>
          <Link to="/Practice" className="primary-btn">Practice DSA</Link>
        </div>
      </main>
    </div>
  );
}

