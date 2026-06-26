# LLM Logs — Frontend Overhaul Prompts

This log documents prompts and iterations related to building a premium, custom dark-themed SaaS dashboard inspired by Vercel and Linear, using Tailwind CSS v4 and vanilla CSS tokens.

---

## 1. Design System CSS Tokens Configuration

### Prompt
> You are a Senior UI/UX Engineer. We are upgrading our global CSS to establish a cohesive, high-end dark theme inspired by Linear and Vercel. Focus on custom CSS variables (tokens) for background surface gradations (`#09090b`, `#111114`, `#18181b`), subtle borders (`rgba(255,255,255,0.07)`), clear typography weights (Outfit for headers, Inter for copy, JetBrains Mono for metrics), semantic accent indicators (invest vs. pass vs. warning), custom skeleton loaders, micro-animations for sliding headers, and clean responsive sidebar transitions. Generate `app/globals.css`.

### Purpose
To establish a rigid design system foundation before writing any visual components.

### Summary
Generates a complete CSS layout foundation, avoiding raw tailwind color names in favor of semantic CSS variable classes (`card`, `btn`, `btn-primary`, `badge`, `badge-invest`, `data-table`, `skeleton`, and animation tags).

---

## 2. Animated Orbiting SVG Node Graphic

### Prompt
> Create a React client component `HeroIllustration.tsx` that renders a responsive, high-end SVG orbiting graphic representing a multi-agent orchestration pipeline. The center should be a detailed wireframe globe with rotating latitude/longitude lines and an "AI AGENT" text marker. Orbiting around it should be 5 floating node circles (Research, Financial, News, Risk, Committee) styled with distinct accent colors, emoji icons, custom pulsing glow rings, and soft floating translations using SVG animations (`<animateTransform>` and `<animate>`). Keep lines connecting each node to the globe with flowing dash offsets representing data streams.

### Purpose
Creates a custom visual graphic for the landing and loading state, demonstrating engineering complexity rather than using generic stock illustrations.

### Summary
Built `components/home/HeroIllustration.tsx` featuring coordinate maths (`toXY` conversions), SVG animations, and dynamic pulsing shadows that automatically animate on the GPU.

---

## 3. SSE Stream Live Activity Feed Panel

### Prompt
> Create a component `AgentProgressPanel.tsx` that handles the rendering of LangGraph node execution. It should accept an array of `AgentProgressStep` containing agent ids, status ("pending" | "running" | "complete" | "error"), and runtime messages. Design this like a live developer activity feed. The running step should show an active loader spinner and a pulsing indicator; completed steps should show a green check; pending steps should look faded. Add vertical connector lines between icons that light up when the step completes.

### Purpose
To visualize the multi-agent LangGraph workflow execution in real time as SSE stream updates are received.

### Summary
Constructed `components/AgentProgressPanel.tsx` using Lucide icons, status-colored badges, and smooth container height animations.
