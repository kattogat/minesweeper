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
        new_square.addEventListener("click", function(){ check(this); })
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
            let placment = Math.floor(Math.random() * (square_amount - 1 + 1)) + 1;;
            if (mines[placment] === false) {
                mines[placment] = true;
            }
        }

    }
    
    element.classList.remove("square");
    element.classList.add("blank-square");
}