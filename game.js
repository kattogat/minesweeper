const feild       = document.getElementsByClassName('feild')[0];
const emoji       = document.getElementsByClassName('emoji')[0];
const square_size = 2; // rem
let square_amount = 0;
let mines         = [];
let x_lenght      = 0;
let y_lenght      = 0;
let mine_amount   = 0;
let timer         = '';
let y_border      = [];
let game_over     = false

// Create feild if empty
if (!feild.hasChildNodes()) {
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
        reset();
    }

    // Set feild size
    feild.style.height = square_size * x + 'rem';
    feild.style.width = square_size * y + 'rem';
    const interface = document.getElementsByClassName('interface')[0];
    interface.style.width = square_size * y + 'rem';

    let count = 1;
    let border = y_lenght;
    y_border.push(1);
    for (let i = 0; i < amount; i++) {
        let new_square = document.createElement("div");
        new_square.classList.add("square");
        new_square.id = count;
        new_square.addEventListener("click", function(){ check(this); });
        new_square.addEventListener('contextmenu', function(event) { 
            event.preventDefault();
            rightClick(this); 
            return false; 
        }, false);
        new_square.addEventListener("mousedown", areYouScared);
        new_square.addEventListener("mouseup", fearless);
        feild.appendChild(new_square);

        // Find the y border
        if (count == border) {
            y_border.push(count);
            if (amount != count) y_border.push(count + 1);
            border = border + y_lenght;
        }

        count++;
    }
    square_amount = count;

    mines[0] = false;
    for (let i = 1; i < square_amount; i++) {
        mines[i] = false;
    }
}

/**
 * When a player clicks on a square we check that square
 * @param {this} element 
 */
function check(element) {
    if (game_over) return;
    if (element.classList.contains('blank-square')) return;
    if (element.getElementsByClassName('flag').length > 0) return;

    if (feild.querySelectorAll(".blank-square").length < 1) {
        // First click, place mines
        for (let i = 0; i < mine_amount; i++) {
            let placment = Math.floor(Math.random() * (square_amount - 1 + 1)) + 1;
            // First square can't be a mine
            while (placment == element.id) {
                placment = Math.floor(Math.random() * (square_amount - 1 + 1)) + 1;
            }

            if (!mines[placment]) {
                mines[placment] = true;
            }
        }

        // Start timer
        startTimer();
    }

    element.classList.remove("square");
    element.classList.add("blank-square");

    // Did they hit a mine?
    if (mines[parseInt(element.id)]) {
        game_over = true;
        element.classList.add("mine");
        let bomb = document.createElement("span");
        bomb.classList.add("bomb");
        bomb.style.backgroundColor = '#e61919';
        bomb.innerHTML = "💣";
        element.appendChild(bomb);

        // Change emoji
        emoji.innerHTML = "💀";

        // Stop timer 
        clearInterval(timer);

        // Show all mines
        for (let i = 1; i < square_amount; i++) {
            const the_square = document.getElementById(i);
            if (!the_square.classList.contains('blank-square') && mines[i]) {
                if (the_square.getElementsByClassName('flag').length > 0) the_square.textContent = '';
                the_square.classList.remove("square");
                the_square.classList.add("blank-square");
                let next_bomb = document.createElement("span");
                next_bomb.classList.add("bomb");
                next_bomb.innerHTML = "💣";
                the_square.appendChild(next_bomb);
            }
        }

        return;
    }

    // Check suronding squares
    const surrounding_mines = checkSurondingSquares(element.id);
    if (surrounding_mines > 0) {
        // They hit a number
        element.classList.add(getNumberClass(surrounding_mines));
        element.innerHTML = surrounding_mines;
    }
    else {
        let should_be_checked = closeBy(element.id);
        let checked    = [parseInt(element.id)];
        let add_theses = [];
        while (should_be_checked.length > 0) {
            for (let i = 0; i < should_be_checked.length; i++) {
                let is_blank = checkSurondingSquares(should_be_checked[i]);
                if (is_blank < 1) {
                    let blank_element = document.getElementById(should_be_checked[i]);
                    blank_element.classList.remove("square");
                    blank_element.classList.add("blank-square");

                    // Don't add duplicets
                    let should_we_add_these = closeBy(should_be_checked[i]);
                    should_we_add_these.forEach(value => {
                        if (!add_theses.includes(value) && !checked.includes(value)) {
                            add_theses.push(value);
                        }
                    });
                }
                else {
                    if (!mines[parseInt(element.id)]) {
                        let number = document.getElementById(should_be_checked[i]);
                        number.classList.remove("square");
                        number.classList.add("blank-square", getNumberClass(is_blank));
                        number.innerHTML = is_blank;
                    }
                }

                if (!checked.includes(should_be_checked[i])) {
                    checked.push(should_be_checked[i]);
                }
            }
            should_be_checked = [];

            if (add_theses.length > 0) {
                should_be_checked = add_theses;
            }
            add_theses = [];
        }
    }

    // Are ya winning son?
    if (feild.getElementsByClassName('square').length == mine_amount) {
        let mines_left = false;
        for (let i = 0; i < element.getElementsByClassName('square').length; i++) {
            if (!mines[parseInt(element.getElementsByClassName('square').id)]) mines_left = true;
        }

        if (!mines_left) {
            // We have winner!
            emoji.innerHTML = "😎";
            game_over = true;
            clearInterval(timer);

            const score = document.getElementById("time").innerHTML;
            const play_again = confirm('Score: '+ score.replace(/^0+/, '') +'\nDo you want to play again?');
            if (play_again) {
                reStart();
            }
        }
    }
}

/**
 * Place or remove a flag on right click
 * @param {this} element 
 */
function rightClick(element) {
    if (game_over) return;
    if (element.classList.contains('blank-square')) return;

    if (element.getElementsByClassName('flag').length > 0) {
        element.textContent = '';
        document.getElementById('left').innerHTML++;
    }
    else {
        let flag = document.createElement("span");
        flag.classList.add("flag");
        flag.innerHTML = "🚩";
        element.appendChild(flag);

        const flaged = document.getElementsByClassName('flag');
        document.getElementById('left').innerHTML = mine_amount - flaged.length;
    }
    return false;
}

function areYouScared() {
    if (emoji.innerHTML === "💀" || emoji.innerHTML === "😎") return;
    emoji.innerHTML = "😨";
}

function fearless() {
    if (emoji.innerHTML === "💀" || emoji.innerHTML === "😎") return;
    emoji.innerHTML = getDefaultEmoji();
}

/**
 * Get the default emoji, it will change depending on how mnay flags are placed
 */
function getDefaultEmoji() {
    const flags = document.getElementsByClassName('flag');

    if (emoji.innerHTML === "💀") return "💀";
    if (emoji.innerHTML === "😎") return "😎";
    if (flags.length >= mine_amount) return "🤔";
    if (flags.length >= Math.ceil(mine_amount-2)) return "🤩";
    if (flags.length > Math.ceil((mine_amount/2)+(mine_amount/3))) return "🥳";
    if (flags.length > Math.ceil((mine_amount/4)+(mine_amount/2))) return "😏";
    if (flags.length > Math.ceil(mine_amount/2)) return "😁";
    if (flags.length > Math.ceil(mine_amount/4)) return "😀";
        
    return "🙂";
}

function getNumberClass(number) {
    switch (number) {
        case 1: return 'one';
        case 2: return 'two';
        case 3: return 'three';
        case 4: return 'four';
        case 5: return 'five';
        case 6: return 'six';
        case 7: return 'seven';
        case 8: return 'eight';
        default: return '';
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
        if (mines[surrounding[i]]) surrounding_mines++;
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

    const check = [
        original_id + 1,              // forward
        (original_id + y_lenght) + 1, // top forward
        (original_id - y_lenght) + 1, // bottom forward
        original_id - 1,              // backward
        (original_id + y_lenght) - 1, // top backward
        (original_id - y_lenght) - 1, // bottom backward
        original_id + y_lenght,       // top
        original_id - y_lenght        // bottom
    ];

    for (let i = 0; i < check.length; i++) {
        if (check[i] < 1) continue;
        let el_to_check = document.getElementById(check[i]);

        if (el_to_check !== null) {
            if ((i <= 5) && isOverBorder(original_id, check[i])) continue;
            surrounding.push(parseInt(check[i]));
        }
    }

    return surrounding;
}

/**
 * Find out if the new id is over the border (Using flex wrap was a mistake)
 * @param {int} id 
 * @param {bool} plus 
 */
function isOverBorder(original_id, new_id) {
    if (y_border.includes(new_id) && y_border.includes(original_id)) return true;
    return false;
}

/**
 * Start the timer
 */
function startTimer() {
    let sec = 0;
    function pad(val) { 
        if (val >= 999) {
            clearInterval(sec);
            return '999';
        } 
        if (val > 99) return val;
        if (val > 9) return '0' + val;
        return '00' + val; 
    }
    timer = setInterval(function(){
        document.getElementById("time").innerHTML = pad(++sec);
    }, 1000);
}

/**
 * Restart the timer
 */
function resetTimer() {
    clearInterval(timer);
    document.getElementById("time").innerHTML = '000';
}

/**
 * Reset the game
 */
function reset() {
    mines           = [];
    game_over       = false;
    mines           = [];
    emoji.innerHTML = "🙂";
    y_border        = [];
    document.getElementById('left').innerHTML = mine_amount
    resetTimer();
}

/**
 * Reset and restart the game
 */
function reStart() {
    reset();
    createFeild(x_lenght, y_lenght, mine_amount);
}