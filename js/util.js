import { focusApp } from "./windowBase.js";

export { closeTopWindow } from "./windowBase.js";

export function updateClock() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
}

export function addActiveWindowWidgetListeners() {
    for (const icon of document.querySelectorAll("#taskbar [data-app]")) {
        icon.addEventListener("click", () => focusApp(icon.dataset.app));
    }
}

// mainDarkMode "true" means dark
export function toggleTheme() {
    const dark = localStorage.getItem("mainDarkMode") != "true";
    localStorage.setItem("mainDarkMode", String(dark));
    document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function loadTheme() {
    const dark = localStorage.getItem("mainDarkMode") == "true";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
}

const locales = {};

export async function preloadLocales() {
    const langs = ["en", "nl", "es", "fr", "de"];
    for (const lang of langs) {
        const res = await fetch(`lang/${lang}.json`);
        locales[lang] = await res.json();
    }
}

export function getLocale() {
    return locales[document.documentElement.lang.toLowerCase()];
}

export function getFromLocale(langCode, key) {
    const locale = locales[langCode.toLowerCase()];
    if (!locale) return null;

    const keyPath = key.split(".");
    let value = locale;

    for (const k of keyPath) {
        if (value[k] !== undefined) {
            value = value[k];
        } else {
            return null;
        }
    }
    return value;
}

export function loadLang(langCode) {
    const locale = locales[langCode.toLowerCase()];
    if (!locale) {
        console.warn(`locale not found: ${langCode}`);
        return;
    }

    document.documentElement.lang = langCode;
    localStorage.setItem("lang", langCode);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const keyPath = el.dataset.i18n.split("."); // e.g., "about.title"
        let value = locale;

        for (const key of keyPath) {
            if (value[key] !== undefined) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }

        if (value !== null) {
            if (el.classList.contains("card")) {
                value = `<i class="fa-regular fa-heart" aria-hidden="true"></i> ` + value;
            }
            if (el.dataset.app == "py") {
                value = value + "." + locale.misc.py;
            }
            if (el.dataset.app == "app") {
                value = value + "." + locale.misc.app;
            }
            if (el.dataset.app == "web") {
                value = value + "." + locale.misc.web;
            }
            el.innerHTML = value;
        } else {
            console.warn(`missing translation for key: ${el.dataset.i18n}`);
        }
    });
}
