import { Window } from "./windowBase.js";
import { getLocale } from "./util.js";

export class PopupWindow extends Window {
    constructor(localeOld, type, url, creator) {
        const locale = getLocale();

        const content = document.createElement("div");
        content.classList.add("popup");

        // main message for the pop up
        const msg = document.createElement("p");
        msg.classList.add("popup__message");
        msg.textContent = locale.popup[type];
        msg.dataset.i18n = `popup.${type}`;
        content.appendChild(msg);

        // shows which browser the link opens in on mobile
        if (!window.matchMedia("(min-width: 768px)").matches) {
            const ua = navigator.userAgent;
            let browser = "chrome"; // assume user is on chrome before checking due to market share.
            if (/Firefox/i.test(ua)) {
                browser = "firefox";
            } else if (/Edg/i.test(ua)) {
                browser = "edge";
            } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
                browser = "safari";
            }

            const browserInfo = document.createElement("div");
            browserInfo.classList.add("popup__browser");

            const browserImg = document.createElement("img");
            browserImg.classList.add("popup__browser-icon");
            browserImg.src = `assets/browsers/${browser}.svg`;
            browserImg.alt = "";

            const browserName = document.createElement("span");
            browserName.textContent = browser;

            browserInfo.append(browserImg, browserName);
            content.appendChild(browserInfo);
        }

        // yes no buttons
        const buttons = document.createElement("div");
        buttons.classList.add("popup__buttons");

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = locale.popup.yes;
        confirmBtn.classList.add("btn", "btn--confirm");
        confirmBtn.dataset.i18n = "popup.yes";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = locale.popup.no;
        cancelBtn.classList.add("btn", "btn--cancel");
        cancelBtn.dataset.i18n = "popup.no";

        buttons.append(confirmBtn, cancelBtn);
        content.appendChild(buttons);

        super(`${creator} popup`, locale.popup.title, content, "popup.title");
        this.owner = creator.replace(/^folder /, "");

        confirmBtn.onclick = () => {
            this.close();
            window.open(url, "_blank", "noopener");
        };
        cancelBtn.onclick = () => this.close();
    }
}
