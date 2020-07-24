// 16 x 30, 99 mine

const feild       = document.getElementsByClassName('feild')[0];
const emoji       = document.getElementsByClassName('emoji')[0];
const square_size = 1.5; // rem
let square_amount = 0;
let mines         = [];
let x_lenght      = 0;
let y_lenght      = 0;
let mine_amount   = 0;
let timer         = '';

// Create feild if empty
if (!feild.hasChildNodes()) {
    createFeild(16, 30, 99); // FIXME: Don't use static numbers
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
        new_square.addEventListener('contextmenu', function(event) { 
            event.preventDefault();
            rightClick(this); 
            return false; 
        }, false);
        new_square.addEventListener("mousedown", areYouScared);
        new_square.addEventListener("mouseup", fearless);
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
function check(element) {
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

            if (mines[placment] === false) {
                mines[placment] = true;
            }
        }

        // Start timer
        startTimer();
    }

    element.classList.remove("square");
    element.classList.add("blank-square");

    // Did they hit a mine?
    if (mines[parseInt(element.id)] === true) {
        element.classList.add("mine");
        let bomb = document.createElement("span");
        bomb.classList.add("bomb");
        bomb.innerHTML = "💣";
        element.appendChild(bomb);

        // Change emoji
        emoji.innerHTML = "💀";

        // Stop timer 
        clearInterval(timer);
        
        return;
    }

    // Check suronding squares
    const surrounding_mines = checkSurondingSquares(element.id);
    if (surrounding_mines > 0) {
        // They hit a number
        element.innerHTML = surrounding_mines;
        return;
    }
    // else {
    //     let should_be_checked = closeBy(element.id);
    //     while (should_be_checked.length > 1) {
    //         let remove = [];
    //         for (let i = 0; i < should_be_checked.length; i++) {
    //             let is_blank = checkSurondingSquares(should_be_checked[i]);
    //             if (is_blank < 1) {
    //                 let blank_element = document.getElementById(should_be_checked[i]);
    //                 blank_element.classList.remove("square");
    //                 blank_element.classList.add("blank-square");
    //                 switch (i) {
    //                     case 0:
    //                     case 3:
    //                     case 6:
    //                         should_be_checked[i] = should_be_checked[i]++;
    //                         break;
    //                     case 1:
    //                     case 4:
    //                     case 7:
    //                         should_be_checked[i] = should_be_checked[i]--;
    //                         break;
    //                     case 2:
    //                         should_be_checked[i] = should_be_checked[i] + y_lenght;
    //                         break;
    //                     case 5:
    //                         should_be_checked[i] = should_be_checked[i] - y_lenght;
    //                         break;
                    
    //                     default:
    //                         break;
    //                 }
    //             }
    //             else {
    //                 remove.push(i);
    //             }
    //         }

    //         if (remove.length > 0) {
    //             remove.forEach(index => {
    //                 should_be_checked.splice(index, 1);
    //             });
    //         }

    //         console.log(should_be_checked);
    //     }
    // }
}

/**
 * Place or remove a flag on right click
 * @param {this} element 
 */
function rightClick(element) {
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
    if (emoji.innerHTML === "💀") return;
    emoji.innerHTML = "😨";
}

function fearless() {
    if (emoji.innerHTML === "💀") return;
    emoji.innerHTML = defaultEmoji();
}

/**
 * Get the default emoji, it will change depending on how mnay flags are placed
 */
function defaultEmoji() {
    const flags = document.getElementsByClassName('flag');

    console.log(Math.ceil((mine_amount/8)+(mine_amount/4)));
    console.log(Math.ceil((mine_amount/2)+(mine_amount/4)));

    if (emoji.innerHTML === "💀") return "💀";
    if (flags.length > mine_amount || flags.length == 0) return "🤔";
    if (flags.length >= Math.ceil(mine_amount-2)) return "🤩";
    if (flags.length > Math.ceil((mine_amount/2)+(mine_amount/3))) return "🥳";
    if (flags.length > Math.ceil((mine_amount/4)+(mine_amount/2))) return "😏";
    if (flags.length > Math.ceil(mine_amount/2)) return "😁";
    if (flags.length > Math.ceil(mine_amount/4)) return "😀";
        
    return "🙂";
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
 * Reset and start a new game
 */
function reset() {
    emoji.innerHTML = "🙂";
    resetTimer();
    createFeild(x_lenght, y_lenght, mine_amount);
}