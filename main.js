//    Variables
var tiles = [];
var win = false;
var loss = false;
var player = "";
var playing = false;
var encoded_binary = "";
var decocded_binary = "";
const CHARS = {
    "0": "0000000",
    "1": "0000001",
    "2": "0000010",
    "3": "0000011",
    "4": "0000100",
    "5": "0000101",
    "6": "0000110",
    "7": "0000111",
    "8": "0001000",
    "9": "0001001",
    "a": "0001010",
    "b": "0001011",
    "c": "0001100",
    "d": "0001101",
    "e": "0001110",
    "f": "0001111",
    "g": "0010000",
    "h": "0010001",
    "i": "0010010",
    "j": "0010011",
    "k": "0010100",
    "l": "0010101",
    "m": "0010110",
    "n": "0010111",
    "o": "0011000",
    "p": "0011001",
    "q": "0011010",
    "r": "0011011",
    "s": "0011100",
    "t": "0011101",
    "u": "0011110",
    "v": "0011111",
    "w": "0100000",
    "x": "0100001",
    "y": "0100010",
    "z": "0100011",
    "A": "0100100",
    "B": "0100101",
    "C": "0100110",
    "D": "0100111",
    "E": "0101000",
    "F": "0101001",
    "G": "0101010",
    "H": "0101011",
    "I": "0101100",
    "J": "0101101",
    "K": "0101110",
    "L": "0101111",
    "M": "0110000",
    "N": "0110001",
    "O": "0110010",
    "P": "0110011",
    "Q": "0110100",
    "R": "0110101",
    "S": "0110110",
    "T": "0110111",
    "U": "0111000",
    "V": "0111001",
    "W": "0111010",
    "X": "0111011",
    "Y": "0111100",
    "Z": "0111101",
    " ": "0111110",
    ".": "0111111",
    ",": "1000000",
    ":": "1000001"
};

const about = {
    series: "o", //old
    game: "g2", //game 2 2048
    version: "v.1.0" //version v.1.0
};

//    Functions
document.addEventListener("DOMContentLoaded", function () {
    //    Styles
    const star_container = document.getElementById("stars-container");

    function createStar() {
        const star = document.createElement("div");
        star.classList.add("shooting-stars");

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.5;
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;

        star.style.animation = `shootingStar ${Math.random() * 2 + 1}s linear infinite`;

        star_container.appendChild(star);

        setTimeout(() => star.remove(), 3000);

        document.addEventListener('scroll', () => {
            let scroll_pos = window.scrollY;
            if (star) {
                var new_pos = (((scroll_pos * 0.9) - scroll_pos) + 185);
                star.style.top = `${new_pos}px`
            }
        });
    }

    setInterval(createStar, 500);

    const starCount = 100;
    const stillStarContainer = document.getElementById("still-stars-container");
    let stars = [];

    for (let i = 0; i < starCount; i++) {
        let star = document.createElement("div");
        star.classList.add("still-star");

        let xPos = Math.random() * window.innerWidth;
        let yPos = Math.random() * window.innerHeight;

        star.style.left = `${xPos}px`;
        star.style.top = `${yPos}px`;

        let size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.opacity = Math.random() * 0.5 + 0.5;

        let delay = Math.random() * 2;
        star.style.animationDelay = `${delay}s`;

        let speed = Math.random() * 0.5 + 0.2;
        speed = (speed * 0.9) - speed;
        star.dataset.speed = speed;

        stars.push(star);
        stillStarContainer.appendChild(star);
    }

    window.addEventListener("scroll", () => {
        let scrollY = window.scrollY;
        stars.forEach(star => {
            let speed = parseFloat(star.dataset.speed);
            star.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    document.addEventListener("scroll", () => {
        let scroll_pos = window.scrollY;
        const moon = document.querySelector("#moon");
        var new_pos = (((scroll_pos * 0.9) - scroll_pos) + 185);

        if (moon) {
            moon.style.top = `${new_pos}px`;
        }
    });

    document.getElementById("encoded").addEventListener("click", () => {
        navigator.clipboard.writeText(encoded_binary);
        window.alert("Copied to clipboard!");
    });

    //    Tile setup
    document.querySelectorAll(".tile").forEach(tile => {
        tiles.push(tile.getAttribute("data-value"));
    });
    getRandomTile();
    getRandomTile();
    set();
    console.log(tiles);

    //   background music
    const music = document.getElementById("background-music");
    music.volume = 0.1;

    setTimeout(() => {
        music.play();
        playing = true;
    }, 5000);
    update();

    if (!document.getElementById("player-name").value) {
        window.alert("Enter your name");
    }

    randomQuote();
});

//    Mechanics
//    Keydown
document.addEventListener("keydown", (e) => {
    key = e.key;
    if ((key === "ArrowUp") || (key === "w")) {
        e.preventDefault();
        up();
    } else if ((key === "ArrowDown") || (key === "s")) {
        e.preventDefault();
        down();
    } else if ((key === "ArrowLeft") || (key === "a")) {
        left();
    } else if ((key === "ArrowRight") || (key === "d")) {
        right();
    }
});

window.addEventListener("keydown", e => {
    if (e.altKey && e.code === "KeyT") {
        dev();
    }
});

//    Tile re-setup
function set() {
    document.querySelectorAll(".tile").forEach((tile, idx) => {
        let value = parseInt(tiles[idx]);
        if (value !== 0) {
            tile.textContent = tiles[idx];
            if (value > 2048) {
                tile.classList.add("tile-high");
            } else {
                tile.classList.remove("tile-high");
            }
        } else {
            tile.textContent = "";
            tile.classList.remove("tile-high");
        }
        tile.setAttribute("data-value", `${tiles[idx]}`);
    });
    if (!win && !loss) {
        checkWin();
        if (!win) {
            checkLose();
        }
    }
    update();
}

//    Get
function getColumns(tiles) {
    let columns = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            columns[col].push(tiles[row * 4 + col]);
        }
    }

    return columns;
}

function getRows(tiles) {
    let rows = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            rows[i].push(tiles[i * 4 + j]);
        }
    }
    return rows;
}

//    Set
function setColumns(columns) {
    let new_tiles = Array(16).fill("0");

    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            new_tiles[row * 4 + col] = columns[col][row];
        }
    }

    return new_tiles;
}

function setRows(rows) {
    let new_tiles = Array(16).fill("0");
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            new_tiles[i * 4 + j] = rows[i][j];
        }
    }
    return new_tiles;
}

//    Shift
function shiftCol(col) {
    col = col.filter(val => val !== "0");
    for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
            col[i] = (parseInt(col[i]) * 2).toString();
            col[i + 1] = "0";
            i++;
        }
    }
    col = col.filter(val => val !== "0");
    while (col.length < 4) {
        col.push("0");
    }
    return col;
}

function shiftRow(row) {
    row = row.filter(val => val !== "0");
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] = (parseInt(row[i]) * 2).toString();
            row[i + 1] = "0";
            i++;
        }
    }
    row = row.filter(val => val !== "0");
    while (row.length < 4) {
        row.push("0");
    }
    return row;
}

//    Movements
function up() {
    let old = [...tiles];
    let columns = getColumns(tiles);

    for (let i = 0; i < 4; i++) {
        columns[i] = shiftCol(columns[i]);
    }

    tiles = setColumns(columns);
    if (!old.every((val, idx) => val === tiles[idx])) {
        getRandomTile();
    }
    set();
}

function down() {
    let old = [...tiles];
    let columns = getColumns(tiles);

    for (let i = 0; i < 4; i++) {
        columns[i] = shiftCol(columns[i].reverse()).reverse();
    }

    tiles = setColumns(columns);
    if (!old.every((val, idx) => val === tiles[idx])) {
        getRandomTile();
    }
    set();
}

function left() {
    let old = [...tiles];
    let rows = getRows(tiles);

    for (let i = 0; i < 4; i++) {
        rows[i] = shiftCol(rows[i]);
    }

    tiles = setRows(rows);
    if (!old.every((val, idx) => val === tiles[idx])) {
        getRandomTile();
    }
    set();
}

function right() {
    let old = [...tiles];
    let rows = getRows(tiles);

    for (let i = 0; i < 4; i++) {
        rows[i] = shiftCol(rows[i].reverse()).reverse();
    }

    tiles = setRows(rows);
    if (!old.every((val, idx) => val === tiles[idx])) {
        getRandomTile();
    }
    set();
}

function getRandomTile() {
    let attempt = 0;
    do {
        let tile = Math.floor(Math.random() * 16);
        if (tiles[tile] === "0") {
            let percent = Math.floor(Math.random() * 1000);
            let number;
            if (percent >= 995) {
                number = "8";
            } else if (percent >= 705) {
                number = "4";
            } else {
                number = "2";
            }
            tiles[tile] = number;
            return;
        }
        attempt++;
    } while (attempt < 1001);
    window.alert("No empty tiles found.");
}

//    Check
function checkWin() {
    if (tiles.includes("2048")) {
        setTimeout(() => {
            win = true;
            update();
        }, 100);
    }
}

function checkLose() {
    if (!tiles.includes("0")) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let current = parseInt(tiles[i * 4 + j]);
                if (
                    (i < 3 && current === parseInt(tiles[(i + 1) * 4 + j])) ||
                    (j < 3 && current === parseInt(tiles[i * 4 + j + 1]))
                ) {
                    return;
                }
            }
        }
        setTimeout(() => {
            loss = true;
            update();
        }, 100);
    }
}

//    name
function rename() {
    player = document.getElementById("player-name").value;
    window.localStorage.setItem("player", player);
}

//    Update
function update() {
    if (win) {
        document.getElementById("status").innerHTML = "You won! Keep continuing, we need more!";
    } else if (loss) {
        document.getElementById("status").innerHTML = "You Lost!";
        setTimeout(() => {
            restart();
        }, 5000);
    } else {
        document.getElementById("status").innerHTML = "Playing...";
    }
    if (document.getElementById("player-name").value !== window.localStorage.getItem("player")) {
        document.getElementById("player-name").value = window.localStorage.getItem("player");
        player = window.localStorage.getItem("player");
    }
    encode();
    document.getElementById("encoded").textContent = encoded_binary;
}

//    Music
function toggleMusic() {
    const music = document.getElementById("background-music");
    const musicDisplay = document.getElementById("playing");
    if (playing) {
        music.pause();
        playing = false;
        musicDisplay.innerHTML = "Mute";
    } else if (!playing) {
        music.play();
        playing = true;
        musicDisplay.innerHTML = "Playing: Indian walk - Nico Staf";
    }
    music.volume = 0.1;
}

function restart() {
    if (confirm("Are you sure you want to restart?")) {
        window.location.reload();
    }
}

//    Quote
function randomQuote() {
    const quotes = [
        "Keep Gaming!", //0
        "Play. Complete. Conquer!", //1
        "Gaming Improved!", //2
        "Unleash the Gamer Within!", //3
        "Where Fun Never Ends!", //4
        "Victory on the Door!", //5
        "Play beyond limits!", //6
        "-By Vidit Keshari from VGames" //7
    ];
    const element = document.getElementById("quote");
    var idx = Math.floor(Math.random() * quotes.length);
    element.innerText = quotes[idx];
}

//     Encode
function encodeName() {
    if (!player) {
        window.alert("Enter your name");
        player = "Guest";
    }
    let encoded = "";
    for (let i = 0; i < player.length; i++) {
        encoded += CHARS[player[i]] + " ";
    }
    encoded = encoded.trim();
    encoded = encoded.split(" ").join(",");
    return encoded;
}

function encodeTiles() {
    let encoded = "";
    for (let i = 0; i < tiles.length; i++) {
        let single = "";
        for (let j = 0; j < tiles[i].length; j++) {
            single += CHARS[tiles[i][j]] + " ";
        }
        encoded += single.trim().split(" ").join(":") + " ";
    }
    encoded = encoded.trim();
    encoded = encoded.split(" ").join(",");
    return encoded;
}

function encode() {
    encoded_binary = "";
    encoded_binary += about.series + " " + about.game + " " + about.version + " " + encodeName() + " " + encodeTiles();
}

//    Decode
function decode() {
    let decoded = document.getElementById("string").value;
    decoded = decoded.split(" ");

    if (!decoded || decoded.length < 5) {
        window.alert("Sorry, this is not a valid code.");
        return;
    }    

    //    Checking if this code belongs to this game
    if (decoded[0] !== about.series) {
        window.alert("Sorry, this code does not belong to 'Old Series'");
        return;
    }

    if (decoded[1] !== about.game) {
        window.alert("Sorry, this code does not belong to this game");
        return;
    }

    //    Checking if this code belongs to this version
    if (decoded[2] !== about.version) {
        window.alert("This code does not belong to this version of the game. We are updateing it to the latest version for you.");
        decoded[2] = about.version;
    }

    //    Decoding player name
    let player_name = decoded[3].split(",");
    let decoded_name = "";
    for (let i = 0; i < player_name.length; i++) {
        decoded_name += Object.keys(CHARS).find(key => CHARS[key] === player_name[i]);
    }

    // Decoding tiles
    let tiles_got = decoded[4].split(",");
    let decoded_tiles = [];

    for (let i = 0; i < tiles_got.length; i++) {
        let single = tiles_got[i].split(":");
        let decoded_single = "";
        for (let j = 0; j < single.length; j++) {
            decoded_single += Object.keys(CHARS).find(key => CHARS[key] === single[j]);
        }
        decoded_tiles.push(decoded_single);
    }

    if (decoded_tiles.length !== 16) {
        window.alert("Sorry, the code given does not contain all the tile values. Please try again. If the issue persists, the code is not valid.");
        return;
    }

    console.log(decoded);
    console.log(decoded_name);
    console.log(decoded_tiles);

    tiles = decoded_tiles;
    player = decoded_name;
    window.localStorage.setItem("player", player);
    set();
}

//    Save and Load
function save() {
    window.localStorage.setItem("o.g2.encoded_binary", encoded_binary);
    window.alert("Saved!");
}

function load() {
    let code = window.localStorage.getItem("o.g2.encoded_binary");
    if (!code) {
        window.alert("No saved data found.");
        return;
    }

    document.getElementById("string").value = code;
    decode();
}

//    Devloper tools
function dev() {
    let cmd = window.prompt("Devloper tools: Enter command: ");
    if (cmd === "/forcewin") {
        tiles.fill("0");
        tiles[Math.floor(Math.random() * 16)] = "2048";
        set();
    } else if (cmd === "/forcelose") {
        for (let i = 1; i < 17; i++) {
            if (2 ** i == 2048) {
                i++;
                tiles[i - 2] = `${2 ** i}`;
                continue;
            }
            tiles[i - 1] = `${2 ** i}`;
        }
        set();
    } else if (cmd === "/set") {
        let tile = window.prompt("Enter tile index: ");
        let value = window.prompt("Enter tile value: ");
        tiles[tile] = value;
        set();
    } else if (cmd === "/multiset") {
        let num = window.prompt("Enter number of tiles: ");
        for (let i = 0; i < num; i++) {
            let tile = window.prompt("Enter tile index: ");
            let value = window.prompt("Enter tile value: ");
            tiles[tile] = value;
        }
        set();
    }
}
