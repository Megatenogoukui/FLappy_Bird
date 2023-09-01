
//Making the board
let board;

//Making the bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = window.innerWidth / 8;
let birdY = window.innerHeight /2;
let birdImg;

// Making Bird Object
let bird = {
    x : birdX,
    y : birdY,
    height : birdHeight,
    width : birdWidth
}
//Making the pipes
let pipesArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = window.innerWidth;
let pipeY = 0;

//Setting the values 
let topPipeImg;
let bottomPipeImg;
let context;
let velocityX = -3;
let velocityY = 0;
let gravity = 0.4;
let score = 0;
let gameOver = false;



// Making Background
window.onload = () => {
    
    //Assigning height and width to the board
    board = document.getElementById("board");
    board.height = window.innerHeight;
    board.width = window.innerWidth;
    context = board.getContext("2d");

    //Rendering the bird
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = ()=>{
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    //Storing the image of top pipe in the variable 
    topPipeImg = new Image;
    topPipeImg.src = "./images/toppipe.png"  

    //Storing the image of top pipe in the variable 
    bottomPipeImg = new Image;
    bottomPipeImg.src = "./images/bottompipe.png"  

    //Generation of the pipes
    setInterval(placePipes , 1500);

    //Adding event listners for click and keypress
    document.addEventListener("keydown" ,moveBird);
    document.addEventListener('click', moveBirdMobile)

    //loading the window again and again
    requestAnimationFrame(update);

    
}

//Updating the screen again and again
function update(){
    //If the game is over , Show Game over and pause
    if(gameOver){
        context.fillText("GAME OVER" , 5 ,100)
        return
    }
    //Clearing the Previous frame
    context.clearRect(0,0,board.width ,board.height);

    
    //Adding a no. which is stored inside gravity variable  to the velocityY so that the bird would fall
    velocityY += gravity

    //As we are adding  velocityY , it can happen that the bird would go up outside the screen so to limit that we are limiting the ycordinate to '0'
    bird.y = Math.max(velocityY + bird.y , 0);

   //Drawing the bird image again 
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    //Creating a loop so that we can run through the entire pipesArr
    for (let i = 0 ; i < pipesArr.length ; i++){

        //storing each object in pipe variable
        let pipe = pipesArr[i]

        //Adding velocityX means shifting the pipes towards left
        pipe.x += velocityX;

        //Drawing the pipe image again 
        context.drawImage(pipe.img , pipe.x ,pipe.y ,pipe.width , pipe.height);

        //Increasing the Score if the bird passes the pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; //Added 0.5 because there are two pipes , top and bottom
            pipe.passed = true;
        }
        
        //If collision is detected then setting the value of gameover to true
        if (detectCollision(bird , pipe)){
            gameOver = true;
        }
    }

    //If the bird goes down outside the screen then game over
    if (bird.y > window.innerHeight){
        gameOver = true;
    }

    //Writing the scores on the screens
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,60);


    //Deleting all the pipes that hae gone to the left of the screen
    while(pipesArr.length > 0 && pipesArr[0].x < -pipeWidth){
        pipesArr.shift();
    }

    //loading the window again and again
    requestAnimationFrame(update);
}

//Generration of the pipes
function placePipes(){
    //If gameover then exit the function
    if (gameOver){return};

    //Placing the pipe randomly on Y axis so that we could see all pipes of different length
    let pipeRandomY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)

    //Assigning the space between the two pipes
    let openingSpace = board.height/4

    //Creating the top pipe Object
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : pipeRandomY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }
    //Adding the object to the array
    pipesArr.push(topPipe);

    //Creating the bottom pipe Object
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : pipeRandomY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }
    //Adding the object to the array
    pipesArr.push(bottomPipe);
}

//Adding the jumping animation
function moveBird(e){
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX"){
        //If any of the above button is pressed then shifting the bird up on Y axis 
        velocityY = -6;

        //If game over then reseting all the value
        if(gameOver){
            bird.y = birdY;
            score = 0;
            pipesArr = [];
            gameOver = false;
            requestAnimationFrame(update);
        }
    }
}

//Adding the jumping animation for mobile screen as they dont have buttons
function moveBirdMobile(){
   //If clicked then shifting the bird up on Y axis
    velocityY = -6;
    if(gameOver){
        bird.y = birdY;
        score = 0;
        pipesArr = [];
        gameOver = false;
        requestAnimationFrame(update);
            
        }
}

//Checking the collision
function detectCollision(a , b){
    //If any of the events happened then return true else return false
    return ((a.x + a.width) > b.x && a.x < (b.x + b.width) && a.y < (b.y + b.height) && (a.y + a.height) > b.y)
}