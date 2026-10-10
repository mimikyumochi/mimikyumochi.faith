import { Window } from "./windowBase.js";
import { PopupWindow } from "./popupWindow.js";
import { getFromLocale, toggleTheme, loadLang } from "./util.js";
import { GithubProfileWindow, RepoWindow, ModrinthProfileWindow, ModWindow } from "./detailWindows.js";

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

const iframe = (src, title, zoom = 0.7, attrs = "", fallback = "") => `
    <div class="iframe-frame" style="--zoom: ${zoom}">
        <iframe src="${src}" title="${title}" ${attrs}>${fallback}</iframe>
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
        el.querySelector("#faithbot").addEventListener("click", () => new RepoWindow("FaithBot"));
        el.querySelector("#mazegen").addEventListener("click", () => new RepoWindow("hunt-and-kill"));
        el.querySelector("#website").addEventListener("click", () => new RepoWindow("mimikyumochi.faith"));
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
            youtube: "https://youtube.com/@mimikyumochii",
            instagram: "https://instagram.com/mimikyumochi",
            twitter: "https://twitter.com/mimikyumochii",
        };
        for (const [id, url] of Object.entries(links)) {
            this.el
                .querySelector(`#${id}`)
                .addEventListener("click", () => new PopupWindow(locale, "link", url, "socials"));
        }
        this.el.querySelector("#pronouns-page").addEventListener("click", () => new PronounsWindow(locale));
        this.el.querySelector("#github").addEventListener("click", () => new GithubProfileWindow());
        this.el.querySelector("#modrinth").addEventListener("click", () => new ModrinthProfileWindow());
    }
}
export class ModsWindow extends Window {
    constructor(locale) {
        super(
            "folder mods",
            locale.apps.mods,
            `<div class="folder__grid">
                ${folderItem("chiyoko-loot", imgIcon("assets/icons/modrinth.svg"), plainLabel("chiyoko-loot.jar"))}
                ${folderItem("opentolanfix", imgIcon("assets/icons/modrinth.svg"), plainLabel("open-to-lan-fix.jar"))}
                ${folderItem("betterquicksell", imgIcon("assets/icons/modrinth.svg"), plainLabel("betterquicksell.jar"))}
            </div>`,
            "apps.mods",
        );
        if (!this.el) return;

        const el = this.el;
        el.querySelector("#chiyoko-loot").addEventListener("click", () => new ModWindow("chiyoko-loot"));
        el.querySelector("#opentolanfix").addEventListener("click", () => new ModWindow("open-to-lan-fix"));
        el.querySelector("#betterquicksell").addEventListener("click", () => new ModWindow("betterquicksell"));
    }
}

// friends with a `page` open in a window, the rest go through the link popup
const friends = [
    { id: "abril", label: "abi", page: "https://tilde.town/~abril/" },
    { id: "crystalsrl", label: "crystal", url: "https://crystalsrl.carrd.co/" },
    { id: "cylscooler", label: "cyl", title: "cylscooler", page: "abouts/cylscooler.html" },
    { id: "eira", label: "eira", page: "https://en.pronouns.page/card/@eirasv?embed=true", zoom: 1 },
    // seedcrack needs SharedArrayBuffer, which only works when it's not in an iframe
    { id: "fanda", label: "fanda", url: "https://seedcrack.com/" },
    { id: "lunar", label: "lunar", page: "https://en.pronouns.page/card/@sleepyylunar?embed=true", zoom: 1 },
    { id: "m8use", label: "m8use", page: "https://m8use.com" },
    { id: "meox", label: "meox", page: "https://meox.moe/user/meox/about/meox_.html" },
    { id: "showme7", label: "showme7", page: "abouts/showme7.html" },
];

// sandboxed without allow-top-navigation so embedded sites can't redirect the whole page
const externalFrame = (src, title, zoom) =>
    iframe(
        src,
        title,
        zoom,
        `loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`,
    );

export class FriendsWindow extends Window {
    constructor(locale) {
        super(
            "folder friends",
            locale.apps.friends,
            `<div class="folder__grid">
                ${friends
                    .map(({ id, label }) => folderItem(id, imgIcon(`assets/people/${id}.webp`), plainLabel(label)))
                    .join("")}
            </div>`,
            "apps.friends",
        );
        if (!this.el) return;

        for (const friend of friends) {
            this.el
                .querySelector(`#${friend.id}`)
                .addEventListener("click", () =>
                    friend.page ? new FriendWindow(friend) : new PopupWindow(locale, "link", friend.url, "friends"),
                );
        }
    }
}

export class FriendWindow extends Window {
    constructor({ id, label, title = label, page, zoom }) {
        const content = page.startsWith("https://") ? externalFrame(page, title, zoom) : iframe(page, title, zoom);
        super(id, title, content);
    }
}

export class PronounsWindow extends Window {
    constructor(locale) {
        super(
            "pronouns",
            "pronouns.page",
            externalFrame("https://en.pronouns.page/card/@mimikyumochi?embed=true", "pronouns.page", 1),
        );
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
