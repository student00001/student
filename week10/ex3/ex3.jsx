import { useState, useEffect } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_PER_PAGE = 6;

// ─── helper ───────────────────────────────────────────────────────────────────
const excerpt = (text, max = 90) =>
  text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

// ═══════════════════════════════════════════════════════════════════════════════
// LoadingGrid – pulsing skeleton cards
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingGrid() {
  return (
    <div style={g.grid}>
      {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
        <div key={i} style={{ ...g.card, ...g.skeleton, animationDelay: `${i * 0.08}s` }}>
          <div style={g.skelLine1} />
          <div style={g.skelLine2} />
          <div style={g.skelLine3} />
          <div style={g.skelLine4} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:.45 }
          50%      { opacity:1 }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ErrorBanner – displays error state with retry callback
// ═══════════════════════════════════════════════════════════════════════════════
function ErrorBanner({ message, onRetry }) {
  return (
    <div style={g.errorWrap}>
      <div style={g.errorIcon}>⚠</div>
      <h2 style={g.errorTitle}>Something went wrong</h2>
      <p style={g.errorMsg}>{message}</p>
      <button style={g.retryBtn} onClick={onRetry}>↻ Retry</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PostCard – single post item (display-only, no logic)
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post, index }) {
  const hues = [210, 155, 25, 340, 270, 190];
  const hue  = hues[post.id % hues.length];

  return (
    <article
      style={{
        ...g.card,
        animationDelay: `${index * 0.07}s`,
        "--hue": hue,
      }}
    >
      {/* accent bar */}
      <div style={{ ...g.accentBar, background: `hsl(${hue},72%,52%)` }} />

      {/* user badge */}
      <span style={{ ...g.badge, background: `hsl(${hue},60%,94%)`, color: `hsl(${hue},55%,38%)` }}>
        User #{post.userId}
      </span>

      {/* post id chip */}
      <span style={g.idChip}>#{post.id}</span>

      {/* title */}
      <h3 style={g.cardTitle}>{post.title}</h3>

      {/* body */}
      <p style={g.cardBody}>{excerpt(post.body)}</p>

      {/* footer */}
      <div style={g.cardFooter}>
        <span style={g.readMore}>Read more →</span>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PostGrid – list rendering with map() + unique key
// ═══════════════════════════════════════════════════════════════════════════════
function PostGrid({ posts }) {
  return (
    <div style={g.grid}>
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} />   // ← unique key
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// App – root component; owns all state and side-effect logic
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── state ────────────────────────────────────────────────────────────────────
  const [posts,   setPosts]   = useState([]);          // fetched data
  const [loading, setLoading] = useState(true);        // loading flag
  const [error,   setError]   = useState(null);        // error message or null
  const [page,    setPage]    = useState(1);           // current page
  const [search,  setSearch]  = useState("");          // search query
  const [fetchCount, setFetchCount] = useState(0);     // trigger for retry

  // ── side effect: fetch once on mount (empty dep array) ───────────────────────
  useEffect(() => {
    let cancelled = false;   // cleanup flag to avoid state updates on unmount

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();   // async/await JSON parse

        if (!cancelled) {
          setPosts(data);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch posts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();

    // cleanup: cancel stale responses if component unmounts
    return () => { cancelled = true; };
  }, [fetchCount]);   // ← [] means run once on mount; fetchCount triggers retry

  // ── derived data ─────────────────────────────────────────────────────────────
  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleRetry  = () => setFetchCount((n) => n + 1);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={g.page}>
      {/* ── decorative background blobs ── */}
      <div style={g.blob1} />
      <div style={g.blob2} />

      {/* ── header ── */}
      <header style={g.header}>
        <div style={g.logoRow}>
          <span style={g.logoIcon}>◈</span>
          <span style={g.logoText}>Post<strong>Explorer</strong></span>
        </div>
        <h1 style={g.headline}>
          Fetching the World<br />
          <span style={g.headlineAccent}>One Post at a Time</span>
        </h1>
        <p style={g.subline}>
          Live data from{" "}
          <code style={g.code}>jsonplaceholder.typicode.com/posts</code>
        </p>

        {/* status pill */}
        {!loading && !error && (
          <div style={g.statusPill}>
            <span style={g.dot} />
            {posts.length} posts loaded
          </div>
        )}
      </header>

      {/* ── search bar (only when data is ready) ── */}
      {!loading && !error && posts.length > 0 && (
        <div style={g.searchWrap}>
          <span style={g.searchIcon}>⌕</span>
          <input
            style={g.searchInput}
            placeholder="Search posts by title or body…"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button style={g.clearSearch} onClick={() => { setSearch(""); setPage(1); }}>✕</button>
          )}
        </div>
      )}

      {/* ── conditional rendering: loading / error / data ── */}
      {loading && <LoadingGrid />}

      {!loading && error && <ErrorBanner message={error} onRetry={handleRetry} />}

      {!loading && !error && filtered.length === 0 && (
        <div style={g.noResults}>
          <p style={g.noResultsIcon}>🔍</p>
          <p>No posts match "<strong>{search}</strong>"</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <PostGrid posts={paginated} />

          {/* ── pagination ── */}
          <div style={g.pagination}>
            <button
              style={{ ...g.pageBtn, opacity: safePage === 1 ? 0.35 : 1 }}
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span style={g.pageInfo}>Page {safePage} / {totalPages}</span>
            <button
              style={{ ...g.pageBtn, opacity: safePage === totalPages ? 0.35 : 1 }}
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        @keyframes pulse   { 0%,100%{opacity:.35} 50%{opacity:.7} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        article { animation: fadeUp .45s ease both; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles  (dark editorial theme — ink + neon accents)
// ═══════════════════════════════════════════════════════════════════════════════
const g = {
  page: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    minHeight: "100vh",
    background: "#0d1117",
    color: "#e6edf3",
    padding: "0 24px 80px",
    position: "relative",
    overflow: "hidden",
  },

  // blobs
  blob1: {
    position: "fixed", top: -180, right: -120,
    width: 480, height: 480, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(56,189,248,.12),transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed", bottom: -160, left: -100,
    width: 420, height: 420, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(168,85,247,.1),transparent 70%)",
    pointerEvents: "none",
  },

  // header
  header: { maxWidth: 820, margin: "0 auto", padding: "56px 0 40px", textAlign: "center" },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 },
  logoIcon: { fontSize: 22, color: "#38bdf8" },
  logoText: { fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#8b949e", fontFamily: "monospace" },

  headline: {
    fontSize: "clamp(32px,5vw,54px)",
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  headlineAccent: { color: "#38bdf8", fontStyle: "italic" },

  subline: { fontSize: 14, color: "#6e7681", marginBottom: 20 },
  code: {
    fontFamily: "monospace", fontSize: 13,
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: 5, padding: "2px 7px", color: "#79c0ff",
  },
  statusPill: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "#0f2a1e", border: "1px solid #238636",
    borderRadius: 20, padding: "5px 14px",
    fontSize: 12, color: "#3fb950",
  },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#3fb950", flexShrink: 0 },

  // search
  searchWrap: {
    maxWidth: 520, margin: "0 auto 36px",
    position: "relative", display: "flex", alignItems: "center",
  },
  searchIcon: {
    position: "absolute", left: 16, fontSize: 20, color: "#6e7681", pointerEvents: "none",
  },
  searchInput: {
    width: "100%", padding: "12px 44px 12px 46px",
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: 10, fontSize: 14, color: "#e6edf3", outline: "none",
    fontFamily: "inherit",
    transition: "border .2s",
  },
  clearSearch: {
    position: "absolute", right: 14, background: "transparent",
    border: "none", color: "#6e7681", cursor: "pointer", fontSize: 14,
  },

  // grid
  grid: {
    maxWidth: 1060, margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
    gap: 20,
  },

  // card
  card: {
    position: "relative",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: 14,
    padding: "22px 20px 18px",
    display: "flex", flexDirection: "column", gap: 10,
    overflow: "hidden",
    transition: "border-color .2s, transform .2s, box-shadow .2s",
  },
  accentBar: {
    position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "14px 14px 0 0",
  },
  badge: {
    alignSelf: "flex-start", fontSize: 11, fontWeight: 700,
    padding: "3px 10px", borderRadius: 20, letterSpacing: .4,
    fontFamily: "monospace",
  },
  idChip: {
    position: "absolute", top: 14, right: 16,
    fontSize: 11, color: "#6e7681", fontFamily: "monospace",
  },
  cardTitle: {
    fontSize: 15, fontWeight: 700, lineHeight: 1.4,
    color: "#e6edf3", textTransform: "capitalize",
    fontFamily: "'Georgia', serif",
  },
  cardBody: { fontSize: 13, color: "#8b949e", lineHeight: 1.65, flex: 1 },
  cardFooter: { borderTop: "1px solid #21262d", paddingTop: 10, marginTop: 4 },
  readMore: { fontSize: 12, color: "#38bdf8", cursor: "pointer" },

  // skeleton
  skeleton: { animation: "pulse 1.4s ease infinite" },
  skelLine1: { height: 12, width: "40%", background: "#21262d", borderRadius: 6 },
  skelLine2: { height: 16, width: "85%", background: "#21262d", borderRadius: 6 },
  skelLine3: { height: 12, width: "100%", background: "#21262d", borderRadius: 6 },
  skelLine4: { height: 12, width: "70%", background: "#21262d", borderRadius: 6 },

  // error
  errorWrap: {
    maxWidth: 420, margin: "60px auto", textAlign: "center",
    background: "#160b0b", border: "1px solid #6e1a1a",
    borderRadius: 16, padding: "40px 32px",
  },
  errorIcon:  { fontSize: 40, marginBottom: 14, color: "#f85149" },
  errorTitle: { fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#f85149" },
  errorMsg:   { fontSize: 14, color: "#8b949e", marginBottom: 24 },
  retryBtn: {
    padding: "10px 28px",
    background: "#21262d", border: "1px solid #30363d",
    borderRadius: 8, color: "#e6edf3", fontSize: 14, cursor: "pointer",
    fontFamily: "inherit",
  },

  // pagination
  pagination: {
    maxWidth: 1060, margin: "40px auto 0",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
  },
  pageBtn: {
    padding: "9px 22px",
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: 8, color: "#e6edf3", fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", transition: "border .15s",
  },
  pageInfo: { fontSize: 13, color: "#6e7681", minWidth: 100, textAlign: "center" },

  // no results
  noResults: {
    textAlign: "center", padding: "60px 20px", color: "#6e7681", fontSize: 16,
  },
  noResultsIcon: { fontSize: 36, marginBottom: 12 },
};