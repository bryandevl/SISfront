// src/componentes/ui/Collapsible.jsx
import React, { useState } from "react";

export function Collapsible({ open, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onOpenChange) onOpenChange(newState);
  };

  return <div>{React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Clonamos el elemento y le pasamos `isOpen` y `toggleOpen` como props adicionales.
      return React.cloneElement(child, { isOpen, toggleOpen });
    }
    return child;
  })}</div>;
}

export function CollapsibleTrigger({ asChild, children, toggleOpen }) {
  return React.cloneElement(children, { onClick: toggleOpen });
}

export function CollapsibleContent({ children, isOpen }) {
  return isOpen ? <div>{children}</div> : null;
}
