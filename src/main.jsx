import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const pageKey = document.body.dataset.pageKey || "new";
const mobileHeaderMedia = window.matchMedia("(max-width: 960px)");

const syncHeaderMenuState = (isOpen) => {
  const toggle = document.querySelector(".site-header__toggle");
  const menu = document.querySelector(".site-header__menu");

  if (!toggle || !menu) {
    return;
  }

  document.body.classList.toggle("site-menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  menu.toggleAttribute("data-open", isOpen);
};

const setupHeaderMenu = () => {
  const toggle = document.querySelector(".site-header__toggle");
  const menu = document.querySelector(".site-header__menu");

  if (!toggle || !menu) {
    return;
  }

  syncHeaderMenuState(false);

  toggle.addEventListener("click", () => {
    const nextOpen = toggle.getAttribute("aria-expanded") !== "true";
    syncHeaderMenuState(nextOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileHeaderMedia.matches) {
        syncHeaderMenuState(false);
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      syncHeaderMenuState(false);
    }
  });

  mobileHeaderMedia.addEventListener("change", (event) => {
    if (!event.matches) {
      syncHeaderMenuState(false);
    }
  });
};

setupHeaderMenu();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App pageKey={pageKey} />
  </React.StrictMode>,
);
