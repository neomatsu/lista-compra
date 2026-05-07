/* global React, LCAtoms, LCComponents */
(function() {
const { Icons, Btn, CategoryBadge, Card, StatusPill, BottomNav } = LCAtoms;
const {
  HeaderHero, HeaderShopping,
  ProductRowPending, ProductRowShopping,
  CategoryGroup,
} = LCComponents;

/* shared sample data */
const sampleList = [
  { name: "Huevos",   qty: 10, cat: "Despensa" },
  { name: "Pan de molde", qty: 1,  cat: "Despensa" },
  { name: "Leche",    qty: 6,  cat: "Lácteos" },
  { name: "Yogures naturales", qty: 8, cat: "Lácteos" },
  { name: "Cebollas", qty: 2,  cat: "Frutas y verduras" },
  { name: "Manzanas", qty: 6,  cat: "Frutas y verduras" },
  { name: "Atún",     qty: 6,  cat: "Carne y pescado" },
];

/* group helper */
function group(arr) {
  const g = {};
  arr.forEach(p => { (g[p.cat] = g[p.cat] || []).push(p); });
  return g;
}

/* ============================================================
   SCREEN 1 — Main list (default)
   ============================================================ */
const ScreenList = () => {
  const grouped = group(sampleList);
  return (
    <div style={{ height: "100%", overflow: "auto", paddingBottom: 88 }}>
      <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <HeaderHero pending={7} dateLabel="Hoy · Sábado 7 mayo" shared/>

        {/* Por comprar */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "8px 4px 12px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--t-h2)", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Por comprar
            </h2>
            <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 600 }}>4 categorías</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {Object.entries(grouped).map(([cat, items]) => (
              <CategoryGroup key={cat} name={cat} count={items.length}>
                {items.map(p => (
                  <ProductRowPending key={p.name} name={p.name} qty={p.qty}/>
                ))}
              </CategoryGroup>
            ))}
          </div>
        </div>

        {/* Comprados (empty) */}
        <Card style={{ padding: 18, background: "var(--surface-2)", borderStyle: "dashed", boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: "var(--surface)",
              color: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--surface-line)",
            }}>
              <Icons.check size={22}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Comprados</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
                Aún no has marcado productos.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav active="list"/>
    </div>
  );
};

/* ============================================================
   SCREEN 2 — Empty state
   ============================================================ */
const ScreenEmpty = () => (
  <div style={{ height: "100%", overflow: "auto", paddingBottom: 88 }}>
    <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ borderRadius: 24, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>
          Hoy · Sábado 7 mayo
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1.05,
          margin: 0, fontWeight: 600, letterSpacing: "-0.015em",
          textWrap: "balance",
        }}>Lista de la compra</h1>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: "var(--ink-3)", lineHeight: 1 }}>0</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-2)" }}>productos</span>
        </div>
      </Card>

      <Card style={{ padding: 28, textAlign: "center" }}>
        <div style={{
          width: 88, height: 88, margin: "8px auto 16px", borderRadius: 24,
          background: "var(--green-50)", color: "var(--green-700)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icons.cart size={44} stroke={1.6}/>
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>
          Tu lista está vacía
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.4 }}>
          Añade productos desde el catálogo o crea uno nuevo.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn variant="primary" full icon={<Icons.plus size={20} stroke={2.5}/>}>
            Abrir catálogo
          </Btn>
          <Btn variant="secondary" full>
            Crear producto nuevo
          </Btn>
        </div>
      </Card>
    </div>
    <BottomNav active="list"/>
  </div>
);

/* ============================================================
   SCREEN 3 — Shopping mode
   ============================================================ */
const ScreenShopping = () => {
  const all = sampleList;
  const bought = new Set(["Leche", "Manzanas"]);
  const pending = all.filter(p => !bought.has(p.name));
  const done    = all.filter(p =>  bought.has(p.name));
  const grouped = group(pending);

  return (
    <div style={{ height: "100%", overflow: "auto", paddingBottom: 24 }}>
      <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
        <HeaderShopping pending={pending.length} total={all.length}/>

        <div>
          <h2 style={{ margin: "4px 4px 12px", fontSize: "var(--t-h2)", fontWeight: 700 }}>
            Por comprar
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {Object.entries(grouped).map(([cat, items]) => (
              <CategoryGroup key={cat} name={cat} count={items.length}>
                {items.map(p => (
                  <ProductRowShopping key={p.name} name={p.name} qty={p.qty}/>
                ))}
              </CategoryGroup>
            ))}
          </div>
        </div>

        {done.length > 0 && (
          <div>
            <h2 style={{ margin: "4px 4px 12px", fontSize: "var(--t-h2)", fontWeight: 700, color: "var(--ink-2)" }}>
              En el carro · {done.length}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {done.map(p => (
                <ProductRowShopping key={p.name} name={p.name} qty={p.qty} bought/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 4 — Catalog panel
   ============================================================ */
const catalogData = {
  habitual: ["Agua", "Café", "Pan", "Leche", "Plátanos"],
  Despensa: ["Arroz", "Pasta", "Aceite de oliva", "Azúcar", "Sal", "Harina"],
  "Lácteos": ["Yogur natural", "Mantequilla", "Queso", "Nata"],
  "Frutas y verduras": ["Manzanas", "Tomates", "Lechuga", "Zanahorias"],
  "Carne y pescado": ["Pollo", "Carne picada", "Salmón", "Atún"],
  Hogar: ["Detergente", "Pasta de dientes", "Papel higiénico"],
};

const ScreenCatalog = () => {
  const [open, setOpen] = React.useState({ Despensa: true });
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* sticky top: title + search */}
      <div style={{
        padding: "12px 16px 12px", background: "var(--bg)",
        borderBottom: "1px solid var(--surface-line)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button style={{
            width: 44, height: 44, borderRadius: 12, border: "none",
            background: "var(--surface)", border: "1px solid var(--surface-line)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: "var(--ink)",
          }}><Icons.back size={22}/></button>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Catálogo
          </h1>
        </div>
        <div style={{ position: "relative" }}>
          <Icons.search size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
          <input placeholder="Buscar producto…" style={{
            width: "100%", height: 52, padding: "0 16px 0 46px",
            borderRadius: "var(--r-md)", border: "1.5px solid var(--surface-line-strong)",
            background: "var(--surface)", fontSize: 17, color: "var(--ink)",
            fontFamily: "inherit",
          }}/>
        </div>
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 16px 100px" }}>
        {/* Lo habitual */}
        <Card style={{ padding: 18, marginBottom: 18, background: "#FFF8E2", borderColor: "#F0DFAB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "var(--amber-500)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icons.star size={18}/>
            </div>
            <h3 style={{ margin: 0, fontSize: "var(--t-h2)", fontWeight: 700 }}>Lo habitual</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {catalogData.habitual.map(p => (
              <button key={p} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 44, padding: "0 14px 0 10px", borderRadius: 999,
                border: "1.5px solid #E6CF8E", background: "#FFFDF5",
                fontSize: 16, fontWeight: 600, color: "#5C4514", cursor: "pointer",
              }}>
                <Icons.plus size={18} stroke={2.5}/> {p}
              </button>
            ))}
          </div>
        </Card>

        {/* Categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(catalogData).filter(([k]) => k !== "habitual").map(([cat, products]) => {
            const isOpen = !!open[cat];
            return (
              <Card key={cat} padding="0" style={{ overflow: "hidden" }}>
                <button onClick={() => setOpen(s => ({ ...s, [cat]: !s[cat] }))}
                  style={{
                    width: "100%", border: "none", background: "transparent",
                    padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", textAlign: "left", minHeight: 64,
                  }}>
                  <CategoryBadge name={cat} size={36}/>
                  <span style={{ flex: 1, fontSize: "var(--t-h3)", fontWeight: 700, color: "var(--ink)" }}>{cat}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 600 }}>{products.length}</span>
                  <span style={{ color: "var(--ink-2)" }}>
                    {isOpen ? <Icons.chevronUp size={20}/> : <Icons.chevronDown size={20}/>}
                  </span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 6,
                    borderTop: "1px solid var(--surface-line)", paddingTop: 12,
                  }}>
                    {products.map(p => (
                      <button key={p} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        height: 52, padding: "0 12px", borderRadius: 12,
                        border: "1.5px solid var(--surface-line)", background: "var(--surface-2)",
                        cursor: "pointer", textAlign: "left",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, background: "var(--green-500)", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icons.plus size={20} stroke={2.5}/>
                        </div>
                        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{p}</span>
                      </button>
                    ))}
                    <button style={{
                      marginTop: 4, height: 48, borderRadius: 12,
                      border: "1.5px dashed var(--surface-line-strong)",
                      background: "transparent", color: "var(--ink-2)",
                      fontSize: 15, fontWeight: 600, cursor: "pointer",
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      <Icons.plus size={18}/> Producto nuevo en {cat}
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "12px 16px calc(env(safe-area-inset-bottom, 0px) + 16px)",
        background: "linear-gradient(to top, var(--bg) 75%, rgba(246,241,232,0))",
      }}>
        <Btn variant="primary" full icon={<Icons.plus size={22} stroke={2.5}/>}>
          Crear producto nuevo
        </Btn>
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 5 — New product form (modal sheet)
   ============================================================ */
const ScreenNewProduct = () => {
  return (
    <div style={{ height: "100%", position: "relative", background: "rgba(31,42,38,.45)" }}>
      {/* dimmed list behind */}
      <div style={{
        position: "absolute", inset: 0, padding: "70px 16px 0",
        opacity: .35, pointerEvents: "none",
      }}>
        <Card style={{ height: 200, padding: 20 }}>
          <div style={{ height: 24, width: "70%", background: "var(--surface-2)", borderRadius: 6, marginBottom: 18 }}/>
          <div style={{ height: 50, width: "90%", background: "var(--surface-2)", borderRadius: 12, marginBottom: 12 }}/>
          <div style={{ height: 50, width: "80%", background: "var(--surface-2)", borderRadius: 12 }}/>
        </Card>
      </div>

      {/* Sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--surface)", borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: "10px 22px 28px", boxShadow: "0 -10px 40px rgba(0,0,0,.18)",
      }}>
        {/* grabber */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
          <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--surface-line-strong)" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Nuevo producto
          </h2>
          <button style={{
            width: 40, height: 40, borderRadius: 999, border: "none",
            background: "var(--surface-2)", color: "var(--ink-2)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icons.close size={20}/></button>
        </div>

        {/* Name */}
        <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8, letterSpacing: ".02em", textTransform: "uppercase" }}>
          Nombre
        </label>
        <input defaultValue="Galletas integrales" style={{
          width: "100%", height: 56, padding: "0 16px",
          borderRadius: "var(--r-md)", border: "2px solid var(--green-500)",
          background: "var(--surface)", fontSize: 18, color: "var(--ink)",
          fontWeight: 600, fontFamily: "inherit", marginBottom: 18,
        }}/>

        {/* Category */}
        <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8, letterSpacing: ".02em", textTransform: "uppercase" }}>
          Categoría
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {["Despensa", "Lácteos", "Frutas y verduras", "Carne y pescado", "Hogar", "Otros"].map((c, i) => {
            const sel = c === "Despensa";
            return (
              <button key={c} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 44, padding: "0 14px", borderRadius: 999,
                border: sel ? "2px solid var(--green-500)" : "1.5px solid var(--surface-line-strong)",
                background: sel ? "var(--green-50)" : "var(--surface)",
                color: sel ? "var(--green-700)" : "var(--ink-2)",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}>
                <CategoryBadge name={c} size={24}/> {c}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Btn variant="secondary" full size="lg">Cancelar</Btn>
          <Btn variant="primary" full size="lg" icon={<Icons.plus size={20} stroke={2.5}/>}>Añadir</Btn>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 6 — Shared list settings
   ============================================================ */
const ScreenShared = () => (
  <div style={{ height: "100%", overflow: "auto", paddingBottom: 24 }}>
    {/* top bar */}
    <div style={{ padding: "8px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
      <button style={{
        width: 44, height: 44, borderRadius: 12, border: "1px solid var(--surface-line)",
        background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}><Icons.back size={22}/></button>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
        Lista compartida
      </h1>
    </div>

    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Sync status */}
      <Card style={{ padding: 22, textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, margin: "0 auto 14px", borderRadius: 24,
          background: "var(--green-50)", color: "var(--green-700)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icons.share size={32} stroke={1.8}/>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>
          Tu lista se sincroniza
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.4 }}>
          Cualquier cambio se ve al instante en los móviles que comparten el mismo código familiar.
        </p>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
          <StatusPill tone="ok">Conectado · 2 dispositivos</StatusPill>
        </div>
      </Card>

      {/* Family code */}
      <Card style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
          Vuestro código familiar
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", background: "var(--surface-2)",
          borderRadius: "var(--r-md)", border: "1.5px dashed var(--surface-line-strong)",
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 28, fontWeight: 700, letterSpacing: "0.16em", color: "var(--ink)",
          }}>FAM-7K42</span>
          <button style={{
            width: 44, height: 44, borderRadius: 12, border: "none",
            background: "var(--green-500)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icons.copy size={20}/>
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.4 }}>
          Comparte este código con tu familia. Cualquiera con el código verá la misma lista.
        </p>
      </Card>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn variant="secondary" full icon={<Icons.link size={20}/>}>Usar otro código</Btn>
        <Btn variant="danger" full icon={<Icons.unlink size={20}/>}>Desvincular este móvil</Btn>
      </div>

      {/* Helper */}
      <div style={{
        padding: 16, borderRadius: "var(--r-md)", background: "var(--surface-2)",
        border: "1px solid var(--surface-line)",
        display: "flex", gap: 12,
      }}>
        <Icons.info size={22} style={{ color: "var(--ink-2)", flexShrink: 0, marginTop: 2 }}/>
        <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--ink)" }}>¿Cómo funciona?</strong><br/>
          Tu lista se guarda en este móvil y se copia automáticamente a otros con el mismo código. No necesitas crear cuenta.
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================
   SCREEN 7 — Confirmation modal (delete bought)
   ============================================================ */
const ScreenModalDelete = () => (
  <div style={{
    height: "100%", background: "rgba(31,42,38,.5)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
    padding: 18, paddingBottom: 24,
  }}>
    <div style={{
      width: "100%", background: "var(--surface)", borderRadius: 24,
      padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.25)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: "var(--danger-50)", color: "var(--danger-500)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icons.trash size={26}/>
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
        ¿Eliminar productos comprados?
      </h2>
      <p style={{ margin: "0 0 22px", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.45 }}>
        Se quitarán los <strong style={{ color: "var(--ink)" }}>5 productos</strong> que has marcado como comprados. Tu lista quedará lista para la próxima vez.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn variant="dangerSolid" full size="lg" icon={<Icons.trash size={20}/>}>
          Sí, eliminar comprados
        </Btn>
        <Btn variant="ghost" full size="lg">No, mantenerlos</Btn>
      </div>
    </div>
  </div>
);

window.LCScreens = {
  ScreenList, ScreenEmpty, ScreenShopping, ScreenCatalog,
  ScreenNewProduct, ScreenShared, ScreenModalDelete,
};
})();
