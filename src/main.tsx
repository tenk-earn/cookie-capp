import "./polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./components/Providers";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("root element missing");

createRoot(root).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
