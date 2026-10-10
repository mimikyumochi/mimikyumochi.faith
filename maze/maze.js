
const SIZE = 10;
const START = 0;
const GOAL = SIZE * SIZE - 1;

// share codes are one hex digit per cell with each wall as one bit
const WALL_BITS = { up: 8, down: 4, left: 2, right: 1 };
const SHARE_CODE_PATTERN = new RegExp(`^[0-9a-f]{${SIZE * SIZE}}$`, "i");

const DIRECTIONS = {
    up: { dRow: -1, dCol: 0, opposite: "down" },
    down: { dRow: 1, dCol: 0, opposite: "up" },
    left: { dRow: 0, dCol: -1, opposite: "right" },
    right: { dRow: 0, dCol: 1, opposite: "left" },
};

const ARROW_KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };

const STORAGE = { shareCode: "shareCode", darkMode: "darkMode" };

const mazeEl = document.querySelector(".maze");
const timerEl = document.querySelector(".timer");
const shareInput = document.querySelector(".share-code-input");
const themeButton = document.querySelector(".theme-toggle");

const cellEls = Array.from({ length: SIZE * SIZE }, () => {
    const el = document.createElement("div");
    el.className = "square";
    return mazeEl.appendChild(el);
});

let grid = [];
let player = START;
let startTime = null;
let endTime = null;
let frame = null;

function neighbour(index, direction) {
    const row = Math.floor(index / SIZE) + DIRECTIONS[direction].dRow;
    const col = (index % SIZE) + DIRECTIONS[direction].dCol;
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return null;
    return row * SIZE + col;
}

// aldous broder random walk that knocks down a wall whenever it steps into an unvisited cell
function generateGrid() {
    const cells = Array.from({ length: SIZE * SIZE }, () => ({ up: true, down: true, left: true, right: true }));
    const visited = new Set();

    let current = Math.floor(Math.random() * cells.length);
    visited.add(current);

    while (visited.size < cells.length) {
        const moves = Object.keys(DIRECTIONS)
            .map((direction) => [direction, neighbour(current, direction)])
            .filter(([, next]) => next !== null);
        const [direction, next] = moves[Math.floor(Math.random() * moves.length)];

        if (!visited.has(next)) {
            cells[current][direction] = false;
            cells[next][DIRECTIONS[direction].opposite] = false;
            visited.add(next);
        }
        current = next;
    }

    return cells;
}

function encode(cells) {
    return cells
        .map((cell) => {
            let code = 0;
            for (const [wall, bit] of Object.entries(WALL_BITS)) {
                if (cell[wall]) code |= bit;
            }
            return code.toString(16);
        })
        .join("");
}

function decode(code) {
    return [...code].map((char) => {
        const value = parseInt(char, 16);
        const cell = {};
        for (const [wall, bit] of Object.entries(WALL_BITS)) {
            cell[wall] = (value & bit) !== 0;
        }
        return cell;
    });
}

function loadMaze(cells, { updateInput = true } = {}) {
    grid = cells;
    const code = encode(grid);
    localStorage.setItem(STORAGE.shareCode, code);
    if (updateInput) shareInput.value = code;
    fitShareInput();
    resetRun();
}

function fitShareInput() {
    // reset first so scrollHeight can shrink as well as grow
    shareInput.style.height = "auto";
    shareInput.style.height = `${shareInput.scrollHeight}px`;
}

function move(direction) {
    if (grid[player][direction]) return;
    const next = neighbour(player, direction);
    if (next === null) return;

    if (startTime === null) {
        startTime = performance.now();
        frame = requestAnimationFrame(tick);
    }

    player = next;

    if (player === GOAL && endTime === null) {
        endTime = performance.now();
        renderTimer();
    }

    renderMaze();
}

function resetRun() {
    cancelAnimationFrame(frame);
    player = START;
    startTime = null;
    endTime = null;
    renderTimer();
    renderMaze();
}

function renderMaze() {
    cellEls.forEach((el, i) => {
        el.classList.toggle("wall-up", grid[i].up);
        el.classList.toggle("wall-right", grid[i].right);
        el.textContent = i === player ? "🐀" : i === GOAL ? "🧀" : "";
    });
}

function renderTimer() {
    const seconds = startTime === null ? 0 : ((endTime ?? performance.now()) - startTime) / 1000;
    timerEl.textContent = `${seconds.toFixed(3)}s`;
}

function tick() {
    renderTimer();
    if (endTime === null) frame = requestAnimationFrame(tick);
}

function setDarkMode(dark) {
    document.documentElement.classList.toggle("dark-theme", dark);
    themeButton.textContent = dark ? "☀" : "☾";
    localStorage.setItem(STORAGE.darkMode, dark);
}

document.addEventListener("keydown", (e) => {
    if (e.target === shareInput) return; // let arrow keys move the text cursor
    const direction = ARROW_KEYS[e.key];
    if (!direction) return;
    e.preventDefault();
    move(direction);
});

document.querySelectorAll(".mobile-controls [data-dir]").forEach((button) => {
    button.addEventListener("click", () => move(button.dataset.dir));
});

document.querySelector(".new-maze").addEventListener("click", () => loadMaze(generateGrid()));
document.querySelector(".reset").addEventListener("click", resetRun);

// the code rewraps when the maze width changes
addEventListener("resize", fitShareInput);

shareInput.addEventListener("input", () => {
    fitShareInput();
    const code = shareInput.value.trim();
    if (SHARE_CODE_PATTERN.test(code)) loadMaze(decode(code), { updateInput: false });
});

document.querySelector(".copy-share-code").addEventListener("click", () => {
    navigator.clipboard?.writeText(shareInput.value).catch((err) => console.error("failed to copy:", err));
});

themeButton.addEventListener("click", () => {
    setDarkMode(!document.documentElement.classList.contains("dark-theme"));
});

setDarkMode(localStorage.getItem(STORAGE.darkMode) === "true");

const savedCode = localStorage.getItem(STORAGE.shareCode);
loadMaze(savedCode && SHARE_CODE_PATTERN.test(savedCode) ? decode(savedCode) : generateGrid());
