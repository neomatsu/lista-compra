/* global React, LCAtoms */
(function() {
const { Icons, Btn, Stepper, CategoryBadge, Card, StatusPill } = LCAtoms;

/* ============================================================
   Header — large, warm, calm
   ============================================================ */
const HeaderHero = ({ pending = 4, dateLabel = "Hoy", onShop, shopping = false, shared = true, onShare }) => (
  <Card style={{ borderRadius: 24, padding: 22 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
        {dateLabel}
      </div>
      <button onClick={onShare} aria-label="Ajustes"
        style={{
          width: 40, height: 40, borderRadius: 12, border: "1.5px solid var(--surface-line)",
          background: "var(--surface-2)", cursor: "pointer", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-2)",
        }}>
        <Icons.cog size={20}/>
      </button>
    </div>
    <h1 style={{
      fontFamily: "var(--font-display)",
      fontSize: 26, lineHeight: 1.05, margin: 0,
      fontWeight: 600, letterSpacing: "-0.015em", color: "var(--ink)",
      textWrap: "balance",
    }}>
      Lista de la compra
    </h1>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 18 }}>
      <span style={{ fontSize: 44, fontWeight: 800, color: "var(--green-700)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {pending}
      </span>
      <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-2)" }}>
        productos pendientes
      </span>
    </div>

    {/* shop button */}
    <div style={{ marginTop: 18 }}>
      {shopping ? (
        <Btn variant="primaryDark" full size="lg" onClick={onShop}
             icon={<Icons.check size={22} stroke={2.5}/>}>
          Terminar compra
        </Btn>
      ) : (
        <Btn variant="primary" full size="lg" onClick={onShop}
             icon={<Icons.cart size={22} stroke={2}/>}>
          Empezar compra
        </Btn>
      )}
    </div>

    {/* shared status row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--surface-line)" }}>
      <StatusPill tone={shared ? "info" : "muted"}
        icon={<Icons.share size={14} stroke={2.2}/>}>
        {shared ? "Lista compartida" : "Solo en este móvil"}
      </StatusPill>
      <button onClick={onShare} style={{
        background: "none", border: "none", color: "var(--ink-2)",
        fontSize: 14, fontWeight: 600, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 4px",
      }}>
        Ajustes <Icons.chevronRight size={16}/>
      </button>
    </div>
  </Card>
);

/* Compact shopping-mode header */
const HeaderShopping = ({ pending, total, onEnd }) => {
  const done = total - pending;
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div style={{
      background: "var(--green-700)", color: "var(--ink-on-dark)",
      borderRadius: 24, padding: 22, position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, opacity: .85 }}>
        <Icons.cart size={18}/>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
          Modo compra
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pending}</span>
        <span style={{ fontSize: 16, opacity: .85 }}>por comprar · {done} en el carro</span>
      </div>
      {/* progress */}
      <div style={{ height: 8, background: "rgba(255,255,255,.18)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#7BC79E", borderRadius: 999, transition: "width .3s ease" }}/>
      </div>
      <Btn variant="terra" full size="lg" onClick={onEnd}
           icon={<Icons.check size={22} stroke={2.5}/>}
           style={{ background: "#F6F1E8", color: "var(--green-700)" }}>
        Terminar compra
      </Btn>
    </div>
  );
};

/* ============================================================
   Product rows
   ============================================================ */
const ProductRowPending = ({ name, qty, onInc, onDec }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 14px", background: "var(--surface-2)",
    borderRadius: "var(--r-md)",
    minHeight: 64,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: "var(--t-product)", fontWeight: 600, color: "var(--ink)", textWrap: "pretty" }}>
        {name}
      </div>
    </div>
    <Stepper qty={qty} onInc={onInc} onDec={onDec}/>
  </div>
);

const ProductRowShopping = ({ name, qty, bought = false, onToggle }) => (
  <button onClick={onToggle} style={{
    width: "100%", textAlign: "left", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 14,
    padding: "16px 16px",
    background: bought ? "var(--surface-2)" : "var(--surface)",
    borderRadius: "var(--r-md)",
    border: bought ? "1.5px solid var(--surface-line)" : "1.5px solid var(--green-100)",
    minHeight: 68,
    transition: "all .15s ease",
  }}>
    {/* big checkbox */}
    <div style={{
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      border: bought ? "none" : "2px solid var(--green-500)",
      background: bought ? "var(--green-500)" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff",
    }}>
      {bought && <Icons.check size={20} stroke={3}/>}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: "var(--t-product)", fontWeight: 600,
        color: bought ? "var(--status-bought-fg)" : "var(--ink)",
        textDecoration: bought ? "line-through" : "none",
        textDecorationThickness: "2px",
        textDecorationColor: "var(--status-bought-fg)",
      }}>{name}</div>
    </div>
    <div style={{
      minWidth: 44, height: 36, padding: "0 12px", borderRadius: 10,
      background: bought ? "transparent" : "var(--green-50)",
      color: bought ? "var(--status-bought-fg)" : "var(--green-700)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: "var(--t-qty)", fontVariantNumeric: "tabular-nums",
    }}>×{qty}</div>
  </button>
);

const ProductRowBought = ({ name, qty, onUndo }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 14px", borderRadius: "var(--r-md)",
    background: "var(--status-bought-bg)",
    minHeight: 56,
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8, background: "var(--green-500)",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icons.check size={18} stroke={3}/>
    </div>
    <div style={{ flex: 1, fontSize: 16, color: "var(--status-bought-fg)", textDecoration: "line-through", fontWeight: 500 }}>
      {name}
    </div>
    <span style={{ fontSize: 15, color: "var(--status-bought-fg)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>×{qty}</span>
    <button onClick={onUndo} style={{
      border: "none", background: "transparent", padding: "4px 8px", borderRadius: 8,
      color: "var(--ink-2)", fontWeight: 600, fontSize: 14, cursor: "pointer",
    }}>Deshacer</button>
  </div>
);

/* ============================================================
   Category group
   ============================================================ */
const CategoryGroup = ({ name, children, count }) => (
  <div>
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 4px 10px",
    }}>
      <CategoryBadge name={name} size={36}/>
      <h3 style={{
        margin: 0, fontSize: "var(--t-h3)", fontWeight: 700, color: "var(--ink)",
        letterSpacing: "-0.005em",
      }}>{name}</h3>
      {count != null && (
        <span style={{
          fontSize: 13, fontWeight: 700, color: "var(--ink-3)",
          background: "var(--surface-2)", padding: "2px 8px", borderRadius: 999,
        }}>{count}</span>
      )}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </div>
  </div>
);

/* ============================================================
   Toast
   ============================================================ */
const Toast = ({ children, tone = "ok" }) => {
  const tones = {
    ok:    { bg: "var(--green-700)", fg: "#fff", dot: "#7BC79E" },
    info:  { bg: "var(--ink)",        fg: "#fff", dot: "#F5D6BE" },
    warn:  { bg: "#7A5B1E",          fg: "#fff", dot: "var(--amber-500)" },
  }[tone];
  return (
    <div style={{
      background: tones.bg, color: tones.fg,
      borderRadius: "var(--r-pill)",
      padding: "12px 18px 12px 14px",
      display: "inline-flex", alignItems: "center", gap: 10,
      fontSize: 15, fontWeight: 600, boxShadow: "var(--sh-pop)",
    }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: tones.dot }}/>
      {children}
    </div>
  );
};

window.LCComponents = {
  HeaderHero, HeaderShopping,
  ProductRowPending, ProductRowShopping, ProductRowBought,
  CategoryGroup, Toast,
};
})();
