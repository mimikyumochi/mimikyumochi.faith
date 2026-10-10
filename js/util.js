import { windowOrder, updateWindowOrder } from "./windowBase.js";

export function closeTopWindow() {
    let type = windowOrder[0];

    const el = document.getElementsByClassName(`${type}-window`)[0];
    if (!el) return;

    const isReduced =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    if (!!isReduced) {
        el.remove();
    } else {
        el.classList.remove("open");
        el.addEventListener("transitionend", () => el.remove());
    }

    windowOrder.shift();
    try {
        document.querySelector(`#active-windows-${type}`).classList.toggle("hidden");
    } catch (error) {
        console.log(`${type} does not have an active window icon`);
    }
}

export function updateClock() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerHTML = `${hours}:${minutes}:${seconds}`;
}

export function addActiveWindowWidgetListeners() {
    const icons = document.querySelectorAll("#active-windows .app-icon");

    icons.forEach((icon) => {
        icon.addEventListener("click", function () {
            const type = icon.id.split("-").pop();

            updateWindowOrder(type);
        });
    });
}
export function toggleTheme() {
    var darkMode = localStorage.getItem("mainDarkMode");
    if (darkMode == "true") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
    }

    localStorage.setItem("mainDarkMode", darkMode == "false" ? "true" : false);
}

export function loadTheme() {
    var darkMode = localStorage.getItem("mainDarkMode");

    if (darkMode == null) {
        localStorage.setItem("mainDarkMode", "false");
        document.documentElement.classList.add("light");
    } else if (darkMode == "false") {
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.add("dark");
    }
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
            if (keyPath[0] == "about") {
                value = `<i class="fa-regular fa-heart" style="color:lightskyblue"></i> ` + value;
            }
            if (keyPath[0] == "likes") {
                value = `<i class="fa-regular fa-heart" style="color:pink"></i> ` + value;
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
