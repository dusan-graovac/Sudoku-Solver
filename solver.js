var board = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]];

var oldBoard = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]];

var numSelected = null;
var tileSelected = null;
var solved = false;

/**
 * On load
 */

window.onload = function () {
    createUI();
}

function createUI() {
    //Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let num = document.createElement("div");
        num.id = i;
        num.innerText = i;
        num.addEventListener("click", selectNum);
        num.classList.add("number");
        document.getElementById("digits").appendChild(num);
    }
    let del = document.createElement("div");
    del.id = 0;
    del.classList.add("number");
    del.innerText = "Del";
    del.addEventListener("click", selectNum);
    document.getElementById("digits").append(del);

    //9x9 board
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.createElement("div");
            tile.id = i + "-" + j; //0-0, 4-5
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");

            if (i % 3 == 0 && i > 0) tile.classList.add("horizontal-line");
            if (j % 3 == 0 && j > 0) tile.classList.add("vertical-line");

            document.getElementById("board").appendChild(tile);
        }
    }
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("solve").addEventListener("click", solve);

}

function selectNum() {
    if (numSelected != null) numSelected.classList.remove("number-selected");
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (solved) return;
    if (numSelected) {
        if (numSelected.innerText == "Del") {
            this.innerText = "";
            this.classList.remove("tile-start");
        }
        else {
            this.innerText = numSelected.innerText;
            this.classList.add("tile-start");
        }
    }

}

function clear() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.getElementById(i + "-" + j);
            tile.innerText = "";
            if (tile.classList.contains("tile-start")) tile.classList.remove("tile-start");
            if (tile.classList.contains("tile-solved")) tile.classList.remove("tile-solved");
            board[i][j] = 0;
        }
    }
    solved = false;
}

function solve() {
    if (!isValidBoard()) {
        window.alert("Please enter a valid board");
        return;
    }

    solveBoard();
    console.log(oldBoard);
    console.log(board);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.getElementById(i + "-" + j);
            tile.innerText = board[i][j];
            if (oldBoard[i][j] != board[i][j]) tile.classList.add("tile-solved");
        }
    }

}

function generateBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.getElementById(i + "-" + j);
            if (tile.innerText != "") {
                board[i][j] = parseInt(tile.innerText);
                oldBoard[i][j] = parseInt(tile.innerText);
            }
        }
    }
}
/**
 * Algorithm 
 */

function possibleRow(row, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] == num) return false;
    }
    return true;
}
function possibleColumn(column, num) {
    for (let i = 0; i < 9; i++) {
        if (board[i][column] == num) return false;
    }
    return true;
}
function possibleBox(row, column, num) {
    let boxRow = row - (row % 3);
    let boxColumn = column - (column % 3);

    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxColumn; j < boxColumn + 3; j++) {
            if (board[i][j] == num) return false;
        }
    }
    return true;
}

function possiblePlacement(row, column, num) {
    return possibleRow(row, num) && possibleColumn(column, num) && possibleBox(row, column, num);
}

function solveBoard() {
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            if (board[row][column] == 0) {
                for (let num = 1; num <= 9; num++) {
                    if (possiblePlacement(row, column, num)) {
                        board[row][column] = num;

                        if (solveBoard()) return true;
                        else board[row][column] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function testValid() {
    console.log(isValidBoard());
}

function isValidBoard() {
    generateBoard();
    for (let i = 0; i < 9; i++) {
        let row = new Set(),
            col = new Set(),
            box = new Set();

        for (let j = 0; j < 9; j++) {
            let _row = board[i][j];
            let _col = board[j][i];
            let _box = board[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)];

            if (_row != 0) {
                if (row.has(_row)) return false;
                row.add(_row);
            }
            if (_col != 0) {
                if (col.has(_col)) return false;
                col.add(_col);
            }

            if (_box != 0) {
                if (box.has(_box)) return false;
                box.add(_box);
            }
        }
    }
    return true;
}

function printBoard(board) {
    let output = "";
    for (let i = 0; i < 9; i++) {
        if (i % 3 == 0 && i > 0) {
            output += "-----------\n";
        }
        for (let j = 0; j < 9; j++) {
            if (j % 3 == 0 && j > 0) {
                output += "|";
            }
            output += board[i][j];
        }
        output += "\n";
    }
    console.log(output);
}
