"use client";

import { useEffect, useRef } from "react";

const NODES = [
  { id: "research",  label: "Research",  emoji: "🔍", angle: 270, color: "#3b82f6", delay: 0 },
  { id: "financial", label: "Financial", emoji: "📊", angle: 342, color: "#8b5cf6", delay: 0.8 },
  { id: "news",      label: "News",      emoji: "📰", angle: 54,  color: "#06b6d4", delay: 1.6 },
  { id: "risk",      label: "Risk",      emoji: "⚠️",  angle: 126, color: "#f59e0b", delay: 2.4 },
  { id: "committee", label: "Committee", emoji: "🏛️", angle: 198, color: "#22c55e", delay: 3.2 },
];

const R  = 90;    // orbit radius
const CX = 160;   // svg center x
const CY = 160;   // svg center y
const SZ = 320;   // svg viewbox size

function toXY(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

export function HeroIllustration() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 340,
        aspectRatio: "1/1",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox={`0 0 ${SZ} ${SZ}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Orbit ring */}
        <circle
          cx={CX} cy={CY} r={R + 18}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <circle
          cx={CX} cy={CY} r={R - 20}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={1}
        />

        {/* Lines from center to each node */}
        {NODES.map((node) => {
          const { x, y } = toXY(node.angle, R);
          return (
            <line
              key={node.id + "-line"}
              x1={CX} y1={CY}
              x2={x}  y2={y}
              stroke={node.color}
              strokeWidth={1}
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="0 0"
                dur="0s"
              />
              <animate
                attributeName="stroke-dashoffset"
                from="0" to="-80"
                dur={`${2 + (NODES.indexOf(node) * 0.4)}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Central globe */}
        <circle
          cx={CX} cy={CY} r={38}
          fill="rgba(17,17,20,0.95)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
        {/* Globe latitude/longitude */}
        {[-20, 0, 20].map((dy) => (
          <ellipse
            key={dy}
            cx={CX} cy={CY + dy} rx={38} ry={Math.abs(dy) === 20 ? 28 : 38}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.8}
          />
        ))}
        <line x1={CX} y1={CY - 38} x2={CX} y2={CY + 38} stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
        <line x1={CX - 38} y1={CY} x2={CX + 38} y2={CY} stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />

        {/* Globe spinner ring */}
        <circle
          cx={CX} cy={CY} r={38}
          stroke="url(#globeGrad)"
          strokeWidth={1.5}
          strokeDasharray="40 200"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`360 ${CX} ${CY}`}
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* AI label in globe */}
        <text
          x={CX} y={CY - 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="rgba(255,255,255,0.6)"
          fontFamily="var(--font-mono, monospace)"
        >
          AI
        </text>
        <text
          x={CX} y={CY + 10}
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.3)"
          fontFamily="var(--font-mono, monospace)"
        >
          AGENT
        </text>

        {/* Agent nodes */}
        {NODES.map((node) => {
          const { x, y } = toXY(node.angle, R);
          return (
            <g key={node.id}>
              {/* Pulse ring */}
              <circle cx={x} cy={y} r={18} fill={node.color} fillOpacity={0.06}>
                <animate
                  attributeName="r"
                  values="18;22;18"
                  dur={`${3 + node.delay * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${node.delay}s`}
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.06;0.02;0.06"
                  dur={`${3 + node.delay * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${node.delay}s`}
                />
              </circle>

              {/* Node circle */}
              <circle
                cx={x} cy={y} r={15}
                fill="var(--surface, #18181b)"
                stroke={node.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />

              {/* Float animation */}
              <text
                x={x} y={y + 5}
                textAnchor="middle"
                fontSize="12"
              >
                {node.emoji}
                <animate
                  attributeName="y"
                  values={`${y + 5};${y + 1};${y + 5}`}
                  dur={`${3.5 + node.delay * 0.15}s`}
                  repeatCount="indefinite"
                  begin={`${node.delay * 0.3}s`}
                />
              </text>

              {/* Label below node */}
              <text
                x={x}
                y={y + (node.angle > 90 && node.angle < 270 ? -22 : 30)}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="600"
                fill={node.color}
                fillOpacity={0.8}
                fontFamily="var(--font-sans, sans-serif)"
                letterSpacing="0.04em"
              >
                {node.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
