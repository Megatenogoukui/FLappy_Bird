let board;
let boardHeight = window.innerHeight;
let boardWidth = window.innerWidth;
let birdImg;
let context;

//Making the bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight /2;


//Making the pipes
let pipesArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -3;
let velocityY = 0;
let gravity = 0.4;
let score = 0;
let gameOver = false;
// Making Bird Object
let bird = {
    x : birdX,
    y : birdY,
    height : birdHeight,
    width : birdWidth
}


// Making Background
window.onload = () => {
    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // context.fillStyle = "green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height)

    //Rendering the bird
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = ()=>{
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg = new Image;
    topPipeImg.src = "./images/toppipe.png"  

    bottomPipeImg = new Image;
    bottomPipeImg.src = "./images/bottompipe.png"  


    document.addEventListener("keydown" ,moveBird);
    document.addEventListener('click', moveBirdMobile)

    requestAnimationFrame(update);
    setInterval(placePipes , 1500);
}

function update(){
    if(gameOver){
        context.fillText("GAME OVER" , 5 ,100)
        return
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width ,board.height);
    velocityY += gravity
    bird.y = Math.max(velocityY + bird.y , 0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    for (let i = 0 ; i < pipesArr.length ; i++){
        let pipe = pipesArr[i]
        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }
        pipe.x += velocityX;
        context.drawImage(pipe.img , pipe.x ,pipe.y ,pipe.width , pipe.height);
        if (detectCollision(bird , pipe)){
            gameOver = true;
        }
    }
    if (bird.y > boardHeight){
        gameOver = true;
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,60);
    //Deleting all the pipes that hae gone to the left of the screen
    while(pipesArr.length > 0 && pipesArr[0].x < -pipeWidth){
        pipesArr.shift();
    }
}

function placePipes(){
    if (gameOver){return}
    let pipeRandomY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace = board.height/4
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : pipeRandomY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }

    pipesArr.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : pipeRandomY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }

    pipesArr.push(bottomPipe);



}


function moveBird(e){
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX"){
        velocityY = -6;
        if(gameOver){
                bird.y = birdY;
            score = 0;
            pipesArr = [];
            gameOver = false;
            requestAnimationFrame(update);
            
        }
    }
    
}
function moveBirdMobile(){
    velocityY = -6;
        if(gameOver){
                bird.y = birdY;
            score = 0;
            pipesArr = [];
            gameOver = false;
            requestAnimationFrame(update);
            
        }
}
function detectCollision(a , b){
    return ((a.x + a.width) > b.x && a.x < (b.x + b.width) && a.y < (b.y + b.height) && (a.y + a.height) > b.y)

    
}