// this script is running in the browser when the DOM is ready
// it will be executed after the HTML is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 9; // giving the grid size to a constant
    const solveButton = document.getElementById('solve-btn');

    // the click trigger function for the button on the DOM to resolve the sudoku
    solveButton.addEventListener('click', solveSudoku);

    const sudokuGrid = document.getElementById('sudoku-grid');

    // Create the sudoku grid dynamically wich will be rendered in the HTML
    // the grid is a 9x9 matrix with input fields and also column and rows
    for (let row = 0; row < gridSize; row++) {
        // for the variable row starting at 0 and to be smaller that the gridSize which is 9 the row is raised by 1
        const newRow = document.createElement('tr');
        // the logic =  so for each row create a new row element
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('td');
            // for each column create a new cell element
            const input = document.createElement('input');
            // create also an input element for each cell so that the user can put the numbers into the grid
            input.type = 'number';
            input.className = 'cell';
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
            // append the input to the cell and the cell to the row
        }
        sudokuGrid.appendChild(newRow);
        // append the row to the sudoku grid
    }
});

// Function to solve the sudoku puzzle
async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];
    // create an empty array to store the sudoku values

    // fill the sudoku array with input values from the grid
    // the values that the user has put into the grid every one of them to be put into a matrix and the missing elements to the sudoku to be with 0
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            // get the value of the input field by its id
            sudokuArray[row][col] = cellValue ? parseInt(cellValue) : 0;
            // if the cell value is not empty, parse it to an integer, otherwise set it to 0

            //how the matrix initially looks like
            console.log(`Row: ${row}, Col: ${col}, Value: ${sudokuArray[row][col]}`);
        }
    }

    // Identify the user-input cells and mark them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            // initialy if the matrix has elements that are not 0 then we will add them a class to make the difference so that the numbers to not be changed
            if (sudokuArray[row][col] !== 0) {
                cell.classList.add('user-input');
            }
        }
    }

    // Solve the sudoku and display the solution
    if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains('user-input')) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add('solved');
                    await sleep(20); // add delay for visualization
                }
            }
        }
    } else {
        alert('No solution exists for the given Sudoku puzzle.');
    }
}
function solveSudokuHelper(board) {
    const gridSize = 9;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) { // function to check if the num is valid from 0 to 9 the function is bellow
                        board[row][col] = num;

                        // Recursively attempt to solve the Sudoku
                        if (solveSudokuHelper(board)) {
                            return true; //Puzzle solved
                        }

                        board[row][col] = 0; //Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true; // All cells are filled correctly
}
// board is matrix array that is the sudokuArray
// row and col are the cell coordinates where we want to place the number
// num is the number we want to place
function isValidMove(board, row, col, num) {
    const gridSize = 9;
    // Check if the row and column for conflicts
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] == num || board[i][col] == num) {
            return false; // Conflicts found in row or column
        }
    }

    // Check the 3x3 subgrid for conflicts
    // Sudoku, each 9x9 grid is divided into nine 3x3 subgrids 
    // When placing a number in a cell, you must ensure that the same number does not already exist in the corresponding 3x3 subgrid.
    // So, this part of the code should check if the number you want to place is already present in the 3x3 box that contains the cell at (row, col). 
    // If it is, placing the number there would violate Sudoku rules.
    const startRow = Math.floor(row / 3) * 3; // the result is
    const startCol = Math.floor(col / 3) * 3; // the result is

    console.log(startRow, startCol);

    // loop through the 3x3 subgrid to see if the numbers from the array already exists
    // board and sudokuArray are the same 
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] == num) {
                return false; // Conflicts found
            }
        }
    }
    return true; // No conflicts found
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
