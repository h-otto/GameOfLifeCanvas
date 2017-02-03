"use strict";

let CELL_SIZE = 9;   //egy cella mérete (szélesség és magasság is)
let CELL_COLOR = "#afa";
let BOARD_BACKCOLOR = "#fff";
let neighbours = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

let board = document.getElementById("cnvBoard");
let cells = [];
var rowCount = 0;
var colCount = 0;



function createNewBoard(rowCount, colCount) {
    let boardWidth = colCount * (CELL_SIZE + 1) - 1;
    let boardHeight = rowCount * (CELL_SIZE + 1) - 1;

    board.width = boardWidth;
    board.height = boardHeight;

    cells = new Array(rowCount);
    for (let row = 0; row < rowCount; row++) {
        cells[row] = new Array(colCount);
        for (let col = 0; col < colCount; col++) {
            cells[row][col] = 0;
        }
    }

    window.rowCount = rowCount;
    window.colCount = colCount;

    drawBoardBackground();

    drawCells();

    console.log("Board created: width=", boardWidth, "; height=", boardHeight);
}

function randomBoard(percent) {
    let maxRndValue = percent / 100;
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            cells[row][col] = (Math.random() < maxRndValue ? 1 : 0);
        }
    }

    drawCells();
}

function drawBoardBackground() {
    let ctx = board.getContext("2d");

    //háttér
    ctx.fillStyle = BOARD_BACKCOLOR;
    ctx.fillRect(0, 0, board.width, board.height);

    //vonalak
    ctx.beginPath();
    for (let i = CELL_SIZE + 0.5; i < board.height; i += CELL_SIZE + 1) {
        ctx.moveTo(0, i);
        ctx.lineTo(board.width, i);
    }
    for (let i = CELL_SIZE + 0.5; i < board.width; i += CELL_SIZE + 1) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, board.height);
    }
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawCells() {
    let ctx = board.getContext("2d");

    //színenként külön rajzoljuk, így hatékonyabb
    ctx.fillStyle = CELL_COLOR;
    for (let row = 0; row < rowCount; row++)
        for (let col = 0; col < colCount; col++)
            if (cells[row][col] > 0)
                ctx.fillRect(col * (CELL_SIZE + 1), row * (CELL_SIZE + 1), CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = BOARD_BACKCOLOR;
    for (let row = 0; row < rowCount; row++)
        for (let col = 0; col < colCount; col++)
            if (cells[row][col] === 0)
                ctx.fillRect(col * (CELL_SIZE + 1), row * (CELL_SIZE + 1), CELL_SIZE, CELL_SIZE);
}

function evolveCells() {
    //szomszédok megszámolása
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            for (let i = 0; i < neighbours.length; i++) {
                let neighbourRelPos = neighbours[i];
                let x = col + neighbourRelPos[1];
                let y = row + neighbourRelPos[0];
                if (x >= 0 && x < colCount && y >= 0 && y < rowCount && cells[y][x] % 10 > 0) {
                    cells[row][col] += 10;
                }
            }
        }
    }

    //cellák módosítása
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            let cellValue = cells[row][col];
            //cella él, ha:
            //-2 szomszéd és volt élet (21)
            //-3 szomszéd (30, 31)
            if (cellValue == 21 || cellValue == 30 || cellValue == 31)
                cells[row][col] = 1;
            else
                cells[row][col] = 0;
        }
    }
}

function step() {
    evolveCells();
    drawCells();
}