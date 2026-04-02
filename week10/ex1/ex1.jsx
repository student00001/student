import { useState } from "react";

// ─── validation rules ────────────────────────────────────────────────────────
const RULES = {
  name: (v) => {
    if (!v.trim())            return "Full name is required.";
    if (v.trim().length < 2)  return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Name contains invalid characters.";
    return "";
  },
  email: (v) => {
    if (!v.trim())            return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Enter a valid email address.";
    return "";
  },
  password: (v) => {
    if (!v)                   return "Password is required.";
    if (v.length < 8)         return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(v))     return "Include at least one uppercase letter.";
    if (!/[0-9]/.test(v))     return "Include at least one number.";
    return "";
  },
  confirm: (v, all) => {
    if (!v)                   return "Please confirm your password.";
    if (v !== all.password)   return "Passwords do not match.";
    return "";
  },
};

const EMPTY_FIELDS  = { name: "", email: "", password: "", confirm: "" };
const EMPTY_ERRORS  = { name: "", email: "", password: "", confirm: "" };
const EMPTY_TOUCHED = { name: false, email: false, password: false, confirm: false };

// ─── password strength ────────────────────────────────────────────────────────
function strength(pw) {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (pw.length >= 12)         score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak",   color: "#ef4444", width: "20%" };
  if (score <= 2) return { label: "Fair",   color: "#f97316", width: "45%" };
  if (score <= 3) return { label: "Good",   color: "#eab308", width: "65%" };
  if (score <= 4) return { label: "Strong", color: "#22c55e", width: "85%" };
  return           { label: "Very Strong",  color: "#10b981", width: "100%" };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FieldInput – single controlled input with label + error display
// ═══════════════════════════════════════════════════════════════════════════════
function FieldInput({ id, label, type = "text", value, onChange, onBlur, error, touched, placeholder, extra }) {
  const showError = touched && error;
  const showOk    = touched && !error && value;

  return (
    <div style={s.fieldWrap}>
      <label style={s.label} htmlFor={id}>{label}</label>
      <div style={s.inputWrap}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={type === "password" ? "new-password" : "off"}
          style={{
            ...s.input,
            ...(showError ? s.inputError : {}),
            ...(showOk    ? s.inputOk    : {}),
          }}
        />
        {/* status icon */}
        {showOk    && <span style={{ ...s.statusIcon, color: "#22c55e" }}>✓</span>}
        {showError && <span style={{ ...s.statusIcon, color: "#ef4444" }}>✕</span>}
      </div>
      {/* extra slot (password strength bar) */}
      {extra}
      {/* conditional error rendering */}
      {showError && (
        <p style={s.errorMsg} role="alert">
          <span style={s.errorDot}>●</span> {error}
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SuccessBanner – shown after successful submission
// ═══════════════════════════════════════════════════════════════════════════════
function SuccessBanner({ name, onReset }) {
  return (
    <div style={s.successWrap}>
      <div style={s.successRing}>
        <span style={s.successCheck}>✓</span>
      </div>
      <h2 style={s.successTitle}>Welcome aboard, {name}!</h2>
      <p style={s.successSub}>Your account has been created successfully.</p>
      <button style={s.resetBtn} onClick={onReset}>
        ← Register another account
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// App – root component; owns all form state
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── controlled component state ───────────────────────────────────────────────
  const [fields,    setFields]    = useState(EMPTY_FIELDS);
  const [errors,    setErrors]    = useState(EMPTY_ERRORS);
  const [touched,   setTouched]   = useState(EMPTY_TOUCHED);
  const [submitted, setSubmitted] = useState(false);
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);

  // ── onChange: update field + live-validate if already touched ────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: RULES[name](value, updated),
        // re-validate confirm whenever password changes
        ...(name === "password" ? { confirm: touched.confirm ? RULES.confirm(updated.confirm, updated) : "" } : {}),
      }));
    }
  };

  // ── onBlur: mark field touched + validate ────────────────────────────────────
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: RULES[name](fields[name], fields) }));
  };

  // ── onSubmit: validate all fields, prevent if errors ────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();   // ← preventDefault stops native browser submission

    // touch all fields so errors are shown
    setTouched({ name: true, email: true, password: true, confirm: true });

    // run all validators
    const newErrors = {
      name:     RULES.name(fields.name, fields),
      email:    RULES.email(fields.email, fields),
      password: RULES.password(fields.password, fields),
      confirm:  RULES.confirm(fields.confirm, fields),
    };
    setErrors(newErrors);

    // if any error exists, bail out
    if (Object.values(newErrors).some(Boolean)) return;

    // success → show banner
    setSubmitted(true);
  };

  // ── reset: clear all state after submission ──────────────────────────────────
  const handleReset = () => {
    setFields(EMPTY_FIELDS);
    setErrors(EMPTY_ERRORS);
    setTouched(EMPTY_TOUCHED);
    setSubmitted(false);
    setShowPw(false);
    setShowCf(false);
  };

  // ── derived ──────────────────────────────────────────────────────────────────
  const pwStrength = fields.password ? strength(fields.password) : null;
  const allValid   = Object.values(errors).every((e) => !e) &&
                     Object.values(fields).every((v) => v);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* background texture grid */}
      <div style={s.gridBg} />

      <div style={s.card}>
        {/* side accent strip */}
        <div style={s.strip} />

        {submitted ? (
          <SuccessBanner name={fields.name.trim().split(" ")[0]} onReset={handleReset} />
        ) : (
          <>
            {/* ── header ── */}
            <div style={s.cardHead}>
              <div style={s.logoMark}>✦</div>
              <h1 style={s.title}>Create Account</h1>
              <p style={s.subtitle}>Fill in the details below to get started.</p>
            </div>

            {/* ── form ── */}
            <form onSubmit={handleSubmit} noValidate style={s.form}>

              {/* Name */}
              <FieldInput
                id="name"
                label="Full Name"
                value={fields.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                placeholder="Jane Doe"
              />

              {/* Email */}
              <FieldInput
                id="email"
                label="Email Address"
                type="email"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                placeholder="jane@example.com"
              />

              {/* Password */}
              <FieldInput
                id="password"
                label="Password"
                type={showPw ? "text" : "password"}
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                extra={
                  <div style={s.pwExtras}>
                    {/* show/hide toggle */}
                    <button
                      type="button"
                      style={s.toggleBtn}
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                    {/* strength bar */}
                    {pwStrength && (
                      <div style={s.strengthRow}>
                        <div style={s.strengthTrack}>
                          <div style={{ ...s.strengthFill, width: pwStrength.width, background: pwStrength.color }} />
                        </div>
                        <span style={{ ...s.strengthLabel, color: pwStrength.color }}>
                          {pwStrength.label}
                        </span>
                      </div>
                    )}
                  </div>
                }
              />

              {/* Confirm Password */}
              <FieldInput
                id="confirm"
                label="Confirm Password"
                type={showCf ? "text" : "password"}
                value={fields.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirm}
                touched={touched.confirm}
                placeholder="Re-enter your password"
                extra={
                  <button type="button" style={{ ...s.toggleBtn, marginTop: 4 }}
                    onClick={() => setShowCf((v) => !v)}>
                    {showCf ? "Hide" : "Show"}
                  </button>
                }
              />

              {/* submit */}
              <button
                type="submit"
                style={{ ...s.submitBtn, opacity: allValid ? 1 : 0.72 }}
              >
                Create My Account →
              </button>

              <p style={s.hint}>
                Already have an account? <span style={s.hintLink}>Sign in</span>
              </p>
            </form>
          </>
        )}
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf7f2; }
        input::placeholder { color: #c4b8a8; }
        input:focus { outline: none; border-color: #c9a96e !important; box-shadow: 0 0 0 3px rgba(201,169,110,.15); }
        @keyframes slideIn {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity:0; transform: scale(.85); }
          60%  { transform: scale(1.05); }
          100% { opacity:1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Styles  — warm parchment + gold accent, editorial serif
// ═══════════════════════════════════════════════════════════════════════════════
const s = {
  page: {
    minHeight: "100vh",
    background: "#faf7f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    position: "relative",
  },

  gridBg: {
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(180,155,110,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,155,110,.07) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },

  // card
  card: {
    width: "100%", maxWidth: 460,
    background: "#fffdf8",
    borderRadius: 20,
    boxShadow: "0 8px 40px rgba(100,80,40,.12), 0 2px 8px rgba(100,80,40,.08)",
    border: "1px solid #ede4d3",
    position: "relative",
    overflow: "hidden",
    animation: "slideIn .5s ease both",
  },
  strip: {
    position: "absolute", top: 0, left: 0, bottom: 0, width: 5,
    background: "linear-gradient(180deg, #c9a96e, #e8c98a, #c9a96e)",
  },

  // head
  cardHead: { padding: "36px 36px 0 44px" },
  logoMark: { fontSize: 22, color: "#c9a96e", marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 700, color: "#2c2416", letterSpacing: "-0.3px", marginBottom: 6 },
  subtitle: { fontSize: 13.5, color: "#9a8878", marginBottom: 4 },

  // form
  form: { padding: "24px 36px 32px 44px", display: "flex", flexDirection: "column", gap: 20 },

  // field
  fieldWrap: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 700, color: "#6b5a47", letterSpacing: 0.8, textTransform: "uppercase" },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "11px 40px 11px 14px",
    background: "#fdf9f3",
    border: "1.5px solid #ddd0bc",
    borderRadius: 10,
    fontSize: 14.5,
    color: "#2c2416",
    fontFamily: "inherit",
    transition: "border .2s, box-shadow .2s",
  },
  inputError: { borderColor: "#ef4444", background: "#fff8f8" },
  inputOk:    { borderColor: "#86efac" },
  statusIcon: { position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700 },

  // password extras
  pwExtras: { display: "flex", flexDirection: "column", gap: 6, marginTop: 5 },
  toggleBtn: {
    alignSelf: "flex-end",
    background: "transparent", border: "none",
    fontSize: 11, color: "#c9a96e", cursor: "pointer",
    fontFamily: "inherit", letterSpacing: 0.5, fontWeight: 700,
    textTransform: "uppercase",
  },
  strengthRow: { display: "flex", alignItems: "center", gap: 10 },
  strengthTrack: {
    flex: 1, height: 5, background: "#ede4d3", borderRadius: 99, overflow: "hidden",
  },
  strengthFill: {
    height: "100%", borderRadius: 99, transition: "width .4s ease, background .4s ease",
  },
  strengthLabel: { fontSize: 11, fontWeight: 700, minWidth: 72, letterSpacing: 0.3 },

  // error
  errorMsg: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, color: "#ef4444",
    animation: "slideIn .2s ease both",
  },
  errorDot: { fontSize: 7, flexShrink: 0 },

  // submit
  submitBtn: {
    marginTop: 6,
    padding: "14px",
    background: "linear-gradient(135deg, #c9a96e, #b8934a)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "opacity .2s, transform .15s",
    boxShadow: "0 4px 14px rgba(180,140,60,.3)",
  },

  hint: { textAlign: "center", fontSize: 12.5, color: "#9a8878" },
  hintLink: { color: "#c9a96e", cursor: "pointer", fontWeight: 700 },

  // success
  successWrap: {
    padding: "52px 44px 52px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center",
    animation: "popIn .45s ease both",
  },
  successRing: {
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a96e, #e8c98a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 6px 20px rgba(180,140,60,.3)",
  },
  successCheck: { fontSize: 28, color: "#fff", fontWeight: 900 },
  successTitle: { fontSize: 22, fontWeight: 700, color: "#2c2416" },
  successSub:   { fontSize: 14, color: "#9a8878" },
  resetBtn: {
    marginTop: 10, padding: "10px 24px",
    background: "transparent", border: "1.5px solid #ddd0bc",
    borderRadius: 10, fontSize: 13, color: "#6b5a47",
    cursor: "pointer", fontFamily: "inherit",
  },
};