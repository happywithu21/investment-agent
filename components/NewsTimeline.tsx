"use client";

import { ExternalLink, Newspaper } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsAnalysis, NewsArticle, SentimentLabel } from "@/types/agents";

interface NewsTimelineProps { news: NewsAnalysis }

const SENT_CFG: Record<SentimentLabel, { label: string; color: string; dim: string }> = {
  positive: { label: "Positive", color: "var(--invest)",  dim: "var(--invest-dim)"  },
  neutral:  { label: "Neutral",  color: "var(--text-3)",  dim: "rgba(255,255,255,0.04)" },
  negative: { label: "Negative", color: "var(--pass)",    dim: "var(--pass-dim)"    },
};

function ArticleRow({ article }: { article: NewsArticle }) {
  const cfg = SENT_CFG[article.sentiment];
  const Icon = article.sentiment === "positive" ? TrendingUp
             : article.sentiment === "negative" ? TrendingDown : Minus;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "10px 12px",
        padding: "11px 0",
        borderBottom: "1px solid var(--border)",
        alignItems: "center",
      }}
    >
      {/* Sentiment pip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24 }}>
        <div
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: cfg.dim, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={11} color={cfg.color} />
        </div>
      </div>

      {/* Content */}
      <div style={{ minWidth: 0 }}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13, fontWeight: 500, color: "var(--text-1)",
            lineHeight: 1.35,
            textDecoration: "none",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-1)")}
        >
          {article.title}
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ fontSize: 11, color: "var(--text-4)" }}>{article.source}</span>
          <span style={{ width: 2, height: 2, borderRadius: "50%", background: "var(--text-4)" }} />
          <span style={{ fontSize: 11, color: "var(--text-4)" }}>
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 11, fontWeight: 600,
            color: cfg.color,
            fontFamily: "var(--font-mono)",
          }}
        >
          {article.sentimentScore > 0 ? "+" : ""}{article.sentimentScore.toFixed(2)}
        </span>
        <ExternalLink size={10} color="var(--text-4)" />
      </div>
    </div>
  );
}

export function NewsTimeline({ news }: NewsTimelineProps) {
  return (
    <div className="card animate-fade-up delay-2" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Newspaper size={14} color="var(--accent)" />
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", flex: 1 }}>
          News Intelligence
        </p>

        {news.status === "available" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Sentiment stacked bar */}
            <div style={{ display: "flex", height: 4, width: 80, borderRadius: 99, overflow: "hidden", gap: 1 }}>
              {news.positiveCount > 0 && (
                <div style={{ flex: news.positiveCount, background: "var(--invest)", borderRadius: 99 }} />
              )}
              {news.neutralCount > 0 && (
                <div style={{ flex: news.neutralCount, background: "var(--text-4)", borderRadius: 99 }} />
              )}
              {news.negativeCount > 0 && (
                <div style={{ flex: news.negativeCount, background: "var(--pass)", borderRadius: 99 }} />
              )}
            </div>
            <span
              style={{
                fontSize: 12, fontWeight: 600,
                color: news.overallSentiment === "positive" ? "var(--invest)"
                     : news.overallSentiment === "negative" ? "var(--pass)"
                     : "var(--text-3)",
              }}
            >
              {news.overallSentiment.charAt(0).toUpperCase() + news.overallSentiment.slice(1)}
            </span>
          </div>
        ) : (
          <span className="badge badge-warn">Unavailable</span>
        )}
      </div>

      <div style={{ padding: "0 18px" }}>
        {news.status === "unavailable" ? (
          <div
            style={{
              margin: "16px 0",
              padding: "12px 14px",
              background: "var(--warn-dim)",
              border: "1px solid var(--warn-border)",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 13, color: "var(--text-2)" }}>
              ⚠️ {news.warning ?? "News data unavailable, recommendation based on available information."}
            </p>
          </div>
        ) : (
          <>
            {/* Key themes */}
            {news.keyThemes.length > 0 && (
              <div style={{ paddingTop: 12, display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 4 }}>
                {news.keyThemes.map((t) => (
                  <span key={t} className="badge badge-neutral" style={{ fontSize: 10.5 }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Articles */}
            <div>
              {news.articles.map((a) => (
                <ArticleRow key={a.url} article={a} />
              ))}
            </div>

            {/* Counts footer */}
            <div
              style={{
                display: "flex", gap: 16,
                padding: "10px 0",
                fontSize: 11.5, color: "var(--text-4)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--invest)" }} />
                {news.positiveCount} positive
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-4)" }} />
                {news.neutralCount} neutral
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pass)" }} />
                {news.negativeCount} negative
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
