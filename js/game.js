var game = document.getElementById('game');
var context = game.getContext("2d");

let CellSize = 48;

let cellX = 9;
let cellY = 9;
let mines = 10;
let flags = 0;

var over = false;

var int = window.clearInterval(int);

let startTime = new Date().getTime();

let isfirstOpen = true;


{ // img
    IMGclosed = new Image();
    IMGcursor = new Image();
    IMGopen = new Image();
    IMGflag = new Image();
    IMGmine = new Image();
    IMGwrong = new Image();
    IMGnum1 = new Image();
    IMGnum2 = new Image();
    IMGnum3 = new Image();
    IMGnum4 = new Image();
    IMGnum5 = new Image();
    IMGnum6 = new Image();
    IMGnum7 = new Image();
    IMGnum8 = new Image();

    IMGclosed.src = "./textures/closed.png";
    IMGcursor.src = "./textures/cursor.png";
    IMGopen.src = "./textures/open.png";
    IMGflag.src = "./textures/flag.png";
    IMGmine.src = "./textures/mine.png";
    IMGwrong.src = "./textures/wrong.png";
    IMGnum1.src = "./textures/1.png";
    IMGnum2.src = "./textures/2.png";
    IMGnum3.src = "./textures/3.png";
    IMGnum4.src = "./textures/4.png";
    IMGnum5.src = "./textures/5.png";
    IMGnum6.src = "./textures/6.png";
    IMGnum7.src = "./textures/7.png";
    IMGnum8.src = "./textures/8.png";
}

class Cell {
    constructor(y, x) {
        this.x = x;
        this.y = y;
        this.count = 0;
        this.mine = false;
        this.opened = false;
        this.flagged = false;
        this.selected = false;
        this.clickMine = false;
    }

    setMine() {
        this.mine = true;
    }

    isMine() {
        return this.mine;
    }

    addCount() {
        this.count++;
    }

    getCount() {
        return this.count;
    }

    open() {
        if (!this.flagged) {
            if (this.mine) {
                this.clickMine = true;
                gameover();
                return;
            }
            this.opened = true;
            if (this.count === 0 && !this.mine) {
                var neighbors = this.getNeighbors();
                for (var index in neighbors) {
                    if (!field[neighbors[index][0]][neighbors[index][1]].isOpened()) {
                        field[neighbors[index][0]][neighbors[index][1]].open();
                    }
                }
            }
            drawCell();
        }
        success();
    }

    isOpened() {
        return this.opened;
    }

    flag() {
        if (!this.opened) {
            if (this.flagged) {
                this.flagged = false;
                flags--;
            } else {
                this.flagged = true;
                flags++;
            }
        }
        drawCell();
    }

    isFlagged() {
        return this.flagged;
    }

    draw() {
        context.drawImage(IMGopen, this.y * CellSize, this.x * CellSize, CellSize, CellSize);

        if (this.mine) {

            if (this.clickMine) {
                context.drawImage(IMGwrong, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
            } else {
                context.drawImage(IMGmine, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
            }
        } else if (this.count === 1) {
            context.drawImage(IMGnum1, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 2) {
            context.drawImage(IMGnum2, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 3) {
            context.drawImage(IMGnum3, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 4) {
            context.drawImage(IMGnum4, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 5) {
            context.drawImage(IMGnum5, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 6) {
            context.drawImage(IMGnum6, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 7) {
            context.drawImage(IMGnum7, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        } else if (this.count === 8) {
            context.drawImage(IMGnum8, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        }

        if (!this.opened) {
            context.drawImage(IMGclosed, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        }

        if (this.flagged) {
            context.drawImage(IMGflag, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        }

        if (this.selected) {
            context.drawImage(IMGcursor, this.y * CellSize, this.x * CellSize, CellSize, CellSize);
        }
    }

    isSelected(x, y) {
        if (x == this.x && y == this.y) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    getNeighbors() {
        let neighbors = [];

        for (let i = this.y - 1; i < this.y + 2; i++) {
            for (let j = this.x - 1; j < this.x + 2; j++) {
                if (i > -1 && j > -1 && i < cellX && j < cellY) {
                    if (!field[j][i].isOpened()) {
                        neighbors.push([j, i]);
                    }
                }
            }
        }

        return neighbors;
    }

    setOpened() {
        this.opened = true;
    }
}

var field = []

init();
drawCell();

game.onclick = function (e) { // 左键点击
    e = e || window.e;
    let x = e.clientX - game.offsetLeft;
    let y = e.clientY - game.offsetTop;
    let posX = Math.floor(x / CellSize);
    let posY = Math.floor(y / CellSize);

    if (over) {
        return;
    }

    if (isfirstOpen) {
        isfirstOpen = false;
        genField(posX, posY);
    }

    let cell = field[posY][posX];
    if (!cell.isOpened()) {
        cell.open();
    }

    if (cell.isOpened() && !cell.count == 0) {
        let neighbors = cell.getNeighbors();
        let flags = 0;
        for (let x in neighbors) {
            if (field[neighbors[x][0]][neighbors[x][1]].isFlagged()) {
                flags += 1;
            }
        }
        if (flags === cell.count) {
            for (let x in neighbors) {
                field[neighbors[x][0]][neighbors[x][1]].open();
            }
        }
    }

}

game.oncontextmenu = function (e) { // 右键点击
    e = e || window.e;
    let x = e.clientX - game.offsetLeft;
    let y = e.clientY - game.offsetTop;
    let posX = Math.floor(x / CellSize);
    let posY = Math.floor(y / CellSize);

    let cell = field[posY][posX];

    if (!cell.isOpened()) {
        cell.flag();
    }

    if (cell.isOpened() && !cell.count == 0) {
        let neighbors = cell.getNeighbors();
        if (neighbors.length == cell.count) {
            for (let x in neighbors) {
                if (!field[neighbors[x][0]][neighbors[x][1]].isFlagged()) {
                    field[neighbors[x][0]][neighbors[x][1]].flag();
                }
            }
        }
    }

    return false;
}

game.onmousemove = function (e) { // 光标
    e = e || window.e;
    let x = e.clientX - game.offsetLeft;
    let y = e.clientY - game.offsetTop;
    let posX = Math.floor(x / CellSize);
    let posY = Math.floor(y / CellSize);

    for (let i = 0; i < cellY; i++) {
        for (let j = 0; j < cellX; j++) {
            field[i][j].isSelected(posY, posX);
        }
    }
    drawCell();
}

function drawCell() {
    for (let i = 0; i < cellY; i++) {
        for (let j = 0; j < cellX; j++) {
            field[i][j].draw();
            context.stroke();
            document.getElementById("left").innerHTML = ("剩余雷数：" + (mines - flags));
        }
    }
}

function genField(x, y) {
    let minecount = 0;
    while (minecount < mines) {
        let ry = Math.floor(Math.random() * cellY);
        let rx = Math.floor(Math.random() * cellX);
        if (!(ry === y && rx === x) && !field[ry][rx].isMine()) {
            field[ry][rx].setMine();
            minecount++;
            for (let i = ry - 1; i < ry + 2; i++) {
                for (let j = rx - 1; j < rx + 2; j++) {
                    if (i > -1 && j > -1 && i < cellY && j < cellX) {
                        field[i][j].addCount();
                    }
                }
            }
        }
    }
    startTime = new Date().getTime();
    int = self.setInterval("timer()", 1);
}

function init() {
    game.setAttribute("width", CellSize * cellX);
    game.setAttribute("height", CellSize * cellY);
    for (let i = 0; i < cellY; i++) {
        field[i] = []
        for (let j = 0; j < cellX; j++) {
            field[i][j] = new Cell(j, i);
        }
    }
    isfirstOpen = true;
    flags = 0;
    over = false;
    int = window.clearInterval(int);
    drawCell();
}

function gameover() {
    over = true;
    int = window.clearInterval(int);
    showAllMine();
}

function success() {
    let cnt = 0;
    for (let i = 0; i < cellY; i++) {
        for (let j = 0; j < cellX; j++) {
            if (!field[i][j].isOpened()) {
                cnt++;
            }
        }
    }
    if (cnt === mines) {
        int = window.clearInterval(int);
        flagAllMine();
    }
}

function Beg() { // 初级
    cellX = 9;
    cellY = 9;
    mines = 10;
    init();
}

function Int() { // 中级
    cellX = 16;
    cellY = 16;
    mines = 40;
    init();
}

function Exp() { // 高级
    cellX = 30;
    cellY = 16;
    mines = 99;
    init();
}

function showAllMine() {
    for (let i = 0; i < cellY; i++) {
        for (let j = 0; j < cellX; j++) {
            if (field[i][j].isMine()&&!field[i][j].isFlagged()) {
                field[i][j].setOpened();
            }
        }
    }
}

function flagAllMine() {
    for (let i = 0; i < cellY; i++) {
        for (let j = 0; j < cellX; j++) {
            if (field[i][j].isMine()&&!field[i][j].isFlagged()) {
                field[i][j].flag();
            }
        }
    }
}

function timer() {
    document.getElementById("time").innerHTML = ("计时：" + threezero(Math.round(((new Date().getTime() - startTime) / 1000))) + "." + threezero((new Date().getTime() - startTime) % 1000));
}

function threezero(num) {
    return String(num).length < 3 ? String(num).length < 2 ? "00" + String(num) : "0" + String(num) : String(num);
}