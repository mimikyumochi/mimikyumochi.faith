import { Window } from './windowBase.js';
import { PopupWindow } from './popupWindow.js';
import { getFromLocale, toggleTheme, loadLang } from './util.js';


export class AboutWindow extends Window {
    constructor(locale) {
        super("about", `${locale.about.title}`, `
                <p data-i18n="about.age"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.age}</p>
                <p data-i18n="about.relationship"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.relationship}</p>
                <p data-i18n="about.kotlin"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.kotlin}</p>
                <p data-i18n="about.hatepeople"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.hatepeople}</p>
                <p data-i18n="about.eepy"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.eepy}</p>
                <p data-i18n="about.frontend"><i class="fa-regular fa-heart" style="color:lightskyblue"></i> ${locale.about.frontend}</p>
            `)
    }
}
export class LikesWindow extends Window {
    constructor(locale) {
        super("likes", `${locale.likes.title}`, `
                <p data-i18n="likes.animals"><i class="fa-regular fa-heart" style="color:pink"></i> ${locale.likes.animals}</p>
                <p data-i18n="likes.seedfind"><i class="fa-regular fa-heart" style="color:pink"></i> ${locale.likes.seedfind}</p>
                <p data-i18n="likes.speedrun"><i class="fa-regular fa-heart" style="color:pink"></i> ${locale.likes.speedrun}</p>
                <p data-i18n="likes.maze"><i class="fa-regular fa-heart" style="color:pink"></i> ${locale.likes.maze}</a></p>
                <p data-i18n="likes.rlai"><i class="fa-regular fa-heart" style="color:pink"></i> ${locale.likes.rlai}</p>
                `)
    }
}

export class SpecsWindow extends Window {
    constructor(locale) {
        super("specs", `${locale.specs.title}`, `
                <p><i class="fa-solid fa-microchip"></i> AMD Ryzen 7 5700X</p>
                <p><i class="fa-solid fa-memory"></i> 32 GB (4 x 8 GB) DDR4 3200</p>
                <p><i class="fa-solid fa-hard-drive"></i> Samsung 980 Pro 1TB SSD
                <p><i class="fa-solid fa-hard-drive"></i> Samsung 860 QVO 1TB SSD</p>
                <p><i class="fa-solid fa-hard-drive"></i> Western Digital Blue 1TB HDD
                <p><i class="fa-solid fa-hard-drive"></i> Seagate Exos 8TB HDD</p>
                <p><i class="fa-solid fa-display"></i>MSI RTX 3060</p>
                <p><a href="https://uk.pcpartpicker.com/list/gV3s9C" target="_blank" style="font-weight:bold"><i class="fa-solid fa-link"></i> ${locale.specs.link}</a></p>
            `)
    }
}

export class ProjectsWindow extends Window {
    constructor(locale) {
        super("folder projects", `${locale.apps.projects}`, `
            
            <div class="app-icon" id="connect4">
                <i class="fa-solid fa-circle" id="red" style="color: rgb(255, 93, 93);"></i>
                <i class="fa-solid fa-circle" id="yellow" style="color: rgb(255, 255, 158);"></i>
                <span data-app="app" class="app-label" data-i18n="apps.connect4">${locale.apps.connect4}.${locale.misc.app}</span>
            </div>

            <div class="app-icon" id="maze-game">
                <i class="fa-solid fa-signs-post"></i>
                <span data-app="app" class="app-label" data-i18n="apps.maze">${locale.apps.maze}.${locale.misc.app}</span>
            </div>

            <div class="app-icon" id="faithbot">
                <i class="fa-solid fa-robot"></i>
                <span data-app="py" class="app-label" data-i18n="apps.faithbot">${locale.apps.faithbot}.${locale.misc.py}</span>
            </div>

            <div class="app-icon" id="mazegen">
                <i class="fa-solid fa-compass"></i>
                <span data-app="py" class="app-label" data-i18n="apps.mazegen">${locale.apps.mazegen}.${locale.misc.py}</span>
            </div>

            <div class="app-icon" id="website">
                <i class="fa-solid fa-code"></i>
                <span data-app="web" class="app-label" data-i18n="apps.website">${locale.apps.website}.${locale.misc.web}</span>
            </div>

            <div class="app-icon" id="clock">
                <i class="fa-solid fa-clock"></i>
                <span data-app="app" class="app-label" data-i18n="apps.clock">${locale.apps.clock}.${locale.misc.app}</span>
            </div>
            
            <div class="app-icon" id="tomoko">
            <i class="fa-solid fa-chess-knight"></i>
                <span data-app="app" class="app-label">tomoko.py</span>
            </div>


            `)
        
        const el = this.el;
        el.querySelector("#connect4").addEventListener("click", (e) => {
            e.stopPropagation();
            new Connect4Window(locale);
        });

        el.querySelector("#maze-game").addEventListener("click", (e) => {
            e.stopPropagation();
            new MazeGameWindow(locale);
        });

        el.querySelector("#faithbot").addEventListener("click", (e) => {
            e.stopPropagation();
            new PopupWindow(locale, "file", "https://github.com/mimikyumochi/FaithBot", "folder projects");
        });

        el.querySelector("#mazegen").addEventListener("click", (e) => {
            e.stopPropagation();
            new PopupWindow(locale, "file", "https://github.com/mimikyumochi/hunt-and-kill",  "folder projects");
        });

        el.querySelector("#clock").addEventListener("click", (e) => {
            e.stopPropagation();
            new ClockWindow(locale);
        });
        el.querySelector("#tomoko").addEventListener("click", (e) => {
            e.stopPropagation();
            new TomokoWindow(locale);
        });
    }
}
export class SocialsWindow extends Window {
    constructor(locale) {
        let isDark = localStorage.getItem("mainDarkMode") == "true" ? "" : "-dark"

        super("folder socials", `${locale.apps.socials}`, `

            <div class="app-icon" id="github">
                <img class="icon-img" src="assets/github${isDark}.svg"></img>
                <span class="app-label">github.web</span>
            </div>

            <div class="app-icon" id="youtube">
                <img class="icon-img" src="assets/youtube.svg"></img>
                <span class="app-label">youtube.web</span>
            </div>

            <div class="app-icon" id="instagram">
                <img class="icon-img" src="assets/instagram.svg"></img>
                <span class="app-label">instagram.web</span>

            </div>

            <div class="app-icon" id="pronouns-page"">
                <img class="icon-img" src="assets/pronouns.page.svg"></img>
                <span class="app-label">pronouns.page.web</span>
            </div>

            <div class="app-icon" id="twitter">
                <img class="icon-img" src="assets/twitter.svg"></img>
                <span class="app-label">twitter.web</span>
            </div>
            <div class="app-icon" id="modrinth">
                <img class="icon-img" src="assets/modrinth.svg"></img>
                <span class="app-label">modrinth.web</span>
            </div>
            `)

            const el = this.el;
            el.querySelector("#github").addEventListener("click", () => new PopupWindow(locale, "link", "https://github.com/mimikyumochi", "socials"));
            el.querySelector("#youtube").addEventListener("click", () => new PopupWindow(locale, "link", "https://youtube.com/@mimikyumochii", "socials"));
            el.querySelector("#instagram").addEventListener("click", () => new PopupWindow(locale, "link", "https://instagram.com/mimikyumochi", "socials"));
            el.querySelector("#pronouns-page").addEventListener("click", () => new PopupWindow(locale, "link", "https://pronouns.page/@mimikyumochi", "socials"));
            el.querySelector("#twitter").addEventListener("click", () => new PopupWindow(locale, "link", "https://twitter.com/mimikyumochii", "socials"));
            el.querySelector("#modrinth").addEventListener("click", () => new PopupWindow(locale, "link", "https://modrinth.com/user/mimikyumochi", "socials"));
    }
}
export class ModsWindow extends Window {
    constructor(locale) {
        super("folder mods", `${locale.apps.mods}`, `

            <div class="app-icon" id="chiyoko">
                <img class="icon-img" src="assets/modrinth.svg"></img>
                <span class="app-label">chiyoko.jar</span>
            </div>

            <div class="app-icon" id="opentolanfix">
                <img class="icon-img" src="assets/modrinth.svg"></img>
                <span class="app-label">open-to-lan-fix.jar</span>
            </div>
            `)

        const el = this.el;
        el.querySelector("#chiyoko").addEventListener("click", () => new PopupWindow(locale, "link", "https://modrinth.com/mod/chiyoko", "mods"));
        el.querySelector("#opentolanfix").addEventListener("click", () => new PopupWindow(locale, "link", "https://modrinth.com/mod/open-to-lan-fix", "mods"));
    }
}
export class SpeedrunsWindow extends Window {
    constructor(locale) {
        let isDark = localStorage.getItem("mainDarkMode") == "true" ? "" : "-dark"

        super("speedruns", `${locale.apps.speedruns} pbs`, `
                <div class="game-container">
                    <h1 class="game-title">Superliminal</h1>
                    <div class="pb-container">
                        <p class="pb"><span class="category">Any% Glitchless</span><span class="time">24:24.7</span></p>
                    </div>
                </div>
                <div class="game-container">
                    <h1 class="game-title">Minecraft: Java</h1>
                    <div class="pb-container">
                        <p class="pb"><span class="category">Ranked - Village</span><span class="time">19:53.361</span></p>
                    </div>
                </div>
                <div class="game-container">
                    <h1 class="game-title">Minecraft: Bedrock</h1>
                    <div class="pb-container">
                        <p class="pb"><span class="category">1.16 SSG -</span><span class="time">6:46</span></p>
                    </div>
                    <div class="pb-container">
                        <p class="pb"><span class="category">1.18+ SSG -</span><span class="time">3:12</span></p>
                    </div>
                </div>
            `)
    }
}

export class Connect4Window extends Window {
    constructor(locale) {
        super("connect4", `${locale.apps.connect4} :o`, `
            
            <iframe src="connect4" style="width: 100%; height: 100%; zoom: 0.7; border: none;" id="connect4-iframe"></iframe>

            `)
    }
}

export class MazeGameWindow extends Window {
    constructor(locale) {
        super("maze", `${locale.apps.maze} c:`, `
            
            <iframe src="maze" style="width: 100%; height: 100%; zoom: 0.7; border: none;" id="maze-iframe"></iframe>

            `)
    }
    
}

export class ClockWindow extends Window {
    constructor(locale) {
        super("clock", `${locale.apps.clock}?!`, `
            
            <iframe src="clocks-clock" style="width: 100%; height: 100%; zoom: 0.7; border: none;" id="clock-iframe"></iframe>

            `)
    }
}

export class TomokoWindow extends Window {
    constructor(locale) {
        super("tomoko", `tomoko :3`, `
            
            <iframe src="tomoko" style="width: 100%; height: 100%; zoom: 0.7; border: none;" id="tomoko-iframe"></iframe>

            `)
    }
}
export class SettingsWindow extends Window {
    constructor(locale) {
        let checked = localStorage.getItem("mainDarkMode") == "true" ? "checked" : ""
        super("settings", `${locale.settings.title}`, `
            
            <div class="switch-container">
                <span class="switch-label" data-i18n="settings.theme">${locale.settings.theme}</span>
                <label class="switch" for="theme-switch">
                    <input id="theme-switch" type="checkbox" ${checked}>
                    <span class="slider round"></span>
                </label>
            </div>  
            <div class="lang-selector-container">
                <span class="language-selector-label" for="language-picker-select" data-i18n="settings.language">${locale.settings.language}</span>
                <form action="language-selector">
                    <select name="language-picker-select" id="language-picker-select">
                        <option lang="de" value="de" ${document.documentElement.lang == "de" ? "selected" : ""}>${getFromLocale("de", "settings.languageName")}</option>
                        <option lang="en" value="en" ${document.documentElement.lang == "en" ? "selected" : ""}>${getFromLocale("en", "settings.languageName")}</option>
                        <option lang="es" value="es" ${document.documentElement.lang == "es" ? "selected" : ""}>${getFromLocale("es", "settings.languageName")}</option>
                        <option lang="fr" value="fr" ${document.documentElement.lang == "fr" ? "selected" : ""}>${getFromLocale("fr", "settings.languageName")}</option>
                        <option lang="nl" value="nl" ${document.documentElement.lang == "nl" ? "selected" : ""}>${getFromLocale("nl", "settings.languageName")}</option>
                    </select>
                </form>
            </div>

            `)
        document.getElementById("theme-switch").addEventListener("change", toggleTheme)
        document.getElementById("language-picker-select").addEventListener("change", (e) => { loadLang(e.target.value) })

    }
}
