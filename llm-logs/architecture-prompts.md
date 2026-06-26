# LLM Logs — System Architecture & Orchestration

This log documents prompts and architecture decisions related to the multi-agent LangGraph workflow orchestration.

---

## 1. LangGraph State & Agent Synthesis Prompt

### Prompt
> We are building an investment committee research pipeline using LangGraph.ts. Design a unified graph state interface `InvestmentState` containing: `companyName`, `researchData`, `financialData`, `financialAnalysis`, `newsAnalysis`, `riskAnalysis`, `committeeDecision`, `errors`, and `warnings`. Define five sequential agents: ResearchAgent (resolves profile), FinancialAgent (calculates metrics), NewsAgent (scores sentiment), RiskAgent (detects threats), and CommitteeAgent (synthesis). Each agent must receive the shared state, call specialized services, run LLM validation, and update the state. The final agent should output a binary decision of INVEST or PASS with confidence scores.

### Purpose
To organize the pipeline according to LangGraph orchestration principles, keeping execution decoupled and state changes transparent.

### Summary
Established strict state interfaces in `types/agents.ts` and set up the sequential StateGraph structure in `agents/graph.ts` linking the agents together.

---

## 2. Investment Committee Agent Prompts

### Prompt
> Design the prompt for the Investment Committee Agent. It should act as a technical chairperson receiving all resolved information from:
> 1. Company Profile (Research Agent)
> 2. Key Metrics & Financial Strengths (Financial Agent)
> 3. Media Sentiment & Opportunistic Themes (News Agent)
> 4. Red Flags & Vulnerabilities (Risk Agent)
> Synthesize this information and make a binary investment decision: INVEST or PASS. You must strictly output JSON matching the `CommitteeReport` schema. Be objective, weigh the risk score against the growth metrics, and assign a confidence rating (0 to 100). Do not use neutral HOLD options.

### Purpose
To ensure the LLM behaves as a synthesising decision maker rather than a repeating analyzer, providing high-quality, structured output.

### Summary
Wrote a comprehensive markdown instruction template in `agents/committeeAgent.ts` utilizing JSON schema validation constraints to guarantee formatting.
