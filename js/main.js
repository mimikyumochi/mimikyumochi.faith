import {
    AboutWindow,
    LikesWindow,
    ProjectsWindow,
    SpecsWindow,
    SocialsWindow,
    SettingsWindow,
    SpeedrunsWindow,
    ModsWindow,
    FriendsWindow,
} from "./windows.js";
import {
    updateClock,
    loadTheme,
    loadLang,
    preloadLocales,
    closeTopWindow,
    addActiveWindowWidgetListeners,
} from "./util.js";

document.getElementById("about").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new AboutWindow(locale);
        });
});
document.getElementById("likes").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new LikesWindow(locale);
        });
});
document.getElementById("projects").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new ProjectsWindow(locale);
        });
});
document.getElementById("specs").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new SpecsWindow(locale);
        });
});
document.getElementById("socials").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new SocialsWindow(locale);
        });
});
document.getElementById("mods").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new ModsWindow(locale);
        });
});
document.getElementById("friends").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new FriendsWindow(locale);
        });
});
document.getElementById("speedruns").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new SpeedrunsWindow(locale);
        });
});
document.getElementById("settings").addEventListener("click", () => {
    let currentLang = document.documentElement.lang.toLowerCase();
    fetch(`lang/${currentLang}.json`)
        .then((res) => res.json())
        .then((locale) => {
            new SettingsWindow(locale);
        });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeTopWindow();
    }
});

addActiveWindowWidgetListeners();

loadTheme();
updateClock();
setInterval(updateClock, 1000);

await preloadLocales();
loadLang(localStorage.getItem("lang") ?? "en");
