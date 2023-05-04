let grid = document.getElementById("grid");
let container = document.getElementsByClassName("container")[0];
let body = document.body;
var foodSound = new Audio("foodSound.mpeg");
var bgMusic = new Audio("bgMusic.mpeg");
let scoreContainer = body.getElementsByClassName("score-container")[0];
let score = document.getElementById("score");
let highScore = document.getElementById("high-score");
let bodyHeight = window.getComputedStyle(body).getPropertyValue("height").replace('px', '');//remove "px" for compute
let gridHeight = window.getComputedStyle(grid).getPropertyValue("height").replace('px', '');//remove "px" for compute
// INITIAL set-up 
let snakeArr = [
    { x: 28, y: 4 }  // x:column(Vertical) and y :row(Horizontal)
    , { x: 28, y: 3 }
    , { x: 58, y: 1 }
];
let food = {
    x: 8,
    y: 20
};
let inputDirection = {   // initially don't go anywhere
    x: 0,
    y: 1 // we need to move(rightward),otherwise snake cuts itself as snakeArr[0] === snakeArr[i]
}
let scoreCount = 0;
let highScoreCount = scoreCount;
let musicFlag = false;
// Game will over only when snake cuts itself
const isGameOver = () => {
    for (let i = 1; i < snakeArr.length; i++)
        if (snakeArr[0].x == snakeArr[i].x && snakeArr[0].y == snakeArr[i].y)
            return true;
    return false;
}
// IF snake collides with walls then it will come back to opposite wall
const isCollide = () => {
    if (snakeArr[0].x === 0) {   // snake hits 'top' wall
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1].x = snakeArr[i].x;
            snakeArr[i + 1].y = snakeArr[i].y;
        }
        snakeArr[0].x = 32;  // and head moves to bottom at the same column-axis
        console.log("hits with top wall" + snakeArr[0].x);
    }
    else if (snakeArr[0].x === 32) {  // snake hits  'bottom' wall
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1].x = snakeArr[i].x;
            snakeArr[i + 1].y = snakeArr[i].y;
        }
        snakeArr[0].x = 1;  // and head moves to top at the same column-axis
    }
    else if (snakeArr[0].y === 1) {  // snake hits  'left' wall
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1].x = snakeArr[i].x;
            snakeArr[i + 1].y = snakeArr[i].y;
        }
        snakeArr[0].y = 32;  // and row remain same
    }
    else if (snakeArr[0].y === 32) {  // snake hits  'bottom' wall
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1].x = snakeArr[i].x;
            snakeArr[i + 1].y = snakeArr[i].y;
        }
        snakeArr[0].y = 1;  // and row remain same
    }
}
// main logic starts here
const gameEngine = () => {
    isCollide();  // first check does snake collides with any of the wall ?
    if (isGameOver()) {
        highScoreCount = scoreCount > highScoreCount ? scoreCount : highScoreCount;
        highScore.innerHTML = `Highest Score : ${highScoreCount}`;
        score.innerHTML = `Score : 0`;
        scoreCount = 0;
        alert("Game Over! press OK to restart");
        // restart the game and re-initializes the set-up to it's initial state
        snakeArr = [{ x: 28, y: 4 }
            , { x: 28, y: 3 }
            , { x: 28, y: 1 }];
        food.x = 8;
        food.y = 20;
        inputDirection.x = 0
        inputDirection.y = 1;
    }
    // IF snake has eaten the food, then increment score & regenerate food at the random place as well as increment snakeBody
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        scoreCount++;
        score.innerHTML = `Score :${scoreCount}`;
        snakeArr.unshift({ x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y }); // New head created with new object at the begin 
        // Regenerate food at random place b/w 2 and 30
        let x = Math.floor(Math.random() * 28 + 2);
        let y = Math.floor(Math.random() * 28 + 2);
        food.x = x, food.y = y;
    }
    // MOVE THE SNAKE AS PER USER'S DIRECTION
    for (let i = snakeArr.length - 2; i >= 0; i--) {  // move 1 position a head  
        snakeArr[i + 1].x = snakeArr[i].x;
        snakeArr[i + 1].y = snakeArr[i].y;
    }
    snakeArr[0].x = snakeArr[0].x + inputDirection.x;
    snakeArr[0].y = snakeArr[0].y + inputDirection.y;
    //DISPLAY snake which is stored in snakeArr[]
    grid.innerHTML = "";   // invisible every time we iterate to feel the user like it is moving as CPU is super-fast
    let snakeHeadheight;  // to compute the relative height of snake tail
    snakeArr.forEach((e, index) => {
        // snakeHead create and display 
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.x;   // set row : x
        snakeElement.style.gridColumnStart = e.y;  // set column : y
        if (index === 0) {  // head part
            snakeElement.classList.add("snakeHead");
            grid.appendChild(snakeElement);
            snakeHeadheight = window.getComputedStyle(snakeElement).getPropertyValue("height");
            snakeHeadheight = snakeHeadheight.replace('px', '');   // remove px from 1028px to 1028
        }
        else if (index === snakeArr.length - 2) {// lastTail
            snakeElement.classList.add("snakeTail2");
            grid.appendChild(snakeElement);
            snakeElement.style.height = `${((snakeHeadheight * 70 / 100))}px`;
            snakeElement.style.width = `${((snakeHeadheight * 70 / 100))}px`;
        }
        else if (index === snakeArr.length - 1) {
            snakeElement.classList.add("snakeTail1");
            grid.appendChild(snakeElement);
            snakeElement.style.height = `${((snakeHeadheight * 40 / 100))}px`; snakeElement.style.width = `${((snakeHeadheight * 60 / 100))}px`;
        }
        else { // lower body part
            snakeElement.classList.add("snakeBody");
            grid.appendChild(snakeElement);
        }
    });
    // DISPLAY food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add("food");
    grid.appendChild(foodElement);
}
setInterval(gameEngine, 100); //Game loop
window.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (musicFlag == false) { bgMusic.play(); }
    switch (e.key) {
        case "ArrowUp":  // move up
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case "ArrowDown":  // move down
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        case "ArrowLeft":  // move left
            inputDirection.y = -1;
            inputDirection.x = 0;
            break;
        case "ArrowRight":   // move right
            inputDirection.y = 1;
            inputDirection.x = 0;
            break;
        default:
            break;
    }
})
