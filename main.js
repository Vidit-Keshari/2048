//    Variables
var tiles = [];
var win = false;
var loss = false;
var locked = false;
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
    version: "v.2.2" //version v.2.2
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

    const moon = document.querySelector("#moon");
    let latestScrollY = 0;
    let ticking = false;

    function updateMoonPosition() {
        const moonOffset = (-0.1 * latestScrollY) + 185;
        moon.style.transform = `translateY(${moonOffset}px)`;
        ticking = false;
    }

    updateMoonPosition();

    window.addEventListener("scroll", () => {
        latestScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateMoonPosition);
            ticking = true;
        }
    });


    document.getElementById("encoded").addEventListener("click", () => {
        navigator.clipboard.writeText(encoded_binary);
        setMsg("Copied to clipboard!");
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
        setMsg("Enter your name");
    }

    randomQuote();
});

//    Mechanics
//    Keydown
document.addEventListener("keydown", (e) => {
    key = e.key;
    if (key === "ArrowUp" && document.getElementById("UP").disabled != true) {
        e.preventDefault();
        up();
    } else if (key === "ArrowDown" && document.getElementById("down").disabled != true) {
        e.preventDefault();
        down();
    } else if (key === "ArrowLeft" && document.getElementById("left").disabled != true) {
        left();
    } else if (key === "ArrowRight" && document.getElementById("right").disabled != true) {
        right();
    }
});

/* window.addEventListener("keydown", e => {
    if (e.altKey && e.code === "KeyT") {
        dev();
    }
}); */

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
    setMsg("No empty tiles found.");
}

//    Check
function checkWin() {
    if (!win || !loss) {
        if (tiles.includes("2048")) {
            setTimeout(() => {
                win = true;
                update();
            }, 100);
        }
    }
}

function checkLose() {
    if (!loss || !win) {
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
            loss = true;
            setTimeout(() => {
                update();
            }, 100);
        }
    }
}

//    name
function rename() {
    player = document.getElementById("player-name").value;
    window.localStorage.setItem("player", player);
    encode();
}

//    Update
function update() {
    if (win) {
        document.getElementById("status").innerHTML = "You won! Keep continuing, we need more!";
        win = false;
    } else if (loss) {
        document.getElementById("status").innerHTML = "You Lost!";
        loss = false;
        setMsg("Oops, you lost! You will win next time. Restart from settings.");
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

//    Features

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

//    Restart

function restart(force = false) {
    if (!force) {
        if (confirm("Are you sure you want to restart?")) {
            window.location.reload();
            return;
        }
    }
    window.location.reload();
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
        setMsg("Enter your name");
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
        setMsg("Sorry, this is not a valid code.");
        return;
    }

    //    Checking if this code belongs to this game
    if (decoded[0] !== about.series) {
        setMsg("Sorry, this code does not belong to 'Old Series'");
        return;
    }

    if (decoded[1] !== about.game) {
        setMsg("Sorry, this code does not belong to this game");
        return;
    }

    //    Checking if this code belongs to this version
    if (decoded[2] !== about.version) {
        setMsg("This code does not belong to this version of the game. We are updateing it to the latest version for you.");
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
        setMsg("Sorry, the code given does not contain all the tile values. Please try again. If the issue persists, the code is not valid.");
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
    setMsg("Saved!");
}

function load() {
    let code = window.localStorage.getItem("o.g2.encoded_binary");
    if (!code) {
        setMsg("No saved data found.");
        return;
    }

    document.getElementById("string").value = code;
    decode();
}

//    Button lock
function lock() {
    let lock = document.getElementById("btn-lock").value;
    const button = document.getElementById(lock);
    const btn_lock = document.querySelector("button[onclick='lock();']");

    if (button && !locked) {
        locked = true;
        button.disabled = locked;
        btn_lock.innerHTML = "Unlock";
        console.log(`${lock} button disabled.`);
    } else if (button && locked) {
        locked = false;
        button.disabled = locked;
        btn_lock.innerHTML = "Lock";
    } else {
        console.error("Button not found!");
    }
}

//    Other

//    Msg
function setMsg(msg = "Msgbox.show(msg); msg: any | string; msg not found.\n10011000 01101100 11110010 10100111\n00011110 00110101 11000100 00100010\n11110101  00000011 10100110 01011010\n10101101 11111000 01110101 00101110\n10111101 11010100 00111110 00010000\n11010101 10011001 01111111 00110100\n10100011 10110001 00001010 11110100\n00011001 11000001 10010100 01101111.\nYou just found a dev easter egg! :)") {
    document.getElementById("msg").innerText = msg;
    $("#myModal").modal("show")
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
    } else if (cmd === "/collapseUniverse") {
        tiles.fill(1 / 0);
        set();
        const ele = document.createElement("div");
        document.body.appendChild(ele);
        ele.textContent = 1 / 0;
        ele.setAttribute("class", "tile");
        ele.style.zIndex = 999;
        ele.style.left = "0";
        ele.style.top = "0";
        ele.style.animationName = "collapse";
        ele.style.animationIterationCount = "infinite";
        ele.style.animationDuration = "1s";
        ele.style.animationDirection = "linear";
        ele.style.opacity = "100%";
        ele.style.position = "fixed";
        ele.style.width = "100px";
        ele.style.height = "100px";
        document.getElementById("instructions").style.display = "none";
        document.getElementById("settings").style.display = "none";
        setTimeout(() => {
            document.getElementById("status").innerHTML = "???"
            document.getElementById("player-name").value = "Vidit Keshari, The developer";
            document.getElementById("quote").innerHTML = "A not so peaceful area!";
            document.body.style.background = "gray";
            document.getElementById("stars-container").style.display = "none";
            document.getElementById("still-stars-container").style.display = "none";
            document.getElementById("moon").style.display = "none";
            setMsg("You tried to corrupt my game? now see this: ");
            setTimeout(() => {
                window.location.href = "https://none.com";
            }, 6500);
        }, 5503);
    }
}
