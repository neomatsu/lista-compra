import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./app/App";
import "./styles/index.css";
import { ensureSeedData } from "./db/seed";

registerSW({ immediate: true });
void ensureSeedData();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
