import { useEffect } from "react";

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast-container-custom">
      <div className="toast-custom">
        <span>{message}</span>
        <button onClick={onClose} className="toast-close">✕</button>
      </div>
    </div>
  );
}
