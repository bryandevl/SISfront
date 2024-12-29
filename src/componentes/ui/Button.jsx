// src/componentes/ui/Button.jsx
import React from "react";

export function Button({ variant, className, children, ...props }) {
  return (
    <button
      className={`btn ${variant === "ghost" ? "btn-ghost" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
