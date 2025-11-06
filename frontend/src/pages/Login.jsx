import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";

export default function Login() {
  const canvasRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- Canvas Background -----------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const formZone = { top: height * 0.3, bottom: height * 0.7 };
    const symbols = [
      "{ }", "O(n)", "λ", "∑", "⊕", "→", "⊂", "⊆", "π", "√", "if", "else", "DFS", "BFS", "stack", "queue"
    ];

    const bands = [
      { yMin: 0, yMax: formZone.top, count: 10 },
      { yMin: formZone.bottom, yMax: height * 0.85, count: 15 },
      { yMin: height * 0.85, yMax: height, count: 10 }
    ];

    const particles = [];
    bands.forEach((band) => {
      for (let i = 0; i < band.count; i++) {
        particles.push({
          baseX: Math.random() * width,
          baseY: band.yMin + Math.random() * (band.yMax - band.yMin),
          x: 0,
          y: 0,
          size: 16 + Math.random() * 12,
          driftRadius: 8 + Math.random() * 12,
          speed: 0.002 + Math.random() * 0.004,
          angle: Math.random() * Math.PI * 2,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          hue: 160 + Math.random() * 80,
          opacity: 0.2 + Math.random() * 0.5,
        });
      }
    });

    const shapes = [
      { type: "stack", baseX: width * 0.1, baseY: height * 0.1, drift: 10 },
      { type: "tree", baseX: width * 0.85, baseY: height * 0.15, drift: 15 },
      { type: "linkedlist", baseX: width * 0.5, baseY: height * 0.75, drift: 15 },
    ];

    shapes.forEach((s) => {
      s.angle = Math.random() * Math.PI * 2;
      s.speed = 0.002 + Math.random() * 0.003;
    });

    function drawStack(x, y, hue) {
      const boxWidth = 30;
      const boxHeight = 15;
      const layers = 4;
      for (let i = 0; i < layers; i++) {
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.6)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.strokeRect(x, y - i * (boxHeight + 4), boxWidth, boxHeight);
      }
    }

    function drawTree(x, y, hue) {
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.6)`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
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

    function drawLinkedList(x, y, hue) {
      const nodeWidth = 25;
      const nodeHeight = 20;
      const count = 5;
      const gap = 35;

      for (let i = 0; i < count; i++) {
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.6)`;
        ctx.shadowBlur = 8;
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
        p.x = p.baseX + Math.cos(p.angle) * p.driftRadius;
        p.y = p.baseY + Math.sin(p.angle) * p.driftRadius;
        ctx.save();
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      });

      shapes.forEach((s) => {
        s.angle += s.speed;
        const x = s.baseX + Math.cos(s.angle) * s.drift;
        const y = s.baseY + Math.sin(s.angle) * s.drift;
        const hue = 180 + Math.random() * 40;

        if (s.type === "stack") drawStack(x, y, hue);
        if (s.type === "tree") drawTree(x, y, hue);
        if (s.type === "linkedlist") drawLinkedList(x, y, hue);
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

  // ---------------- Handle Login -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username:username,
        password:password,
      });

      if (response.data && response.data.token) {
        // Save JWT token in localStorage
        localStorage.setItem("token", response.data.token);
        console.log("Login successful:", response.data);

        // Redirect to notebook/dashboard page
        navigate("/notebooks");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="background-canvas"></canvas>

      <div className="login-form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
