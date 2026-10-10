import { Window } from "./windowBase.js";
import { getLocale } from "./util.js";

export class PopupWindow extends Window {
    constructor(localeOld, type, url, creator) {
        const locale = getLocale();

        const content = document.createElement("div");
        content.classList.add("content");

        // main message for the pop up

        const msg = document.createElement("p");

        if (type == "link") {
            msg.textContent = locale.popup.link;
            msg.setAttribute("data-i18n", "popup.link");
        } else if (type == "file") {
            msg.textContent = locale.popup.file;
            msg.setAttribute("data-i18n", "popup.file");
        }
        content.appendChild(msg);

        // yes no buttons
        const buttons = document.createElement("div");
        buttons.classList.add("popup-buttons");

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = locale.popup.yes;
        confirmBtn.classList.add("confirm-btn");
        confirmBtn.setAttribute("data-i18n", "popup.yes");

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = locale.popup.no;
        cancelBtn.classList.add("cancel-btn");
        cancelBtn.setAttribute("data-i18n", "popup.no");

        buttons.appendChild(confirmBtn);
        buttons.appendChild(cancelBtn);

        // browser selector for mobile popup, will add more browsers later
        if (!window.matchMedia("(min-width: 768px)").matches) {
            const browserContainer = document.createElement("div");
            browserContainer.classList.add("browser");

            const browserInfo = document.createElement("div");
            browserInfo.classList.add("browser-info");

            let ua = navigator.userAgent;
            let browser = "chrome"; // assume user is on chrome before checking due to market share.

            // update browser if user agent contains its info
            if (/Firefox/i.test(ua)) {
                browser = "firefox";
            } else if (/Edg/i.test(ua)) {
                browser = "edge";
            } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
                browser = "safari";
            }

            const browserImg = document.createElement("img");
            browserImg.classList.add("browser-img");
            browserImg.src = `assets/browsers/${browser}.svg`;
            browserInfo.appendChild(browserImg);

            const browserName = document.createElement("p");
            browserName.textContent = browser;
            browserName.classList.add("browser-name");
            browserInfo.appendChild(browserName);

            browserContainer.appendChild(browserInfo);

            const browserRadio = document.createElement("input");
            browserRadio.type = "radio";
            browserRadio.checked = true;
            browserContainer.appendChild(browserRadio);

            content.appendChild(browserContainer);
        }

        content.appendChild(buttons);

        super(`${creator} popup`, locale.popup.title, content);
        confirmBtn.onclick = () => {
            this.close();
            window.open(url, "_blank");
        };
        cancelBtn.onclick = () => this.close();
    }
}
