import React from "react";

export default function MaxLogo({ className = "", size = 32 }) {
  return (
    <span
      className={`inline-flex items-center font-black tracking-tight leading-none ${className}`}
      style={{
        fontSize: size,
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: "-0.04em",
      }}
    >
      <span>M</span>
      <span>a</span>
      <span>x</span>
    </span>
  );
}
