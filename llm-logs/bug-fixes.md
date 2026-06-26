# LLM Logs — Bug Fixes & Troubleshooting

This log documents critical engineering bugs identified during build/compilation and their technical solutions.

---

## 1. Yahoo Finance 2 Server External Packages Module Resolution

### Bug
When importing `yahoo-finance2`, the Next.js bundler attempts to package it for client/edge bundles. This results in errors stating `Module not found: Can't resolve 'http'` or `net` modules, as they are Node-specific.

### Solution
Added `yahoo-finance2` to Next.js server external packages configurations in `next.config.ts` and set the analysis route runtime target explicitly to `nodejs`.

```ts
// next.config.ts
const nextConfig = {
  serverExternalPackages: ["yahoo-finance2"],
};
export default nextConfig;
```

---

## 2. Recharts Window Is Undefined Hydration Match

### Bug
Since Recharts references the client-side `window` object (for calculations in responsive containers and tooltips), rendering them directly in SSR (Server-Side Rendering) components results in hydration mismatch errors: `"window is not defined"`.

### Solution
Wrapped standard rendering logic or imported Recharts modules dynamically, or used simple check-guarding (`"use client"` combined with local client mounting logic) to bypass node hydration.

```tsx
// RiskRadar.tsx
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return <LoadingSkeleton />;
```

---

## 3. SSE Chunk Buffering & Truncation

### Bug
When streaming Events via SSE (Server-Sent Events), chunks get buffered and parsed incorrectly in the client hook if they arrive split across network buffers. This causes `SyntaxError: Unexpected end of JSON input` in `JSON.parse`.

### Solution
Modified `useAnalysis.ts` to accumulate chunks in a buffer string, splits them by double-newlines `\n\n`, and holds onto the last (potentially incomplete) line for the next chunk read, resolving the streaming parser mismatch.
