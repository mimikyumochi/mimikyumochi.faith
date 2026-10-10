import { Window } from "./windowBase.js";
import { getLocale } from "./util.js";
import { h, icon } from "./core/dom.js";

const GITHUB_USER = "mimikyumochi";
const MODRINTH_USER = "mimikyumochi";
const FONT = "https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap";

// cached for the session so reopening a window doesn't eat github's 60 requests an hour
async function get(url, accept = "application/json") {
    const key = `api:${accept}:${url}`;
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    const res = await fetch(url, { headers: { Accept: accept } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const data = accept.endsWith("json") && !accept.includes("html") ? await res.json() : await res.text();

    cache(url, data, accept);
    return data;
}

function cache(url, data, accept = "application/json") {
    try {
        sessionStorage.setItem(`api:${accept}:${url}`, JSON.stringify(data));
    } catch {}
}

const lang = () => document.documentElement.lang;
const formatNumber = (n) => n.toLocaleString(lang());
const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(lang(), { year: "numeric", month: "short", day: "numeric" });

const header = (avatar, title, subtitle, round = false) =>
    h(
        "header",
        { class: "detail__header" },
        avatar && h("img", { class: `detail__avatar${round ? " detail__avatar--round" : ""}`, src: avatar, alt: "" }),
        h(
            "div",
            {},
            h("h2", { class: "detail__title" }, title),
            subtitle && h("p", { class: "detail__subtitle" }, subtitle),
        ),
    );

const description = (text) => text && h("p", { class: "detail__description" }, text);

/** stats: [[faIcon, text, label], ...], entries with no text are skipped */
const stats = (entries) =>
    h(
        "ul",
        { class: "detail__stats" },
        entries
            .filter(([, text]) => text != null && text !== "")
            .map(([fa, text, label]) => h("li", { title: label }, icon(fa), String(text))),
    );

const tags = (list) =>
    list.length > 0 &&
    h(
        "ul",
        { class: "detail__tags" },
        list.map((tag) => h("li", { class: "detail__tag" }, tag)),
    );

const listItem = ({ image, fa, title, text, meta, onclick }) =>
    h(
        "li",
        {},
        h(
            "button",
            { class: "detail__item", onclick },
            image ? h("img", { class: "detail__item-icon", src: image, alt: "" }) : icon(`${fa} detail__item-icon`),
            h(
                "span",
                { class: "detail__item-text" },
                h("span", { class: "detail__item-title" }, title),
                text && h("span", {}, text),
                meta && h("span", { class: "detail__item-meta" }, meta),
            ),
        ),
    );

const openLink = (url, site, fa) =>
    h(
        "div",
        { class: "detail__actions" },
        h(
            "a",
            { class: "btn btn--confirm detail__open", href: url, target: "_blank", rel: "noopener" },
            icon(fa),
            `${site} ↗`,
        ),
    );

// relative links and images in a readme point at the repo, not at this page
function fixReadme(html, repo) {
    // DOMParser doesn't run scripts or load images, it only parses
    const doc = new DOMParser().parseFromString(html, "text/html");
    const raw = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`;
    const blob = `${repo.html_url}/blob/${repo.default_branch}/`;
    const resolve = (url, base) => (/^([a-z]+:|\/\/|#)/i.test(url) ? url : new URL(url.replace(/^\//, ""), base).href);

    for (const img of doc.querySelectorAll("img[src]")) img.src = resolve(img.getAttribute("src"), raw);
    for (const a of doc.querySelectorAll("a[href]")) a.href = resolve(a.getAttribute("href"), blob);
    // the link icons next to headings, github's own css hides these
    for (const anchor of doc.querySelectorAll("a.anchor")) anchor.remove();

    return doc.body.innerHTML;
}

// sandboxed without scripts, allow-same-origin only so the height can be read
function readme(html, repo) {
    const css = getComputedStyle(document.documentElement);
    const colour = (name) => `rgb(${css.getPropertyValue(name).trim()})`;
    const frame = h("iframe", {
        class: "detail__readme",
        title: "readme",
        sandbox: "allow-same-origin allow-popups allow-popups-to-escape-sandbox",
        srcdoc: `<!doctype html>
            <base target="_blank">
            <link rel="stylesheet" href="${FONT}">
            <style>
                :root { color-scheme: ${document.documentElement.dataset.theme}; }
                body { margin: 0; font-family: "Quicksand", sans-serif; color: ${colour("--text1")}; overflow: hidden; }
                a { color: ${css.getPropertyValue("--accent")}; }
                img { max-width: 100%; }
                svg.octicon { width: 1em; height: 1em; fill: currentColor; vertical-align: middle; }
                pre, code { background: ${colour("--bg3")}; border-radius: 5px; }
                code { padding: 0.1em 0.3em; }
                pre { padding: 1em; overflow-x: auto; }
                pre code { padding: 0; }
                table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
                td, th { padding: 0.3em 0.6em; border: 1px solid ${colour("--bg3")}; }
                h1, h2 { padding-bottom: 0.3em; border-bottom: 1px solid ${colour("--bg3")}; }
                hr { border: none; border-top: 1px solid ${colour("--bg3")}; }
            </style>
            ${fixReadme(html, repo)}`,
    });
    frame.addEventListener("load", () => {
        const doc = frame.contentDocument;
        // documentElement rather than body, so the last element's margin isn't cut off
        const fit = () => (frame.style.height = `${doc.documentElement.scrollHeight}px`);
        new ResizeObserver(fit).observe(doc.body);
        fit();
    });
    return frame;
}

/** load() resolves to the children to show. it's a closure because it runs before subclass fields exist */
class DetailWindow extends Window {
    constructor(type, title, load, fallback) {
        const root = h(
            "div",
            { class: "detail" },
            h("p", { class: "detail__status" }, icon("fa-solid fa-spinner fa-spin")),
        );
        super(type, title, root);
        if (!this.el) return;
        this.el.classList.add("window--detail");

        load().then(
            (children) => root.replaceChildren(...children.filter(Boolean)),
            (error) => {
                console.warn(error);
                root.replaceChildren(
                    h(
                        "p",
                        { class: "detail__status" },
                        icon("fa-solid fa-heart-crack"),
                        " ",
                        h("span", { "data-i18n": "detail.error" }, getLocale().detail.error),
                    ),
                    fallback,
                );
            },
        );
    }
}

export class GithubProfileWindow extends DetailWindow {
    constructor() {
        const url = `https://github.com/${GITHUB_USER}`;
        super(
            "github",
            "github",
            async () => {
                const [user, repos] = await Promise.all([
                    get(`https://api.github.com/users/${GITHUB_USER}`),
                    get(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`),
                ]);
                for (const repo of repos) cache(repo.url, repo);
                return [
                    header(user.avatar_url, user.name ?? user.login, `@${user.login}`, true),
                    description(user.bio),
                    stats([
                        ["fa-solid fa-users", formatNumber(user.followers), "followers"],
                        ["fa-solid fa-book", formatNumber(user.public_repos), "repositories"],
                    ]),
                    h(
                        "ul",
                        { class: "detail__list" },
                        repos
                            .filter((repo) => !repo.fork)
                            .map((repo) =>
                                listItem({
                                    fa: "fa-solid fa-book-bookmark",
                                    title: repo.name,
                                    text: repo.description,
                                    meta: [repo.language, repo.stargazers_count > 0 && `★ ${repo.stargazers_count}`]
                                        .filter(Boolean)
                                        .join(" · "),
                                    onclick: () => new RepoWindow(repo.name),
                                }),
                            ),
                    ),
                    openLink(user.html_url, "github", "fa-brands fa-github"),
                ];
            },
            openLink(url, "github", "fa-brands fa-github"),
        );
    }
}

export class RepoWindow extends DetailWindow {
    constructor(name) {
        const api = `https://api.github.com/repos/${GITHUB_USER}/${name}`;
        super(
            `repo-${name.toLowerCase()}`,
            name,
            async () => {
                const [repo, html] = await Promise.all([
                    get(api),
                    get(`${api}/readme`, "application/vnd.github.html+json").catch(() => null),
                ]);
                return [
                    header(repo.owner.avatar_url, repo.name, repo.full_name, true),
                    description(repo.description),
                    stats([
                        ["fa-solid fa-star", formatNumber(repo.stargazers_count), "stars"],
                        ["fa-solid fa-code-fork", formatNumber(repo.forks_count), "forks"],
                        ["fa-solid fa-code", repo.language, "language"],
                        ["fa-solid fa-clock-rotate-left", formatDate(repo.pushed_at), "last updated"],
                    ]),
                    tags(repo.topics ?? []),
                    html && readme(html, repo),
                    openLink(repo.html_url, "github", "fa-brands fa-github"),
                ];
            },
            openLink(`https://github.com/${GITHUB_USER}/${name}`, "github", "fa-brands fa-github"),
        );
    }
}

export class ModrinthProfileWindow extends DetailWindow {
    constructor() {
        const url = `https://modrinth.com/user/${MODRINTH_USER}`;
        super(
            "modrinth",
            "modrinth",
            async () => {
                const [user, projects] = await Promise.all([
                    get(`https://api.modrinth.com/v2/user/${MODRINTH_USER}`),
                    get(`https://api.modrinth.com/v2/user/${MODRINTH_USER}/projects`),
                ]);
                return [
                    header(user.avatar_url, user.username, null, true),
                    description(user.bio),
                    stats([
                        [
                            "fa-solid fa-download",
                            formatNumber(projects.reduce((total, project) => total + project.downloads, 0)),
                            "downloads",
                        ],
                        ["fa-solid fa-cube", formatNumber(projects.length), "projects"],
                    ]),
                    h(
                        "ul",
                        { class: "detail__list" },
                        projects
                            .sort((a, b) => b.downloads - a.downloads)
                            .map((project) =>
                                listItem({
                                    image: project.icon_url,
                                    fa: "fa-solid fa-cube",
                                    title: project.title,
                                    text: project.description,
                                    meta: `${formatNumber(project.downloads)} downloads`,
                                    onclick: () => new ModWindow(project.slug),
                                }),
                            ),
                    ),
                    openLink(url, "modrinth", "fa-solid fa-cube"),
                ];
            },
            openLink(url, "modrinth", "fa-solid fa-cube"),
        );
    }
}

export class ModWindow extends DetailWindow {
    constructor(slug) {
        const url = `https://modrinth.com/mod/${slug}`;
        super(
            `mod-${slug}`,
            slug,
            async () => {
                const mod = await get(`https://api.modrinth.com/v2/project/${slug}`);
                const versions = mod.game_versions;
                return [
                    header(mod.icon_url, mod.title, mod.categories.join(" · ")),
                    description(mod.description),
                    stats([
                        ["fa-solid fa-download", formatNumber(mod.downloads), "downloads"],
                        ["fa-solid fa-heart", formatNumber(mod.followers), "followers"],
                        ["fa-solid fa-clock-rotate-left", formatDate(mod.updated), "last updated"],
                    ]),
                    tags(
                        [
                            ...mod.loaders,
                            versions.length > 1 ? `${versions[0]} – ${versions.at(-1)}` : versions[0],
                        ].filter(Boolean),
                    ),
                    mod.gallery.length > 0 &&
                        h(
                            "div",
                            { class: "detail__gallery" },
                            mod.gallery.map((image) =>
                                h("img", { src: image.url, alt: image.title ?? "", loading: "lazy" }),
                            ),
                        ),
                    openLink(`https://modrinth.com/${mod.project_type}/${mod.slug}`, "modrinth", "fa-solid fa-cube"),
                ];
            },
            openLink(url, "modrinth", "fa-solid fa-cube"),
        );
    }
}
