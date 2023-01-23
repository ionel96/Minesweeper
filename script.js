
const statusDisplay = document.querySelector('.gameStatus');
let gameActive = true, unlockedCells = 0;

function isValidPos(i, j, n, m) {
    if (i < 0 || j < 0 || i > n - 1 || j > m - 1) {
  	    return 0;
    }
    return 1;
}

function calculateAdjacentBombs(gameBoard, adjElements) {
    for (let k = 0; k < adjElements.length - 1; k += 2) {
        let n = adjElements[k], m = adjElements[k + 1];
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                if (isValidPos(i + n, j + m, window.rowsW, window.colsW) && gameBoard[i + n][j + m] != -1) {
                    gameBoard[i + n][j + m] += 1;
                }
            }
        }
    }
}

function placeBombs(gameBoard) {
    let adjElements = [];
    for (let i = 0; i < window.bombsW; ++i) {
        let linePos = Math.floor(Math.random() * window.rowsW);
        let colPos = Math.floor(Math.random() * window.colsW);
        if (gameBoard[linePos][colPos] == 0) {
            gameBoard[linePos][colPos] = -1;
            adjElements.push(linePos, colPos);
        } else {
            --i;
        }
    }
    calculateAdjacentBombs(gameBoard, adjElements);
} 

function openCell(index1, index2) {
    let idName = index1 + " " + index2;
    document.getElementById(idName).style.backgroundColor = 'white';
    if (gameBoardW[index1][index2] >= 1 && gameBoardW[index1][index2] <= 8) {
        document.getElementById(idName).innerHTML = gameBoardW[index1][index2];
    }
    gameBoardW[index1][index2] = "*";
    if (++unlockedCells == window.rowsW * window.colsW - window.bombsW) {
        statusDisplay.innerHTML = "Congratulations! You won! 👍";
        gameActive = false;
    } 
}

function adjacentCells(line, colum) {
    let elements = [];
    elements.push(line, colum);
    while (elements.length >= 2) {
        let n = elements[0], m = elements[1];
        elements.shift();
        elements.shift();
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                if (isValidPos(i + n, j + m, window.rowsW, window.colsW)) {
                    if (gameBoardW[i + n][j + m] == 0) {
                        openCell(i + n, j + m);
                        elements.push(i + n, j + m);
                    } else if (gameBoardW[i + n][j + m] >= 1 && gameBoardW[i + n][j + m] <= 8) {
                        openCell(i + n, j + m);
                    }
                } 
            }
        }
    }
}

function checkCell(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = clickedCell.getAttribute('id');
    if (clickedCellEvent.button == 2 && gameActive) {
        clickedCell.innerHTML = "🚩";
        return;
    } 
    let line = 0, colum = 0;
    for (let i = 0; i < clickedCellIndex.length; ++i) {
        if (clickedCellIndex[i] != ' ') {
            colum = colum * 10 + parseInt(clickedCellIndex[i]);
        } else {
            let aux = colum;
            colum = line;
            line = aux;
        }
    }
    if (gameBoardW[line][colum] == -1 && gameActive) { 
        statusDisplay.innerHTML = "Game over ☹️";
        clickedCell.innerHTML = "💣";
        gameActive = false;
    } else if (gameBoardW[line][colum] == 0 && gameActive) {
        adjacentCells(line, colum);
    } else if (gameBoardW[line][colum] >= 1 && gameBoardW[line][colum] <= 8 &&
        gameActive) {
        openCell(line, colum);
    }
}

function createGameBoard(cols, rows, blockSize, bombs) {
    let gameBoard = Array.from(Array(rows), () => new Array(cols).fill(0));
    const board = document.getElementById('board');
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            const block = document.createElement('div');
            block.id = i + " " + j;
            block.style.width = '30px';
            block.style.height = '30px';
            block.classList.add('cell');
            board.appendChild(block);
            board.style.width = '30px';
        }
    }
    board.style.width = `${(blockSize * cols) + 2 * (rows)}px`;
    window.colsW = cols;
    window.rowsW = rows;
    window.bombsW = bombs;
    window.gameBoardW = gameBoard;
    placeBombs(gameBoard);
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('mouseup', checkCell)); 
