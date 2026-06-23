import { useState } from "react";
import { devViewAs, useCurrentUser } from "@/lib/auth";
import { resetMockData } from "@/lib/mockData";
import type { Role } from "@/lib/types";

const OPTIONS: { label: string; value: Role | "guest" }[] = [
  { label: "Logged out", value: "guest" },
  { label: "Free member", value: "member" },
  { label: "Supporter", value: "supporter" },
  { label: "Admin", value: "admin" },
];

export function DevRoleSwitcher() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const current: Role | "guest" = user?.role ?? "guest";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {open && (
        <div
          style={{
            marginBottom: 8,
            background: "#0f1011",
            color: "#f7f6f2",
            border: "1px solid rgba(247,246,242,0.16)",
            borderRadius: 12,
            padding: 12,
            width: 220,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7e8085", marginBottom: 8 }}>
            Dev tool · View as
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {OPTIONS.map((o) => {
              const active = o.value === current;
              return (
                <button
                  key={o.value}
                  onClick={() => devViewAs(o.value)}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    background: active ? "rgba(247,246,242,0.10)" : "transparent",
                    color: "#f7f6f2",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {active ? "● " : "○ "}
                  {o.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => {
              resetMockData();
            }}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "6px 8px",
              borderRadius: 8,
              fontSize: 11,
              background: "transparent",
              color: "#7e8085",
              border: "1px solid rgba(247,246,242,0.16)",
              cursor: "pointer",
            }}
          >
            Reset mock data
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "#0f1011",
          color: "#f7f6f2",
          border: "1px solid rgba(247,246,242,0.20)",
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        aria-label="Dev role switcher"
      >
        DEV · {OPTIONS.find((o) => o.value === current)?.label}
      </button>
    </div>
  );
}
