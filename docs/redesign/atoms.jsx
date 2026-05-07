/* global React */
/* ============================================================
   Lista de la compra — primitive UI atoms & icons
   ============================================================ */
(function() {

/* -------- Icons (stroke 2, currentColor, simple shapes) -------- */
const Icon = ({ d, size = 22, stroke = 2, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    {d}
  </svg>
);

const Icons = {
  cart:    (p) => <Icon {...p} d={<><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M3 4h2.2l2.6 11.2a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.2L21 7H6.5"/></>}/>,
  plus:    (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>}/>,
  minus:   (p) => <Icon {...p} d={<><path d="M5 12h14"/></>}/>,
  trash:   (p) => <Icon {...p} d={<><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></>}/>,
  check:   (p) => <Icon {...p} d={<><path d="M5 12.5l4.5 4.5L19 7"/></>}/>,
  search:  (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>}/>,
  star:    (p) => <Icon {...p} d={<><path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.4 1.1 6.2L12 17.6 6.5 20.6l1.1-6.2L3.2 10l6.1-.9z" fill="currentColor" stroke="none"/></>}/>,
  share:   (p) => <Icon {...p} d={<><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8 11l8-4M8 13l8 4"/></>}/>,
  cog:     (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>}/>,
  copy:    (p) => <Icon {...p} d={<><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></>}/>,
  link:    (p) => <Icon {...p} d={<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></>}/>,
  unlink:  (p) => <Icon {...p} d={<><path d="M9 15l-3 3a4 4 0 0 1-5.7-5.7l3-3M15 9l3-3a4 4 0 0 1 5.7 5.7l-3 3M5 5l14 14"/></>}/>,
  list:    (p) => <Icon {...p} d={<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/></>}/>,
  catalog: (p) => <Icon {...p} d={<><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 9h17M9 4v16"/></>}/>,
  chevronDown: (p) => <Icon {...p} d={<><path d="M6 9l6 6 6-6"/></>}/>,
  chevronUp:   (p) => <Icon {...p} d={<><path d="M6 15l6-6 6 6"/></>}/>,
  chevronRight:(p) => <Icon {...p} d={<><path d="M9 6l6 6-6 6"/></>}/>,
  back:    (p) => <Icon {...p} d={<><path d="M15 6l-6 6 6 6"/></>}/>,
  close:   (p) => <Icon {...p} d={<><path d="M6 6l12 12M18 6L6 18"/></>}/>,
  info:    (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></>}/>,
  // Category illustrations (simple, friendly)
  catPantry: (p) => <Icon {...p} stroke={1.8} d={<><path d="M5 8c0-2 3-3 7-3s7 1 7 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M5 12h14M9 5v3M15 5v3"/></>}/>,
  catDairy:  (p) => <Icon {...p} stroke={1.8} d={<><path d="M9 3h6v3l1.5 3v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9L9 6z"/><path d="M9 9h6"/></>}/>,
  catProduce:(p) => <Icon {...p} stroke={1.8} d={<><path d="M12 21c-4 0-7-3-7-7 0-3 2-6 6-6 1.5 0 2.5.5 3.5 1.5"/><path d="M19 11c0 4-3 7-7 7"/><path d="M14 8c0-3 2-5 5-5-1 2-2 4-5 5z"/></>}/>,
  catMeat:   (p) => <Icon {...p} stroke={1.8} d={<><path d="M5 12c0-4 3-7 7-7s7 3 7 7c0 2-1 3-2.5 3.5L15 18a2 2 0 0 1-3 0l-1.5-2.5C8 15 5 14 5 12z"/><circle cx="9" cy="11" r="1.2"/></>}/>,
  catBakery: (p) => <Icon {...p} stroke={1.8} d={<><path d="M3 11c0-2 2-4 4-4 1 0 1.5.3 2 .8.5-.5 1-.8 2-.8s1.5.3 2 .8c.5-.5 1-.8 2-.8 2 0 4 2 4 4 0 1.5-1 3-2.5 3.5L15 19a2 2 0 0 1-1.7 1H10a2 2 0 0 1-1.7-1l-1.8-4.5C5 14 3 12.5 3 11z"/></>}/>,
  catDrinks: (p) => <Icon {...p} stroke={1.8} d={<><path d="M7 4h10l-1 4H8z"/><path d="M8 8l1 12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-12"/></>}/>,
  catHome:   (p) => <Icon {...p} stroke={1.8} d={<><path d="M9 4h6v5l2 3v8H7v-8l2-3z"/><path d="M11 16h2"/></>}/>,
  catOther:  (p) => <Icon {...p} stroke={1.8} d={<><circle cx="12" cy="12" r="8"/><path d="M9.5 10a2.5 2.5 0 1 1 4 2.4c-1 .6-1.5 1-1.5 2M12 17v.5"/></>}/>,
};

/* ============================================================
   Device frame — phone shell used to present screens
   ============================================================ */
const Phone = ({ children, w = 390, h = 780, label, mode = "light" }) => (
  <div style={{
    width: w, height: h, position: "relative",
    borderRadius: 44, padding: 10,
    background: mode === "dark" ? "#0E1A17" : "#1F2A26",
    boxShadow: "0 30px 60px -20px rgba(31,42,38,.25), 0 8px 20px -8px rgba(31,42,38,.18)",
    fontFamily: "var(--font-sans)",
  }}>
    <div style={{
      width: "100%", height: "100%", borderRadius: 36, overflow: "hidden",
      background: "var(--bg)", position: "relative",
    }} className="lc">
      {/* status bar */}
      <div style={{
        height: 38, padding: "10px 22px 0", display: "flex",
        justifyContent: "space-between", alignItems: "flex-start",
        fontSize: 13, fontWeight: 600, color: "var(--ink)",
        background: "transparent", position: "relative", zIndex: 5,
      }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {/* signal */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="3" width="3" height="8" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
          {/* battery */}
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><path d="M24 4v4" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div style={{ height: "calc(100% - 38px)", overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
    {label && (
      <div style={{
        position: "absolute", bottom: -28, left: 0, right: 0,
        textAlign: "center", fontSize: 12, color: "#6E6555",
        letterSpacing: ".04em", textTransform: "uppercase", fontWeight: 600,
      }}>{label}</div>
    )}
  </div>
);

/* ============================================================
   Buttons
   ============================================================ */
const Btn = ({ variant = "primary", size = "lg", icon, children, full, style, ...rest }) => {
  const h = size === "lg" ? "var(--tap-lg)" : "var(--tap)";
  const variants = {
    primary: { background: "var(--green-500)", color: "#fff", border: "none" },
    primaryDark: { background: "var(--green-700)", color: "#fff", border: "none" },
    secondary: { background: "var(--surface)", color: "var(--ink)", border: "1.5px solid var(--surface-line-strong)" },
    soft:    { background: "var(--green-50)", color: "var(--green-700)", border: "1.5px solid transparent" },
    ghost:   { background: "transparent", color: "var(--ink)", border: "1.5px solid transparent" },
    danger:  { background: "var(--surface)", color: "var(--danger-500)", border: "1.5px solid var(--danger-500)" },
    dangerSolid: { background: "var(--danger-500)", color: "#fff", border: "none" },
    terra:   { background: "var(--terra-500)", color: "#fff", border: "none" },
  };
  return (
    <button
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 10, height: h, padding: "0 20px",
        borderRadius: "var(--r-md)", fontSize: "var(--t-btn)", fontWeight: 600,
        cursor: "pointer", width: full ? "100%" : "auto",
        letterSpacing: "-0.005em",
        transition: "transform .05s ease",
        ...variants[variant], ...style,
      }}
      {...rest}>
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
};

/* Quantity stepper — large, accessible, used in regular mode */
const Stepper = ({ qty, onInc, onDec, color = "green" }) => {
  const bg = color === "green" ? "var(--green-500)" : "var(--terra-500)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <button onClick={onDec} aria-label="Restar"
        style={{
          width: 44, height: 44, borderRadius: 12, border: "none",
          background: bg, color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
        <Icons.minus size={20} stroke={2.5}/>
      </button>
      <div style={{
        minWidth: 36, textAlign: "center",
        fontWeight: 800, fontSize: "var(--t-qty)", color: "var(--ink)",
        fontVariantNumeric: "tabular-nums",
      }}>{qty}</div>
      <button onClick={onInc} aria-label="Sumar"
        style={{
          width: 44, height: 44, borderRadius: 12, border: "none",
          background: bg, color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
        <Icons.plus size={20} stroke={2.5}/>
      </button>
    </div>
  );
};

/* Category chip with soft tinted bg */
const categoryColors = {
  Despensa:        { bg: "#F2EAD6", fg: "#7A5B1E", icon: Icons.catPantry },
  "Lácteos":       { bg: "#EAF1F4", fg: "#2F5D6E", icon: Icons.catDairy },
  "Frutas y verduras": { bg: "#E6EFDC", fg: "#3F6B23", icon: Icons.catProduce },
  "Carne y pescado":{ bg: "#F4E2DC", fg: "#8C3A26", icon: Icons.catMeat },
  "Panadería":     { bg: "#F4EAD8", fg: "#7A5821", icon: Icons.catBakery },
  Bebidas:         { bg: "#E5ECF1", fg: "#2E5475", icon: Icons.catDrinks },
  Hogar:           { bg: "#EFE7DC", fg: "#6E5638", icon: Icons.catHome },
  Otros:           { bg: "#EBE7DD", fg: "#5C5440", icon: Icons.catOther },
};

const CategoryBadge = ({ name, size = 36 }) => {
  const c = categoryColors[name] || categoryColors.Otros;
  const I = c.icon;
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: c.bg, color: c.fg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <I size={size === 36 ? 22 : 20}/>
    </div>
  );
};

/* Section card — main container for grouped content */
const Card = ({ children, style, padding = "20px", ...rest }) => (
  <div {...rest} style={{
    background: "var(--surface)",
    borderRadius: "var(--r-lg)",
    border: "1px solid var(--surface-line)",
    padding,
    boxShadow: "var(--sh-card)",
    ...style,
  }}>{children}</div>
);

/* Status pill */
const StatusPill = ({ tone = "ok", icon, children }) => {
  const tones = {
    ok:    { bg: "var(--green-50)",  fg: "var(--green-700)", dot: "#3FA478" },
    warn:  { bg: "var(--amber-50)",  fg: "#7A5B1E",          dot: "#C99715" },
    info:  { bg: "var(--terra-50)",  fg: "var(--terra-600)", dot: "var(--terra-500)" },
    muted: { bg: "var(--surface-2)", fg: "var(--ink-2)",     dot: "#8E9893" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: "var(--r-pill)",
      background: tones.bg, color: tones.fg,
      fontSize: 14, fontWeight: 600, lineHeight: 1,
    }}>
      {icon ?? <span style={{ width: 8, height: 8, borderRadius: 999, background: tones.dot }}/>}
      {children}
    </span>
  );
};

/* Bottom nav */
const BottomNav = ({ active = "list", onAdd }) => {
  const items = [
    { id: "list", label: "Mi lista", icon: Icons.list },
    { id: "catalog", label: "Catálogo", icon: Icons.catalog },
    { id: "share", label: "Compartir", icon: Icons.share },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "var(--surface)",
      borderTop: "1px solid var(--surface-line)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
      paddingTop: 8,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "0 8px" }}>
        {items.map(it => {
          const I = it.icon; const isOn = active === it.id;
          return (
            <button key={it.id} style={{
              border: "none", background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "8px 0", cursor: "pointer",
              color: isOn ? "var(--green-700)" : "var(--ink-2)",
            }}>
              <div style={{
                width: 56, height: 30, borderRadius: 999,
                background: isOn ? "var(--green-50)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <I size={22} stroke={2}/>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

window.LCAtoms = { Icons, Phone, Btn, Stepper, CategoryBadge, categoryColors, Card, StatusPill, BottomNav };
})();
