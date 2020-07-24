// 16 x 30, 99 mine

const feild       = document.getElementsByClassName('feild')[0];
const square_size = 1.5; // rem
let square_amount = 0;
let mines         = [];
let x_lenght      = 0;
let y_lenght      = 0;
let mine_amount   = 0;

if (!feild.hasChildNodes()) {
    // Create feild if empty
    createFeild(16, 30, 99);
}

/**
 * Create the playing feild
 * @param {int} x 
 * @param {int} y 
 * @param {int} mine 
 */
function createFeild(x, y, mine) {
    x_lenght     = x;
    y_lenght     = y;
    mine_amount  = mine;
    const amount = x * y;

    if (feild.hasChildNodes()) {
        // Clear feild
        feild.textContent = '';
    }

    let count = 1;
    for (let i = 0; i < amount; i++) {
        let new_square = document.createElement("div");
        new_square.classList.add("square");
        new_square.id = count;
        new_square.addEventListener("click", function(){ check(this); });
        feild.appendChild(new_square);

        count++;
    }
    square_amount = count;

    for (let i = 0; i < square_amount; i++) {
        mines[i] = false;
    }
}

/**
 * When a player clicks on a square we check that square
 * @param {this} element 
 */
function check (element) {
    if (element.classList.contains('blank-square')) return;

    if (feild.querySelectorAll(".blank-square").length < 1) {
        // First click, place mines
        for (let i = 0; i < mine_amount; i++) {
            let placment = Math.floor(Math.random() * (square_amount - 1 + 1)) + 1;
            // First square can't be a mine
            while (placment == element.id) {
                placment = Math.floor(Math.random() * (square_amount - 1 + 1)) + 1;
            }

            if (mines[placment] === false) {
                mines[placment] = true;
            }
        }
    }

    element.classList.remove("square");
    element.classList.add("blank-square");

    // Did they hit a mine?
    if (mines[parseInt(element.id)] === true) {
        element.classList.add("mine");
        return;
    }

    // Check suronding squares
    const surrounding_mines = checkSurondingSquares(element.id);
    if (surrounding_mines > 0) {
        // They hit a number
        element.innerHTML = surrounding_mines;
        return;
    }
}

/**
 * See what squares tuching the id has
 * @param {*} id 
 */
function checkSurondingSquares(id) {
    let surrounding = closeBy(id);
    let surrounding_mines = 0;

    for (let i = 0; i < surrounding.length; i++) {
        if (mines[surrounding[i]] === true) surrounding_mines++;
    }

    return surrounding_mines;
}

/**
 * Get all close by id's 
 * @param {*} original_id 
 */
function closeBy(original_id) {
    original_id = parseInt(original_id);
    let surrounding = [];

    if (document.getElementById(original_id + 1) !== null) surrounding.push(parseInt(document.getElementById(original_id + 1).id)); // forward
    if (document.getElementById(original_id - 1) !== null) surrounding.push(parseInt(document.getElementById(original_id - 1).id)); // backward
    if (document.getElementById(original_id + y_lenght) !== null) surrounding.push(parseInt(document.getElementById(original_id + y_lenght).id)); // top
    if (document.getElementById((original_id + y_lenght) + 1) !== null) surrounding.push(parseInt(document.getElementById((original_id + y_lenght) + 1).id)); // top forward
    if (document.getElementById((original_id + y_lenght) - 1) !== null) surrounding.push(parseInt(document.getElementById((original_id + y_lenght) - 1).id)); // top backward
    if (document.getElementById(original_id - y_lenght) !== null) surrounding.push(parseInt(document.getElementById(original_id - y_lenght).id)); // bottom
    if (document.getElementById((original_id - y_lenght) + 1) !== null) surrounding.push(parseInt(document.getElementById((original_id - y_lenght) + 1).id)); // bottom forward
    if (document.getElementById((original_id - y_lenght) - 1) !== null) surrounding.push(parseInt(document.getElementById((original_id - y_lenght) - 1).id)); // bottom backward

    return surrounding;
}