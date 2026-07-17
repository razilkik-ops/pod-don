import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const pageKey = document.body.dataset.pageKey || "new";
const supportedLanguages = ["ru", "en", "de"];
const languageParam = new URLSearchParams(window.location.search).get("lang");
const language = supportedLanguages.includes(languageParam) ? languageParam : "ru";
const mobileHeaderMedia = window.matchMedia("(max-width: 960px)");

document.documentElement.lang = language;

const headerCopy = {
  ru: { about: "О компании", catalog: "Каталог", delivery: "Доставка и оплата", contacts: "Контакты", new: "Новые", used: "Б/у", hours: "Ежедневно с 9:00 до 18:00" },
  en: { about: "About", catalog: "Catalog", delivery: "Delivery", contacts: "Contacts", new: "New", used: "Used", hours: "Daily 9:00–18:00" },
  de: { about: "Über uns", catalog: "Katalog", delivery: "Lieferung", contacts: "Kontakt", new: "Neu", used: "Gebraucht", hours: "Täglich 9:00–18:00" },
};

const setupLanguage = () => {
  const copy = headerCopy[language];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translated = copy[element.dataset.i18n];
    if (translated) {
      element.textContent = translated;
    }
  });

  document.querySelectorAll(".site-language__link").forEach((link) => {
    const targetLanguage = link.dataset.language;
    link.classList.toggle("site-language__link--active", targetLanguage === language);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", targetLanguage);
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });

  document.querySelectorAll(".site-switcher__link, .site-brand--text-only").forEach((link) => {
    const url = new URL(link.href, window.location.origin);
    if (language !== "ru") {
      url.searchParams.set("lang", language);
    }
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
};

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
setupLanguage();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App language={language} pageKey={pageKey} />
  </React.StrictMode>,
);
