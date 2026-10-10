export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/**
 * Create an element.
 * h("button", { class: "app-icon", dataset: { app: "about" }, onclick: open }, icon, label)
 */
export function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        if (value == null || value === false) continue;

        if (key === "class") el.className = value;
        else if (key === "dataset") Object.assign(el.dataset, value);
        else if (key === "style") Object.assign(el.style, value);
        else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
        else el.setAttribute(key, value === true ? "" : value);
    }

    el.append(...children.flat().filter((child) => child != null && child !== false && child !== ""));
    return el;
}

/** Font Awesome icon element: icon("fa-solid fa-gear") */
export const icon = (classes) => h("i", { class: classes, "aria-hidden": "true" });
