import { useState } from "react";
import { copyText } from "../lib/format";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="copy-btn"
      onClick={async () => {
        const ok = await copyText(value);
        if (!ok) return;
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}
