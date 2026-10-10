import { Window } from "./windowBase.js";
import { PopupWindow } from "./popupWindow.js";
import { getFromLocale, toggleTheme, loadLang } from "./util.js";

const heartCard = (locale, section, key, colour) => `
    <li class="card" style="--icon-colour: ${colour}" data-i18n="${section}.${key}">
        <i class="fa-regular fa-heart" aria-hidden="true"></i> ${locale[section][key]}
    </li>`;

const specCard = (icon, text) => `<li class="card"><i class="${icon}" aria-hidden="true"></i> ${text}</li>`;

const folderItem = (id, icon, label, extraClass = "") => `
    <button class="app-icon app-icon--large ${extraClass}" id="${id}">${icon}${label}</button>`;

const faIcon = (classes) => `<i class="${classes}" aria-hidden="true"></i>`;
const imgIcon = (src) => `<img class="app-icon__img" src="${src}" alt="" />`;
const plainLabel = (text) => `<span class="app-icon__label">${text}</span>`;
const appLabel = (locale, key, ext) =>
    `<span class="app-icon__label" data-app="${ext}" data-i18n="apps.${key}">${locale.apps[key]}.${locale.misc[ext]}</span>`;

const iframe = (src, title, zoom = 0.7) => `
    <div class="iframe-frame" style="--zoom: ${zoom}">
        <iframe src="${src}" title="${title}"></iframe>
    </div>`;

export class AboutWindow extends Window {
    constructor(locale) {
        super(
            "about",
            locale.about.title,
            `<ul class="card-list">
                ${["age", "relationship", "kotlin", "hatepeople", "eepy", "frontend"]
                    .map((key) => heartCard(locale, "about", key, "lightskyblue"))
                    .join("")}
            </ul>`,
            "about.title",
        );
    }
}
export class LikesWindow extends Window {
    constructor(locale) {
        super(
            "likes",
            locale.likes.title,
            `<ul class="card-list">
                ${["animals", "seedfind", "speedrun", "maze", "rlai"]
                    .map((key) => heartCard(locale, "likes", key, "pink"))
                    .join("")}
            </ul>`,
            "likes.title",
        );
    }
}

export class SpecsWindow extends Window {
    constructor(locale) {
        super(
            "specs",
            locale.specs.title,
            `<ul class="card-list">
                ${specCard("fa-solid fa-microchip", "AMD Ryzen 7 5700X")}
                ${specCard("fa-solid fa-memory", "32 GB (4 x 8 GB) DDR4 3200")}
                ${specCard("fa-solid fa-hard-drive", "Samsung 980 Pro 1TB SSD")}
                ${specCard("fa-solid fa-hard-drive", "Samsung 860 QVO 1TB SSD")}
                ${specCard("fa-solid fa-hard-drive", "Western Digital Blue 1TB HDD")}
                ${specCard("fa-solid fa-hard-drive", "Seagate Exos 8TB HDD")}
                ${specCard("fa-solid fa-display", "MSI RTX 3060")}
                <li class="card">
                    <a href="https://uk.pcpartpicker.com/list/gV3s9C" target="_blank">
                        <i class="fa-solid fa-link" aria-hidden="true"></i>
                        <span data-i18n="specs.link">${locale.specs.link}</span>
                    </a>
                </li>
            </ul>`,
            "specs.title",
        );
    }
}

export class ProjectsWindow extends Window {
    constructor(locale) {
        super(
            "folder projects",
            locale.apps.projects,
            `<div class="folder__grid">
                ${folderItem(
                    "connect4",
                    `<i class="fa-solid fa-circle app-icon__disc app-icon__disc--red" aria-hidden="true"></i>
                     <i class="fa-solid fa-circle app-icon__disc app-icon__disc--yellow" aria-hidden="true"></i>`,
                    appLabel(locale, "connect4", "app"),
                    "app-icon--connect4",
                )}
                ${folderItem("maze-game", faIcon("fa-solid fa-signs-post"), appLabel(locale, "maze", "app"))}
                ${folderItem("faithbot", faIcon("fa-solid fa-robot"), appLabel(locale, "faithbot", "py"))}
                ${folderItem("mazegen", faIcon("fa-solid fa-compass"), appLabel(locale, "mazegen", "py"))}
                ${folderItem("website", faIcon("fa-solid fa-code"), appLabel(locale, "website", "web"))}
                ${folderItem("clock", faIcon("fa-solid fa-clock"), appLabel(locale, "clock", "app"))}
                ${folderItem("tomoko", faIcon("fa-solid fa-brain"), plainLabel("tomoko.py"))}
            </div>`,
            "apps.projects",
        );
        if (!this.el) return;

        const el = this.el;
        el.querySelector("#connect4").addEventListener("click", () => new Connect4Window(locale));
        el.querySelector("#maze-game").addEventListener("click", () => new MazeGameWindow(locale));
        el.querySelector("#faithbot").addEventListener(
            "click",
            () => new PopupWindow(locale, "file", "https://github.com/mimikyumochi/FaithBot", "folder projects"),
        );
        el.querySelector("#mazegen").addEventListener(
            "click",
            () => new PopupWindow(locale, "file", "https://github.com/mimikyumochi/hunt-and-kill", "folder projects"),
        );
        el.querySelector("#website").addEventListener(
            "click",
            () =>
                new PopupWindow(
                    locale,
                    "file",
                    "https://github.com/mimikyumochi/mimikyumochi.github.io",
                    "folder projects",
                ),
        );
        el.querySelector("#clock").addEventListener("click", () => new ClockWindow(locale));
        el.querySelector("#tomoko").addEventListener("click", () => new TomokoWindow(locale));
    }
}
export class SocialsWindow extends Window {
    constructor(locale) {
        let isDark = localStorage.getItem("mainDarkMode") == "true" ? "" : "-dark";

        super(
            "folder socials",
            locale.apps.socials,
            `<div class="folder__grid">
                ${folderItem("github", imgIcon(`assets/icons/github${isDark}.svg`), plainLabel("github.web"))}
                ${folderItem("youtube", imgIcon("assets/icons/youtube.svg"), plainLabel("youtube.web"))}
                ${folderItem("instagram", imgIcon("assets/icons/instagram.svg"), plainLabel("instagram.web"))}
                ${folderItem("pronouns-page", imgIcon("assets/icons/pronouns.page.svg"), plainLabel("pronouns.page.web"))}
                ${folderItem("twitter", imgIcon("assets/icons/twitter.svg"), plainLabel("twitter.web"))}
                ${folderItem("modrinth", imgIcon("assets/icons/modrinth.svg"), plainLabel("modrinth.web"))}
            </div>`,
            "apps.socials",
        );
        if (!this.el) return;

        const links = {
            github: "https://github.com/mimikyumochi",
            youtube: "https://youtube.com/@mimikyumochii",
            instagram: "https://instagram.com/mimikyumochi",
            "pronouns-page": "https://pronouns.page/@mimikyumochi",
            twitter: "https://twitter.com/mimikyumochii",
            modrinth: "https://modrinth.com/user/mimikyumochi",
        };
        for (const [id, url] of Object.entries(links)) {
            this.el
                .querySelector(`#${id}`)
                .addEventListener("click", () => new PopupWindow(locale, "link", url, "socials"));
        }
    }
}
export class ModsWindow extends Window {
    constructor(locale) {
        super(
            "folder mods",
            locale.apps.mods,
            `<div class="folder__grid">
                ${folderItem("chiyoko", imgIcon("assets/icons/modrinth.svg"), plainLabel("chiyoko.jar"))}
                ${folderItem("opentolanfix", imgIcon("assets/icons/modrinth.svg"), plainLabel("open-to-lan-fix.jar"))}
            </div>`,
            "apps.mods",
        );
        if (!this.el) return;

        const el = this.el;
        el.querySelector("#chiyoko").addEventListener(
            "click",
            () => new PopupWindow(locale, "link", "https://modrinth.com/mod/chiyoko", "mods"),
        );
        el.querySelector("#opentolanfix").addEventListener(
            "click",
            () => new PopupWindow(locale, "link", "https://modrinth.com/mod/open-to-lan-fix", "mods"),
        );
    }
}

export class FriendsWindow extends Window {
    constructor(locale) {
        const friends = [
            ["abril", "abi", "https://tilde.town/~abril/"],
            ["crystalsrl", "crystal", "https://crystalsrl.carrd.co/"],
            ["cylscooler", "cyl"],
            ["eira", "eira", "https://en.pronouns.page/@eirasv"],
            ["fanda", "fanda", "https://seedcrack.com/"],
            ["lunar", "lunar", "https://en.pronouns.page/@sleepyylunar"],
            ["m8use", "m8use", "https://m8use.com"],
            ["meox", "meox", "https://meox.moe/user/meox/about/meox_.html"],
            ["showme7", "showme7"],
        ];

        super(
            "folder friends",
            locale.apps.friends,
            `<div class="folder__grid">
                ${friends
                    .map(([id, label]) => folderItem(id, imgIcon(`assets/people/${id}.webp`), plainLabel(label)))
                    .join("")}
            </div>`,
            "apps.friends",
        );
        if (!this.el) return;

        for (const [id, , url] of friends) {
            if (url) {
                this.el
                    .querySelector(`#${id}`)
                    .addEventListener("click", () => new PopupWindow(locale, "link", url, "friends"));
            }
        }
        this.el.querySelector("#cylscooler").addEventListener("click", () => new CylscoolerWindow(locale));
        this.el.querySelector("#showme7").addEventListener("click", () => new ShowMe7Window(locale));
    }
}

export class CylscoolerWindow extends Window {
    constructor(locale) {
        super("cylscooler", "cylscooler", iframe("abouts/cylscooler.html", "cylscooler"));
    }
}
export class ShowMe7Window extends Window {
    constructor(locale) {
        super("showme7", "showme7", iframe("abouts/showme7.html", "showme7"));
    }
}

export class SpeedrunsWindow extends Window {
    constructor(locale) {
        const games = [
            ["Superliminal", [["Any% Glitchless", "24:24.7"]]],
            ["Minecraft: Java", [["Ranked - Village", "19:53.361"]]],
            [
                "Minecraft: Bedrock",
                [
                    ["1.16 SSG", "6:46"],
                    ["1.18+ SSG", "3:12"],
                ],
            ],
        ];

        super(
            "speedruns",
            `${locale.apps.speedruns} pbs`,
            `<div class="speedruns">
                ${games
                    .map(
                        ([game, runs]) => `
                    <section class="speedruns__game">
                        <h2 class="speedruns__title">${game}</h2>
                        ${runs
                            .map(
                                ([category, time]) =>
                                    `<p class="pb"><span class="pb__category">${category}</span><span class="pb__time">${time}</span></p>`,
                            )
                            .join("")}
                    </section>`,
                    )
                    .join("")}
            </div>`,
        );
    }
}

export class Connect4Window extends Window {
    constructor(locale) {
        super("connect4", `${locale.apps.connect4} :o`, iframe("connect4", "connect4"));
    }
}

export class MazeGameWindow extends Window {
    constructor(locale) {
        super("maze", `${locale.apps.maze} c:`, iframe("maze", "maze"));
    }
}

export class ClockWindow extends Window {
    constructor(locale) {
        super("clock", `${locale.apps.clock}?!`, iframe("clocks-clock", "clock"));
    }
}

export class TomokoWindow extends Window {
    constructor(locale) {
        super("tomoko", "tomoko :3", iframe("tomoko", "tomoko", 0.8));
    }
}

export class SettingsWindow extends Window {
    constructor(locale) {
        const checked = localStorage.getItem("mainDarkMode") == "true" ? "checked" : "";
        const lang = document.documentElement.lang;

        super(
            "settings",
            locale.settings.title,
            `<div class="setting-row">
                <label class="setting-row__label" for="theme-switch" data-i18n="settings.theme">${locale.settings.theme}</label>
                <label class="switch">
                    <input class="switch__input" id="theme-switch" type="checkbox" ${checked} />
                    <span class="switch__slider"></span>
                </label>
            </div>
            <div class="setting-row">
                <label class="setting-row__label" for="language-select" data-i18n="settings.language">${locale.settings.language}</label>
                <select class="language-select" id="language-select">
                    ${["de", "en", "es", "fr", "nl"]
                        .map(
                            (code) =>
                                `<option lang="${code}" value="${code}" ${lang == code ? "selected" : ""}>${getFromLocale(code, "settings.languageName")}</option>`,
                        )
                        .join("")}
                </select>
            </div>`,
            "settings.title",
        );
        if (!this.el) return;

        this.el.querySelector("#theme-switch").addEventListener("change", toggleTheme);
        this.el.querySelector("#language-select").addEventListener("change", (e) => loadLang(e.target.value));
    }
}
