export const windowOrder = [];
const openWindows = new Map();

// "folder projects" -> "projects"
const appId = (type) => type.replace(/^folder /, "");
const taskbarIcon = (type) => document.querySelector(`#taskbar [data-app="${appId(type)}"]`);
const kindOf = (type) => (type.endsWith(" popup") ? "popup" : type.startsWith("folder ") ? "folder" : type);
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function updateWindowOrder(type) {
    if (!openWindows.has(type)) return;

    const index = windowOrder.indexOf(type);
    if (index !== -1) windowOrder.splice(index, 1);
    windowOrder.unshift(type);

    let zIndex = 100;
    for (const windowType of windowOrder) {
        openWindows.get(windowType).el.style.zIndex = zIndex;
        zIndex--;
    }

    for (const icon of document.querySelectorAll("#taskbar [data-app]")) {
        icon.classList.toggle("is-focused", icon.dataset.app === appId(type));
    }
}

export function focusApp(id) {
    const type = [...openWindows.keys()].find((t) => appId(t) === id);
    if (type) updateWindowOrder(type);
}

export function closeTopWindow() {
    openWindows.get(windowOrder[0])?.close();
}

export class Window {
    constructor(type, title, content, titleKey) {
        this.type = type;
        this.kind = kindOf(type);
        this.isMobile = !window.matchMedia("(min-width: 768px)").matches;

        this.title = title;
        this.titleKey = titleKey;
        this.content = content;

        // a new popup replaces the old one instead of focusing it
        if (this.kind === "popup") openWindows.get(type)?.close();

        if (openWindows.has(type)) {
            updateWindowOrder(type);
            return;
        }
        if (this.isMobile && this.kind !== "popup") closeTopWindow();

        this.el = this.createWindow();
        openWindows.set(type, this);
        document.querySelector(".windows").appendChild(this.el);
        updateWindowOrder(type);

        const icon = taskbarIcon(type);
        if (icon) icon.hidden = false;

        this.makeDraggable();
        this.addResizers();

        setTimeout(() => this.el.classList.add("is-open"), 10);
    }

    createWindow() {
        const win = document.createElement("section");
        win.className = `window window--${this.kind}`;

        const titlebar = document.createElement("header");
        titlebar.className = "window__titlebar";

        const title = document.createElement("span");
        title.className = "window__title";
        title.textContent = this.title;
        if (this.titleKey) title.dataset.i18n = this.titleKey;

        const close = document.createElement("button");
        close.className = "window__close";
        close.setAttribute("aria-label", "close");
        close.innerHTML = this.isMobile ? `<i class="fa-solid fa-house" aria-hidden="true"></i>` : "×";
        close.addEventListener("click", () => this.close());

        titlebar.append(title, close);

        const content = document.createElement("div");
        content.className = "window__content";
        if (this.content instanceof HTMLElement) content.append(this.content);
        else content.innerHTML = this.content;

        win.append(titlebar, content);
        win.addEventListener("pointerdown", () => updateWindowOrder(this.type));

        return win;
    }

    addResizers() {
        if (this.isMobile || this.kind === "popup") return;

        for (const dir of ["n", "e", "s", "w", "ne", "nw", "se", "sw"]) {
            const r = document.createElement("div");
            r.className = "resizer";
            r.dataset.dir = dir;
            this.el.appendChild(r);
        }

        const el = this.el;
        let startX, startY, startWidth, startHeight, startLeft, startTop, activeDir;

        const resizePointerDown = (e) => {
            if (!e.target.classList.contains("resizer")) return;
            e.preventDefault();

            activeDir = e.target.dataset.dir;
            startX = e.clientX;
            startY = e.clientY;

            const rect = el.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;

            el.classList.add("is-dragging");
            document.addEventListener("pointermove", elementResize);
            document.addEventListener("pointerup", stopResizeElement);
            updateWindowOrder(this.type);
        };
        const elementResize = (e) => {
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            if (activeDir.includes("e")) newWidth = startWidth + dx;
            if (activeDir.includes("s")) newHeight = startHeight + dy;
            if (activeDir.includes("w")) {
                newWidth = startWidth - dx;
                newLeft = startLeft + dx;
            }
            if (activeDir.includes("n")) {
                newHeight = startHeight - dy;
                newTop = startTop + dy;
            }

            newWidth = Math.max(300, newWidth);
            newHeight = Math.max(300, newHeight);

            el.style.width = newWidth + "px";
            el.style.height = newHeight + "px";
            if (newWidth != 300) {
                el.style.left = newLeft + "px";
            }
            if (newHeight != 300) {
                el.style.top = newTop + "px";
            }
        };
        const stopResizeElement = () => {
            el.classList.remove("is-dragging");
            document.removeEventListener("pointermove", elementResize);
            document.removeEventListener("pointerup", stopResizeElement);
        };

        el.addEventListener("pointerdown", resizePointerDown);
    }

    makeDraggable() {
        if (this.isMobile) return;

        let lastX = 0;
        let lastY = 0;
        const el = this.el;

        const Xmargin = 700;
        const Ymargin = 486;

        const titleBar = el.querySelector(".window__titlebar");

        const elementDrag = (e) => {
            e.preventDefault();

            const dx = lastX - e.clientX;
            const dy = lastY - e.clientY;
            lastX = e.clientX;
            lastY = e.clientY;

            const maxX = window.innerWidth - el.offsetWidth + Xmargin;
            const maxY = window.innerHeight - el.offsetHeight + Ymargin;

            el.style.left = Math.max(-Xmargin, Math.min(el.offsetLeft - dx, maxX)) + "px";
            el.style.top = Math.max(40, Math.min(el.offsetTop - dy, maxY)) + "px";
        };
        const closeDragElement = (e) => {
            el.classList.remove("is-dragging");
            titleBar.releasePointerCapture(e.pointerId);
            titleBar.removeEventListener("pointermove", elementDrag);
            titleBar.removeEventListener("pointerup", closeDragElement);
            titleBar.removeEventListener("pointercancel", closeDragElement);
        };

        titleBar.addEventListener("pointerdown", (e) => {
            if (e.target.closest(".window__close")) return;
            e.preventDefault();

            lastX = e.clientX;
            lastY = e.clientY;

            el.classList.add("is-dragging");
            titleBar.setPointerCapture(e.pointerId);
            titleBar.addEventListener("pointermove", elementDrag);
            titleBar.addEventListener("pointerup", closeDragElement);
            titleBar.addEventListener("pointercancel", closeDragElement);
        });
    }

    close() {
        if (openWindows.get(this.type) !== this) return;
        openWindows.delete(this.type);
        windowOrder.splice(windowOrder.indexOf(this.type), 1);

        const icon = taskbarIcon(this.type);
        if (icon) {
            icon.hidden = true;
            icon.classList.remove("is-focused");
        }
        if (windowOrder.length) updateWindowOrder(windowOrder[0]);

        for (const win of [...openWindows.values()]) {
            if (win.owner === appId(this.type)) win.close();
        }

        // popups never animate, so they'd never get a transitionend
        if (this.kind === "popup" || prefersReducedMotion()) {
            this.el.remove();
            return;
        }

        this.el.classList.remove("is-open");
        this.el.addEventListener("transitionend", (e) => {
            if (e.target === this.el) this.el.remove();
        });
    }
}
