const username = "TomokoNN";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

const pieceImages = {
    wp: "pieces/wp.svg",
    wn: "pieces/wn.svg",
    wb: "pieces/wb.svg",
    wr: "pieces/wr.svg",
    wq: "pieces/wq.svg",
    wk: "pieces/wk.svg",
    bp: "pieces/bp.svg",
    bn: "pieces/bn.svg",
    bb: "pieces/bb.svg",
    br: "pieces/br.svg",
    bq: "pieces/bq.svg",
    bk: "pieces/bk.svg",
};

let position = {};
let previousPosition = null;
let orientation = "white";

function getOrientation(game) {
    const whiteName = game.players?.white?.user?.name ?? "";
    return whiteName.toLowerCase() === username.toLowerCase() ? "white" : "black";
}

function initBoard(boardOrientation = "white") {
    const board = document.querySelector(".board");
    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const actualRow = boardOrientation === "white" ? row : 7 - row;
            const actualCol = boardOrientation === "white" ? col : 7 - col;

            const square = document.createElement("div");
            square.classList.add("square");
            square.id = `${files[actualCol]}${8 - actualRow}`;

            if ((actualRow + actualCol) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            if (col === 0) {
                const rank = document.createElement("span");
                rank.classList.add("rank");
                rank.textContent = 8 - actualRow;
                square.appendChild(rank);
            }

            if (row === 7) {
                const file = document.createElement("span");
                file.classList.add("file");
                file.textContent = files[actualCol];
                square.appendChild(file);
            }

            board.appendChild(square);
        }
    }
}

function resetPosition() {
    position = {
        a8: "br",
        b8: "bn",
        c8: "bb",
        d8: "bq",
        e8: "bk",
        f8: "bb",
        g8: "bn",
        h8: "br",
        a7: "bp",
        b7: "bp",
        c7: "bp",
        d7: "bp",
        e7: "bp",
        f7: "bp",
        g7: "bp",
        h7: "bp",
        a2: "wp",
        b2: "wp",
        c2: "wp",
        d2: "wp",
        e2: "wp",
        f2: "wp",
        g2: "wp",
        h2: "wp",
        a1: "wr",
        b1: "wn",
        c1: "wb",
        d1: "wq",
        e1: "wk",
        f1: "wb",
        g1: "wn",
        h1: "wr",
    };
}

function positionFromFen(fen) {
    const board = {};
    const placement = fen.split(" ")[0];
    const ranks = placement.split("/");

    for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
        const rankNumber = 8 - rankIndex;
        let fileIndex = 0;

        for (const char of ranks[rankIndex]) {
            if (/\d/.test(char)) {
                fileIndex += Number(char);
                continue;
            }

            const colour = char === char.toUpperCase() ? "w" : "b";
            const type = char.toLowerCase();
            const square = `${files[fileIndex]}${rankNumber}`;

            board[square] = colour + type;
            fileIndex++;
        }
    }

    return board;
}

function renderBoard() {
    document.querySelectorAll(".piece").forEach((piece) => piece.remove());

    for (const [squareName, pieceName] of Object.entries(position)) {
        const square = document.getElementById(squareName);

        if (!square) continue;

        const piece = document.createElement("img");
        piece.classList.add("piece");
        piece.src = pieceImages[pieceName];
        piece.draggable = false;

        square.appendChild(piece);
    }
}

function getChangedSquares(oldPosition, newPosition) {
    const squares = new Set([...Object.keys(oldPosition), ...Object.keys(newPosition)]);
    const changed = [];

    for (const square of squares) {
        if (oldPosition[square] !== newPosition[square]) {
            changed.push(square);
        }
    }

    return changed;
}

function clearHighlights() {
    document.querySelectorAll(".square").forEach((square) => {
        square.classList.remove("last-move", "in-check");
    });
}

function highlightLastMove(changedSquares) {
    changedSquares.forEach((square) => {
        document.getElementById(square)?.classList.add("last-move");
    });
}

function isSquareAttacked(square, byColour, boardPosition) {
    const file = files.indexOf(square[0]);
    const rank = Number(square[1]);
    const prefix = byColour === "white" ? "w" : "b";

    const pieceAt = (f, r) => (f >= 0 && f <= 7 && r >= 1 && r <= 8 ? boardPosition[`${files[f]}${r}`] : undefined);

    const pawnRank = byColour === "white" ? rank - 1 : rank + 1;

    if (pieceAt(file - 1, pawnRank) === prefix + "p" || pieceAt(file + 1, pawnRank) === prefix + "p") {
        return true;
    }

    const knightOffsets = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2],
    ];

    for (const [df, dr] of knightOffsets) {
        if (pieceAt(file + df, rank + dr) === prefix + "n") {
            return true;
        }
    }

    for (let df = -1; df <= 1; df++) {
        for (let dr = -1; dr <= 1; dr++) {
            if (df === 0 && dr === 0) continue;

            if (pieceAt(file + df, rank + dr) === prefix + "k") {
                return true;
            }
        }
    }

    const slides = [
        {
            dirs: [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ],
            types: ["r", "q"],
        },
        {
            dirs: [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1],
            ],
            types: ["b", "q"],
        },
    ];

    for (const { dirs, types } of slides) {
        for (const [df, dr] of dirs) {
            let f = file + df;
            let r = rank + dr;

            while (f >= 0 && f <= 7 && r >= 1 && r <= 8) {
                const piece = pieceAt(f, r);

                if (piece) {
                    if (piece[0] === prefix && types.includes(piece[1])) {
                        return true;
                    }

                    break;
                }

                f += df;
                r += dr;
            }
        }
    }

    return false;
}

function findKingInCheck(colourToMove, boardPosition) {
    const kingPiece = colourToMove === "white" ? "wk" : "bk";
    const kingSquare = Object.entries(boardPosition).find(([, piece]) => piece === kingPiece)?.[0];

    if (!kingSquare) return null;

    const attackerColour = colourToMove === "white" ? "black" : "white";

    return isSquareAttacked(kingSquare, attackerColour, boardPosition) ? kingSquare : null;
}

function formatClock(seconds) {
    if (seconds == null) return "--:--";

    seconds = Math.max(0, seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

let clockTimer = null;

const clockState = {
    whiteSeconds: null,
    blackSeconds: null,
    activeColour: null,
    lastTick: null,
};

function stopClockTimer() {
    if (clockTimer) {
        clearInterval(clockTimer);
        clockTimer = null;
    }
}

function renderClocks(boardOrientation) {
    const tomokoSeconds = boardOrientation === "white" ? clockState.whiteSeconds : clockState.blackSeconds;
    const opponentSeconds = boardOrientation === "white" ? clockState.blackSeconds : clockState.whiteSeconds;

    document.querySelector("#top .player-clock").textContent = formatClock(opponentSeconds);
    document.querySelector("#bottom .player-clock").textContent = formatClock(tomokoSeconds);
}

function startClockTimer(boardOrientation) {
    stopClockTimer();

    clockTimer = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - clockState.lastTick) / 1000;
        clockState.lastTick = now;

        if (clockState.activeColour === "white" && clockState.whiteSeconds != null) {
            clockState.whiteSeconds = Math.max(0, clockState.whiteSeconds - elapsed);
        } else if (clockState.activeColour === "black" && clockState.blackSeconds != null) {
            clockState.blackSeconds = Math.max(0, clockState.blackSeconds - elapsed);
        }

        renderClocks(boardOrientation);
    }, 250);
}

function setPlayerTitle(el, title) {
    el.textContent = title ?? "";
    el.classList.remove("standard-title", "bot-title");
    el.classList.add(title === "BOT" ? "bot-title" : "standard-title");
}

function setPlayerScore(el, result) {
    el.classList.remove("score-win", "score-loss", "score-draw");

    if (result === "win") {
        el.textContent = "+1";
        el.classList.add("score-win");
    } else if (result === "loss") {
        el.textContent = "-1";
        el.classList.add("score-loss");
    } else if (result === "draw") {
        el.textContent = "½";
        el.classList.add("score-draw");
    } else {
        el.textContent = "";
    }
}

function updateResult(event, boardOrientation) {
    if (!event.status || event.status === "started" || event.status === "created") return;

    const tomokoColour = boardOrientation;
    let tomokoResult = null;
    let opponentResult = null;

    if (event.status === "draw" || event.status === "stalemate") {
        tomokoResult = "draw";
        opponentResult = "draw";
    } else if (event.winner) {
        const tomokoWon = event.winner === tomokoColour;
        tomokoResult = tomokoWon ? "win" : "loss";
        opponentResult = tomokoWon ? "loss" : "win";
    } else {
        return;
    }

    setPlayerScore(document.querySelector("#bottom .player-score"), tomokoResult);
    setPlayerScore(document.querySelector("#top .player-score"), opponentResult);
}

function updatePlayers(game, boardOrientation) {
    const white = game.players?.white;
    const black = game.players?.black;

    if (!white || !black) return;

    const tomoko = boardOrientation === "white" ? white : black;
    const opponent = boardOrientation === "white" ? black : white;

    const topClockColour = boardOrientation === "white" ? "black-clock" : "white-clock";
    const bottomClockColour = boardOrientation === "white" ? "white-clock" : "black-clock";

    setPlayerTitle(document.querySelector("#top .player-title"), opponent.user?.title);
    document.querySelector("#top .player-name").textContent =
        `${opponent.user?.name ?? "unknown"} (${opponent.rating ?? "????"})`;
    document.querySelector("#top .player-clock").classList.remove("white-clock", "black-clock");
    document.querySelector("#top .player-clock").classList.add(topClockColour);

    setPlayerTitle(document.querySelector("#bottom .player-title"), tomoko.user?.title);
    document.querySelector("#bottom .player-name").textContent =
        `${tomoko.user?.name ?? "unknown"} (${tomoko.rating ?? "????"})`;
    document.querySelector("#bottom .player-clock").classList.remove("white-clock", "black-clock");
    document.querySelector("#bottom .player-clock").classList.add(bottomClockColour);
}

function updateClocks(event, boardOrientation, activeColour) {
    clockState.whiteSeconds = event.wc;
    clockState.blackSeconds = event.bc;
    clockState.activeColour = activeColour;
    clockState.lastTick = Date.now();

    renderClocks(boardOrientation);
    startClockTimer(boardOrientation);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findCurrentGame() {
    const response = await fetch(`https://lichess.org/api/user/${username}/current-game`, {
        headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    return await response.json();
}

function handleStreamEvent(event, boardOrientation) {
    if (event.players) {
        updatePlayers(event, boardOrientation);
        return;
    }

    if (event.fen) {
        const newPosition = positionFromFen(event.fen);

        clearHighlights();

        if (previousPosition) {
            const changedSquares = getChangedSquares(previousPosition, newPosition);
            highlightLastMove(changedSquares);
        }

        previousPosition = newPosition;
        position = newPosition;

        renderBoard();

        const turnChar = event.fen.split(" ")[1];
        const activeColour = turnChar === "w" ? "white" : "black";
        const checkSquare = findKingInCheck(activeColour, position);

        if (checkSquare) {
            document.getElementById(checkSquare)?.classList.add("in-check");
        }

        updateClocks(event, boardOrientation, activeColour);
    }

    if (event.status) {
        updateResult(event, boardOrientation);

        if (event.status !== "started" && event.status !== "created") {
            stopClockTimer();
        }
    }
}

function streamGame(gameId, boardOrientation) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        let readIndex = 0;
        let partialLine = "";

        xhr.open("GET", `https://lichess.org/api/stream/game/${gameId}`, true);
        xhr.setRequestHeader("Accept", "application/x-ndjson");
        xhr.overrideMimeType("text/plain; charset=utf-8");

        xhr.onprogress = () => {
            const chunk = xhr.responseText.slice(readIndex);
            readIndex = xhr.responseText.length;

            const combined = partialLine + chunk;
            const lines = combined.split("\n");

            partialLine = lines.pop();

            for (const line of lines) {
                const trimmed = line.trim();

                if (!trimmed) continue;

                try {
                    handleStreamEvent(JSON.parse(trimmed), boardOrientation);
                } catch (error) {
                    console.error("failed to parse stream line:", trimmed, error);
                }
            }
        };

        xhr.onloadend = () => {
            const trimmed = partialLine.trim();

            if (trimmed) {
                try {
                    handleStreamEvent(JSON.parse(trimmed), boardOrientation);
                } catch (error) {
                    console.error("failed to parse final stream line:", trimmed, error);
                }
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`stream request failed for game ${gameId} (status ${xhr.status})`));
            }
        };

        xhr.onerror = () => {
            reject(new Error(`network error streaming game ${gameId}`));
        };

        xhr.send();
    });
}

async function watchUserGames() {
    while (true) {
        try {
            const game = await findCurrentGame();

            if (!game) {
                await sleep(5000);
                continue;
            }

            stopClockTimer();

            orientation = getOrientation(game);

            initBoard(orientation);
            resetPosition();
            previousPosition = null;
            clearHighlights();
            renderBoard();

            document.querySelectorAll(".player-score").forEach((el) => setPlayerScore(el, null));

            updatePlayers(game, orientation);

            const gameIsOngoing = game.status === "created" || game.status === "started";

            try {
                await streamGame(game.id, orientation);
            } catch (streamError) {
                console.error("could not stream game", game.id, streamError);

                stopClockTimer();
                updatePlayers(game, orientation);

                resetPosition();
                previousPosition = null;
                clearHighlights();
                renderBoard();
            }

            await sleep(gameIsOngoing ? 2000 : 15000);
        } catch (error) {
            console.error("lichess watch error:", error);
            await sleep(5000);
        }
    }
}

initBoard();
resetPosition();
previousPosition = null;
renderBoard();

watchUserGames();
