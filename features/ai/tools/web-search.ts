import { tool } from "ai";
import { z } from "zod";

/**
 * Searches the web for real-time information, news, current events, and live data.
 * Uses Tavily API when TAVILY_API_KEY is available in .env, with zero-setup DuckDuckGo fallback.
 */
async function performSearch(query: string) {
  // 1. Tavily API (if configured in .env)
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (tavilyKey) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          max_results: 5,
          search_depth: "basic",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.results.map((r: any) => ({
          title: r.title,
          content: r.content,
          url: r.url,
        }));
      }
    } catch (err) {
      console.error("Tavily search failed, falling back to DuckDuckGo:", err);
    }
  }

  // 2. DuckDuckGo Real-Time Search (Free, zero setup required)
  try {
    const res = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    if (!res.ok) {
      return [{ title: "Search Error", snippet: `Failed to fetch search results (${res.status})` }];
    }

    const html = await res.text();
    const results: Array<{ title: string; snippet: string; url?: string }> = [];

    const resultBlockRegex =
      /<a class="result__url"[^>]*href="([^"]*)"[^>]*>[\s\S]*?<\/a>[\s\S]*?<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match: RegExpExecArray | null;

    while ((match = resultBlockRegex.exec(html)) !== null && results.length < 5) {
      const rawUrl = match[1];
      const matchUrl = rawUrl.match(/uddg=([^&]+)/);
      const url = matchUrl ? decodeURIComponent(matchUrl[1]) : rawUrl;
      const snippet = match[2]
        .replace(/<[^>]+>/g, "")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, "&")
        .trim();

      results.push({
        title: query,
        snippet,
        url,
      });
    }

    if (results.length > 0) {
      return results;
    }

    // 3. Fallback: DuckDuckGo Instant Answer API
    const instantRes = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    if (instantRes.ok) {
      const data = await instantRes.json();
      if (data.AbstractText) {
        return [{ title: data.Heading || query, snippet: data.AbstractText, url: data.AbstractURL }];
      }
      if (Array.isArray(data.RelatedTopics) && data.RelatedTopics.length > 0) {
        return data.RelatedTopics.slice(0, 4)
          .filter((t: any) => t.Text)
          .map((t: any) => ({
            title: query,
            snippet: t.Text,
            url: t.FirstURL,
          }));
      }
    }

    return [{ title: query, snippet: "No web results found for this search query." }];
  } catch (error: any) {
    console.error("Web search error:", error);
    return [{ title: "Search Error", snippet: error?.message || "Failed to complete web search." }];
  }
}

export const webSearchTool = tool({
  description:
    "Searches the web for real-time information, current news, live facts, weather, and up-to-date data on any topic.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The search query or keyword phrase to find real-time information on the internet"),
  }),
  execute: async ({ query }: { query: string }) => {
    const results = await performSearch(query);
    return { query, results };
  },
});
