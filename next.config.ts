import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // Keep LangGraph and Yahoo Finance on Node.js runtime, off the client bundle
  serverExternalPackages: [
    "langchain",
    "@langchain/core",
    "@langchain/google-genai",
    "@langchain/langgraph",
    "@langchain/community",
    "yahoo-finance2",
  ],
};

export default nextConfig;
