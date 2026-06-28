# Assignment Submission: AI Investment Research Agent

Hi Team,

Here are the links and documentation for my AI Investment Research Agent assignment:

- **Project ZIP Link:** https://drive.google.com/file/d/1YHjEtaF3dS3l1VNOIWFLSiVtbW0hTOcc/view?usp=sharing
- **Live Demo Site:** https://investment-agent-psi.vercel.app/
- **GitHub Repository:** https://github.com/happywithu21/investment-agent

---

### Overview & Documentation Summary

The detailed documentation is included in the project's `README.md` file inside the ZIP and repository. Here is a quick summary of what is covered:

1. **Overview:** A multi-agent investment research platform built with Next.js 15, LangGraph.js, and Gemini 2.5 Flash. It automates fundamental research, financial ratio analysis, news sentiment scoring, and risk assessment to generate structured `INVEST` or `PASS` decisions.
2. **How to Run It:** Simple setup steps using `npm install` and `npm run dev`. It includes an automatic zero-config demo mode as well as support for real API keys (`GOOGLE_API_KEY` and `NEWS_API_KEY`).
3. **Architecture & How It Works:** Uses a sequential 5-agent pipeline (Research Agent -> Financial Agent -> News Agent -> Risk Agent -> Investment Committee) streaming real-time updates via Server-Sent Events (SSE).
4. **Key Decisions & Trade-offs:** Focused on a clean responsive UI, robust error handling with market data fallbacks, and streaming state updates for fast user feedback.
5. **Example Runs:** Includes example analysis runs on companies like Tesla (`TSLA`), Apple (`AAPL`), Microsoft (`MSFT`), and Reliance (`RELIANCE`).
6. **Future Improvements:** Plans for parallel agent execution in LangGraph and vector search RAG over company financial filings (10-K/10-Q).
7. **Bonus - LLM Development Logs:** Includes prompt logs and development thought process documentation stored in the `/llm-logs` folder.
