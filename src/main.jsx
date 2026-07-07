import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const pageKey = document.body.dataset.pageKey || "new";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App pageKey={pageKey} />
  </React.StrictMode>,
);
