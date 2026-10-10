import { closeTopWindow } from "./util.js";

export const windowOrder = [];

export function updateWindowOrder(type) {
    var index = windowOrder.indexOf(type);

    if (index !== -1) {
        windowOrder.splice(index, 1);
    }
    windowOrder.unshift(type);

    let zIndex = 100;
    for (const windowType of windowOrder) {
        const el = document.getElementsByClassName(`${windowType}-window`)[0];
        if (el) {
            el.style.zIndex = zIndex;
        }
        zIndex--;
    }

    const icons = document.querySelectorAll("#active-windows .app-icon");
    icons.forEach((icon) => {
        const iconType = icon.id.split("-").pop();
        if (iconType === type) {
            icon.classList.add("selected");
        } else {
            icon.classList.remove("selected");
        }
    });
}

export class Window {
    constructor(type, title, content) {
        this.type = type;

        this.isMobile = !window.matchMedia("(min-width: 768px)").matches;

        this.title = title;
        this.content = content;
        this.el = this.createWindow();
        if (!this.el) return;
        document.getElementsByClassName("windows")[0].appendChild(this.el);
        updateWindowOrder(this.type);
        this.makeDraggable();
        this.addResizers();

        setTimeout(() => {
            this.el.classList.add("open");
        }, 10);
    }

    createWindow() {
        if (document.getElementsByClassName(`${this.type}-window window`).length != 0) return;

        try {
            document.querySelector(`#active-windows-${this.type}`).classList.toggle("hidden");
        } catch (error) {
            console.log(`${this.type} does not have an active window icon`);
        }

        const win = document.createElement("div");
        win.className = `${this.type}-window window`;

        var closebtnStr = "x";
        if (this.isMobile) closebtnStr = `<i class="fa-solid fa-house"></i>`;
        if (this.isMobile && !this.type.includes("popup")) closeTopWindow();
        win.innerHTML = `<div class="${this.type}-titlebar titlebar"><p data-i18n="${this.type}.title">${this.title}</p> <button class='close-btn'><span>${closebtnStr}</span></button></div>`;

        if (!navigator.userAgent.toLowerCase().includes("iphone")) {
            win.classList.add("android");
        }

        if (this.content instanceof HTMLElement) {
            win.appendChild(this.content);
        } else {
            win.innerHTML = win.innerHTML + `<div class="content">${this.content}</div>`;
        }

        win.querySelector(".close-btn").addEventListener("click", () => this.close());

        win.onclick = () => updateWindowOrder(this.type);

        return win;
    }

    addResizers() {
        if (this.type == "popup") return;

        const directions = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];
        directions.forEach((dir) => {
            const r = document.createElement("div");
            r.className = `resizer ${dir}`;
            this.el.appendChild(r);
        });

        const el = this.el;

        let startX, startY, startWidth, startHeight, startLeft, startTop, activeDir;

        function resizePointerDown(e) {
            const resizer = e.target;
            if (!resizer.classList.contains("resizer")) return;
            e.preventDefault();

            activeDir = [...resizer.classList].find((c) => directions.includes(c));
            startX = e.clientX;
            startY = e.clientY;

            const rect = el.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;

            document.addEventListener("pointermove", elementResize);
            document.addEventListener("pointerup", stopResizeElement);
            updateWindowOrder(this.type);
        }
        function elementResize(e) {
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
        }
        const stopResizeElement = () => {
            document.removeEventListener("pointermove", elementResize);
            document.removeEventListener("pointerup", stopResizeElement);
        };

        this.el.addEventListener("pointerdown", resizePointerDown);
    }

    makeDraggable() {
        if (this.isMobile) return;

        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        const el = this.el;
        const winType = this.type;

        const Xmargin = 700;
        const Ymargin = 486;

        const titleBar = document.getElementsByClassName(`${this.type}-titlebar`)[0];
        const iframe = el.querySelector("iframe");
        let dragging = false;

        titleBar.addEventListener("pointerdown", dragPointerDown);

        function dragPointerDown(e) {
            e = e || window.event;
            e.preventDefault();

            if (e.target.closest(".close-btn")) {
                return;
            }

            dragging = true;

            pos3 = e.clientX;
            pos4 = e.clientY;

            try {
                titleBar.setPointerCapture(e.pointerId);
            } catch (err) {}
            titleBar.addEventListener("pointermove", elementDrag);
            titleBar.addEventListener("pointerup", closeDragElement);
            titleBar.addEventListener("pointercancel", closeDragElement);

            if (iframe) iframe.style.pointerEvents = "none";
        }
        function elementDrag(e) {
            if (!dragging) return;
            e = e || window.event;
            e.preventDefault();

            updateWindowOrder(winType);

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newLeft = el.offsetLeft - pos1;
            let newTop = el.offsetTop - pos2;

            const maxX = window.innerWidth - el.offsetWidth + Xmargin;
            const maxY = window.innerHeight - el.offsetHeight + Ymargin;

            newLeft = Math.max(-Xmargin, Math.min(newLeft, maxX));
            newTop = Math.max(40, Math.min(newTop, maxY));

            el.style.left = newLeft + "px";
            el.style.top = newTop + "px";
        }

        function closeDragElement() {
            dragging = false;
            try {
                titleBar.releasePointerCapture(e.pointerId);
            } catch (err) {}

            if (iframe) iframe.style.pointerEvents = "auto";
        }
    }
    close() {
        try {
            document.querySelector(`#active-windows-${this.type}`).classList.toggle("hidden");
        } catch (error) {
            console.log(`${this.type} does not have an active window icon`);
        }

        const isReduced =
            window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
            window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
        if (!!isReduced) {
            this.el.remove();
            return;
        }

        let el = document.querySelector(`.${this.type}.popup-window`);
        console.log(el);
        if (el != null) {
            el.remove();
        }

        this.el.classList.remove("open");
        this.el.addEventListener("transitionend", () => {
            this.el.remove();
        });
    }
}
