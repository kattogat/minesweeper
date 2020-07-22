// 16 x 30, 99 mine

const feild = document.getElementsByClassName('feild')[0];
const square_size = 1.5; // rem
let square_amount = 0;

if (!feild.hasChildNodes()) {
    // create feild
    createFeild(16, 30, 99);
}

function createFeild(x, y, mines) {
    const amount = x * y;

    if (feild.hasChildNodes()) {
        // Clear feild
        feild.textContent = '';
    }

    let count = 0;
    for (let i = 0; i < amount; i++) {
        let new_square = document.createElement("div");
        new_square.classList.add("square");
        new_square.id = count;
        new_square.addEventListener("click", function(){ click(this); })
        feild.appendChild(new_square);

        count++;
    }
    square_amount = count;

    // Place mines
}

function click (element) {
}