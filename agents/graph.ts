/**
 * LangGraph StateGraph — Investment Research Workflow
 *
 * Wires all five agents into a sequential graph:
 * researchAgent → financialAgent → newsAgent → riskAgent → committeeAgent
 *
 * Exposes:
 *   runInvestmentWorkflow(companyName, onStepEvent) → InvestmentGraphState
 */

import { StateGraph, Annotation } from "@langchain/langgraph";
import type { InvestmentGraphState, AgentError } from "@/types/agents";
import { researchAgent } from "./researchAgent";
import { financialAgent } from "./financialAgent";
import { newsAgent } from "./newsAgent";
import { riskAgent } from "./riskAgent";
import { committeeAgent } from "./committeeAgent";

// ────────────────────────────────────────────────────────────
// LangGraph State Annotation
// ────────────────────────────────────────────────────────────

const GraphState = Annotation.Root({
  companyName: Annotation<string>({
    reducer: (_, b) => b,
    default: () => "",
  }),
  ticker: Annotation<string | undefined>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  companyProfile: Annotation<InvestmentGraphState["companyProfile"]>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  financialData: Annotation<InvestmentGraphState["financialData"]>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  newsAnalysis: Annotation<InvestmentGraphState["newsAnalysis"]>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  riskAssessment: Annotation<InvestmentGraphState["riskAssessment"]>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  committeeReport: Annotation<InvestmentGraphState["committeeReport"]>({
    reducer: (_, b) => b,
    default: () => undefined,
  }),
  errors: Annotation<AgentError[]>({
    reducer: (a, b) => [...(a ?? []), ...(b ?? [])],
    default: () => [],
  }),
  timestamps: Annotation<Record<string, number>>({
    reducer: (a, b) => ({ ...(a ?? {}), ...(b ?? {}) }),
    default: () => ({}),
  }),
});

// ────────────────────────────────────────────────────────────
// Graph Definition
// ────────────────────────────────────────────────────────────

function buildGraph() {
  const graph = new StateGraph(GraphState)
    .addNode("researchAgent", researchAgent)
    .addNode("financialAgent", financialAgent)
    .addNode("newsAgent", newsAgent)
    .addNode("riskAgent", riskAgent)
    .addNode("committeeAgent", committeeAgent)
    .addEdge("__start__", "researchAgent")
    .addEdge("researchAgent", "financialAgent")
    .addEdge("financialAgent", "newsAgent")
    .addEdge("newsAgent", "riskAgent")
    .addEdge("riskAgent", "committeeAgent")
    .addEdge("committeeAgent", "__end__");

  return graph.compile();
}

// Singleton compiled graph
let compiledGraph: ReturnType<typeof buildGraph> | null = null;

function getGraph() {
  if (!compiledGraph) {
    compiledGraph = buildGraph();
  }
  return compiledGraph;
}

// ────────────────────────────────────────────────────────────
// Step Event Callback Type
// ────────────────────────────────────────────────────────────

export type StepEventCallback = (
  event: "step_start" | "step_complete",
  node: string,
  message: string
) => void;

// Human-readable labels for each agent node
const NODE_LABELS: Record<string, string> = {
  researchAgent: "Researching Company",
  financialAgent: "Analyzing Financials",
  newsAgent: "Scanning News",
  riskAgent: "Assessing Risk",
  committeeAgent: "Investment Committee",
};

// ────────────────────────────────────────────────────────────
// Main Workflow Runner
// ────────────────────────────────────────────────────────────

export async function runInvestmentWorkflow(
  companyName: string,
  onStep?: StepEventCallback
): Promise<InvestmentGraphState> {
  const graph = getGraph();
  const startTime = Date.now();

  const initialState: Partial<InvestmentGraphState> = {
    companyName: companyName.trim(),
    errors: [],
    timestamps: { workflowStart: startTime },
  };

  // Stream events from the graph to fire callbacks
  const stream = await graph.stream(initialState, {
    streamMode: "updates",
  });

  let finalState: Partial<InvestmentGraphState> = { ...initialState };

  for await (const update of stream) {
    for (const [nodeName, nodeOutput] of Object.entries(update)) {
      const label = NODE_LABELS[nodeName] ?? nodeName;

      // Fire start event (we approximate start before we get the update)
      onStep?.("step_start", nodeName, `${label}...`);

      // Merge update into state
      finalState = { ...finalState, ...(nodeOutput as Partial<InvestmentGraphState>) };

      // Fire complete event
      onStep?.("step_complete", nodeName, `${label} complete`);
    }
  }

  return finalState as InvestmentGraphState;
}
