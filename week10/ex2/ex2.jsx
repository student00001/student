import { useState } from "react";

// ── unique id helper ──────────────────────────────────────────────────────────
let nextId = 1;
const uid = () => nextId++;

// ── initial items ─────────────────────────────────────────────────────────────
const SEED = [
  { id: uid(), text: "Design the UI layout",      tag: "Design"   },
  { id: uid(), text: "Build React components",    tag: "Dev"      },
  { id: uid(), text: "Write unit tests",          tag: "QA"       },
];

// ── Tag colors ────────────────────────────────────────────────────────────────
const TAG_COLORS = {
  Design:   { bg: "#fff0d6", color: "#b45309" },
  Dev:      { bg: "#dbeafe", color: "#1d4ed8" },
  QA:       { bg: "#dcfce7", color: "#15803d" },
  Research: { bg: "#f3e8ff", color: "#7e22ce" },
  Other:    { bg: "#f1f5f9", color: "#475569" },
};
const TAG_OPTS = Object.keys(TAG_COLORS);

// ═══════════════════════════════════════════════════════════════════════════════
// InputPanel – handles all input logic, separate from display logic
// ═══════════════════════════════════════════════════════════════════════════════
function InputPanel({ onAdd }) {
  const [text, setText] = useState("");
  const [tag,  setTag]  = useState("Dev");
  const [shake, setShake] = useState(false);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onAdd(trimmed, tag);
    setText("");
  };

  const onKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={styles.panel}>
      <p style={styles.panelLabel}>NEW TASK</p>
      <div style={styles.inputRow}>
        <input
          style={{ ...styles.input, ...(shake ? styles.inputShake : {}) }}
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          maxLength={80}
        />
        <select
          style={styles.select}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {TAG_OPTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button style={styles.addBtn} onClick={submit}>
          <span style={styles.plusIcon}>＋</span> Add
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TaskItem – single list row
// ═══════════════════════════════════════════════════════════════════════════════
function TaskItem({ item, onRemove, onToggle }) {
  const tagStyle = TAG_COLORS[item.tag] || TAG_COLORS.Other;

  return (
    <li style={{ ...styles.item, opacity: item.done ? 0.5 : 1 }}>
      {/* done toggle */}
      <button
        style={{ ...styles.circle, ...(item.done ? styles.circleDone : {}) }}
        onClick={() => onToggle(item.id)}
        title="Mark done"
      >
        {item.done && "✓"}
      </button>

      {/* text */}
      <span style={{ ...styles.itemText, textDecoration: item.done ? "line-through" : "none" }}>
        {item.text}
      </span>

      {/* tag badge */}
      <span style={{ ...styles.tag, background: tagStyle.bg, color: tagStyle.color }}>
        {item.tag}
      </span>

      {/* remove */}
      <button style={styles.removeBtn} onClick={() => onRemove(item.id)} title="Remove">
        ✕
      </button>
    </li>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EmptyState – conditional rendering when list is empty
// ═══════════════════════════════════════════════════════════════════════════════
function EmptyState() {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>📋</div>
      <p style={styles.emptyTitle}>No tasks yet</p>
      <p style={styles.emptyHint}>Add your first task above to get started.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// App – root component, owns state
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── array state ─────────────────────────────────────────────────────────────
  const [items, setItems] = useState(SEED);
  const [filter, setFilter] = useState("All");

  // ── add ──────────────────────────────────────────────────────────────────────
  const handleAdd = (text, tag) => {
    setItems((prev) => [...prev, { id: uid(), text, tag, done: false }]);
  };

  // ── remove ───────────────────────────────────────────────────────────────────
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── toggle done ──────────────────────────────────────────────────────────────
  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, done: !item.done } : item)
    );
  };

  // ── clear done ───────────────────────────────────────────────────────────────
  const clearDone = () => setItems((prev) => prev.filter((i) => !i.done));

  // ── filtered view ─────────────────────────────────────────────────────────────
  const visible = filter === "All"
    ? items
    : filter === "Done"
    ? items.filter((i) => i.done)
    : filter === "Active"
    ? items.filter((i) => !i.done)
    : items.filter((i) => i.tag === filter);

  const doneCount   = items.filter((i) => i.done).length;
  const activeCount = items.length - doneCount;

  return (
    <div style={styles.page}>
      {/* ── header ── */}
      <header style={styles.header}>
        <div style={styles.headerAccent} />
        <h1 style={styles.title}>Task Board</h1>
        <p style={styles.subtitle}>
          <span style={styles.statChip}>{activeCount} active</span>
          <span style={{ ...styles.statChip, background: "#dcfce7", color: "#15803d" }}>
            {doneCount} done
          </span>
          <span style={{ ...styles.statChip, background: "#f1f5f9", color: "#64748b" }}>
            {items.length} total
          </span>
        </p>
      </header>

      {/* ── input panel (separated component) ── */}
      <InputPanel onAdd={handleAdd} />

      {/* ── filter bar ── */}
      <div style={styles.filterBar}>
        {["All", "Active", "Done", ...TAG_OPTS].map((f) => (
          <button
            key={f}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        {doneCount > 0 && (
          <button style={styles.clearBtn} onClick={clearDone}>
            Clear done ({doneCount})
          </button>
        )}
      </div>

      {/* ── list (conditional rendering) ── */}
      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul style={styles.list}>
          {/* map() with unique key per item → React reconciliation */}
          {visible.map((item) => (
            <TaskItem
              key={item.id}           // ← unique key attribute
              item={item}
              onRemove={handleRemove}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════════════════
const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    maxWidth: 660,
    margin: "0 auto",
    padding: "32px 20px 60px",
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#1e293b",
  },

  // header
  header:      { position: "relative", marginBottom: 28, paddingLeft: 16 },
  headerAccent: {
    position: "absolute", left: 0, top: 4, bottom: 4,
    width: 4, borderRadius: 4, background: "linear-gradient(180deg,#6366f1,#8b5cf6)",
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" },
  subtitle: { margin: "6px 0 0", display: "flex", gap: 8, flexWrap: "wrap" },
  statChip: {
    fontSize: 12, fontWeight: 600, padding: "3px 10px",
    borderRadius: 20, background: "#e0e7ff", color: "#4338ca",
  },

  // input panel
  panel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
  },
  panelLabel: { margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 },
  inputRow:   { display: "flex", gap: 8, flexWrap: "wrap" },
  input: {
    flex: "1 1 180px",
    padding: "10px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: 9,
    fontSize: 14,
    outline: "none",
    transition: "border .2s",
  },
  inputShake: { animation: "shake .35s", borderColor: "#f87171" },
  select: {
    padding: "10px 12px",
    border: "1.5px solid #cbd5e1",
    borderRadius: 9,
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "10px 20px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  plusIcon: { fontSize: 16, lineHeight: 1 },

  // filter bar
  filterBar: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 },
  filterBtn: {
    padding: "6px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: "#fff",
    color: "#64748b",
    cursor: "pointer",
  },
  filterActive: { background: "#6366f1", color: "#fff", border: "1.5px solid #6366f1" },
  clearBtn: {
    marginLeft: "auto",
    padding: "6px 14px",
    border: "1.5px solid #fca5a5",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: "#fff",
    color: "#ef4444",
    cursor: "pointer",
  },

  // list
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 },

  // item
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "12px 16px",
    transition: "box-shadow .15s, opacity .2s",
    boxShadow: "0 1px 3px rgba(0,0,0,.05)",
  },
  circle: {
    width: 24, height: 24, borderRadius: "50%",
    border: "2px solid #cbd5e1", background: "transparent",
    cursor: "pointer", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, color: "#fff",
    transition: "background .15s, border .15s",
  },
  circleDone: { background: "#22c55e", border: "2px solid #22c55e" },
  itemText: { flex: 1, fontSize: 14, color: "#1e293b" },
  tag: {
    fontSize: 11, fontWeight: 700, padding: "3px 10px",
    borderRadius: 20, flexShrink: 0,
  },
  removeBtn: {
    border: "none", background: "transparent",
    color: "#cbd5e1", fontSize: 14, cursor: "pointer",
    padding: "4px 6px", borderRadius: 6,
    transition: "color .15s",
    flexShrink: 0,
  },

  // empty state
  empty: { textAlign: "center", padding: "60px 20px", color: "#94a3b8" },
  emptyIcon:  { fontSize: 48, marginBottom: 12 },
  emptyTitle: { margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#cbd5e1" },
  emptyHint:  { margin: 0, fontSize: 13 },
};