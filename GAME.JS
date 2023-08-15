var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var start = false;
var blokImage;
var obj;
var objEndGame;
var bgImageMine;
var bgImageCandy;
var bgImageWitch1;
var ImageWitch2;
var ImageWitch3;
var ImageWitch4;
var recordPoints = [];
var topScore;
var closeWindow;
const storageKey = "pointsStorage"
var dataList = JSON.parse(localStorage.getItem(storageKey));
var first=true;
var TempX;


window.addEventListener("load", Start);
//Start();
//0-none
//1-white
//2-pacman
//3-candy
//4-wall
//5-mine
//6-witch1
function Start() {

    closeModal();
    closeModalEndGame();
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var cnt = 128;
    var food_remain = 70;
    var food_good_remain = 20;
    var food_mine = 12;
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 20; i++) {
        board[i] = new Array();
        for (var j = 0; j < 10; j++) {
            if ((i == 3 && j == 3) || (i == 4 && j == 3) || (i == 3 && j == 6) || (i == 4 && j == 6) || (i == 14 && j == 2) || (i == 14 && j == 3) || (i == 14 && j == 7) || (i == 14 && j == 6) || (i == 15 && j == 3) || (i == 16 && j == 3)
                || (j == 2 && (i == 8 || i == 9 || i == 10 || i == 11)) || (j == 7 && (i == 8 || i == 9 || i == 10 || i == 11))
                || (i == 15 && j == 6) || (i == 16 && j == 6) || (i == 5 && j == 3) || (i == 5 && j == 2) || (i == 5 && j == 7) || (i == 5 && j == 6) || i == 0 || j == 0 || i == 19 || j == 19 || j == 9) {
                board[i][j] = 4;
            }
            else if (i == 1 && j == 1) {
                board[i][j] = 6;
            }
            else if (i == 18 && j == 1) {
                board[i][j] = 7;
            }
            else if (i == 1 && j == 8) {
                board[i][j] = 8;
            }
            else if (i == 18 && j == 8) {
                board[i][j] = 9;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= 0.7 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = 1;
                }
                /* else if (pacman_remain == 1) {          //randomNum < 0.7 * (pacman_remain + food_remain) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                }*/
                else if ((randomNum >= 0.7 * (food_remain + food_good_remain) / cnt) && (randomNum <= 0.9 * (food_remain + food_good_remain) / cnt)) {
                    shape.i = i;
                    shape.j = j;
                    food_good_remain--;
                    board[i][j] = 3;
                }
                else if (randomNum >= 0.9 * (food_remain + food_mine) / cnt && randomNum <= 1.0 * (food_remain + food_mine) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    food_mine--;
                    board[i][j] = 5;
                }
                else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
    while (food_mine >= 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 3;
        food_mine--;
    }
    while (food_good_remain >= 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 3;
        food_good_remain--;
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }


    findEmptyCell(board);
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval = setInterval(UpdatePosition, 250);

    //sound
    obj = document.getElementById("targetSound");
    objEndGame = document.getElementById("endGame");

    bgImageMine = new Image();
    bgImageMine.src = "images/mine.png";

    bgImage = new Image();
    bgImage.src = "images/blok.jpg";

    bgImageCandy = new Image();
    bgImageCandy.src = "images/candy.png";
    start = true;

    bgImageWitch1 = new Image();
    bgImageWitch1.src = "images/1.jpg";

    bgImageWitch2 = new Image();
    bgImageWitch2.src = "images/2.jpg";

    bgImageWitch3 = new Image();
    bgImageWitch3.src = "images/3.jpg";

    bgImageWitch4 = new Image();
    bgImageWitch4.src = "images/4.jpg";

   /* $(document).ready(function () {
        //$( "li.item-ii" ).find( item1 )
        $("#canvas")[0].delay("slow").fadeIn();
        // $("#canvas").find("1.jpg").delay("slow").fadeIn();
        //  $("#canvas").delay("fast").fadeOut();
        //$("#canvas").delay(800).fadeIn();
    });*/
}


function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 18) + 1);
    var j = Math.floor((Math.random() * 8) + 1);
    while (board[i][j] != 0) {
        i = Math.floor((Math.random() * 18) + 1);
        j = Math.floor((Math.random() * 8) + 1);
    }
    return [i, j];
}

function findEmptyCell(board) {
    var num = Math.floor((Math.random() * 3) + 3);
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            if (board[i][j] != 0) {
                break;
            }
            else
                board[i][j] = num;
        }
    }
}




function GetKeyPressed() {

    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}


$("#audio").on({
    'click': function () {
        var bool = $("#targetSound").prop("muted");
        $("#targetSound").prop("muted", !bool);
        var src = ($(this).attr('src') == 'images/muted.png')
            ? 'images/play.png'
            : 'images/muted.png';
        $(this).attr('src', src);
    }
})

function Draw() {

    obj.play();
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            var x = GetKeyPressed();
            if(x==undefined && TempX==undefined)
            x=4;
           else if(x==undefined)
            x=TempX;
            if (board[i][j] == 2) {
                
                //up
                if (x == 1) {
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.45 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                    TempX=1;
                }
                //down
                else if (x == 2) {
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 2.65 * Math.PI, 0.45 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                    TempX=2;
                }
                //left
                else if (x == 3) {
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                    TempX=3;
                }
                //right
                else if (x == 4) {
                    //first=false;
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                    TempX=4;
                }
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "white"; //color 
                context.fill();
            }
            else if (board[i][j] == 3) {
                context.beginPath();
                context.drawImage(bgImageCandy, center.x - 15, center.y - 22);
            }
            else if (board[i][j] == 5) {
                context.beginPath();
                context.drawImage(bgImageMine, center.x - 25, center.y - 22);
            }
            else if (board[i][j] == 4) {
                context.drawImage(bgImage, center.x - 30, center.y - 30);
            }
            else if (board[i][j] == 6) {
                context.drawImage(bgImageWitch1, center.x - 20, center.y - 25);
            }
            else if (board[i][j] == 7) {
                context.drawImage(bgImageWitch2, center.x - 20, center.y - 25);
            }
            else if (board[i][j] == 8) {
                context.drawImage(bgImageWitch3, center.x - 20, center.y - 25);
            }
            else if (board[i][j] == 9) {
                context.drawImage(bgImageWitch4, center.x - 20, center.y - 25);
            }
        }
    }
}

function UpdatePosition() {
    if (start) {
        board[shape.i][shape.j] = 0;
        var x = GetKeyPressed()
        if (x == 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
                shape.j--;
            }
        }
        if (x == 2) {
            if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
                shape.j++;
            }
        }
        if (x == 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
                shape.i--;
            }
        }
        if (x == 4) {
            if (shape.i < 19 && board[shape.i + 1][shape.j] != 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] == 1) {
            score++;
        }
        else if (board[shape.i][shape.j] == 3) {
            score += 3;
        }
        else if (board[shape.i][shape.j] == 5 && score > 1) {
            score -= 2;
        }
        else if (board[shape.i][shape.j] >= 6 && board[shape.i][shape.j] <= 9) {
            GameOver();
        }
        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000;
        if (score >= 20 && time_elapsed <= 10) {
            pac_color = "orange";
        }
        else {
            Draw();
        }
        if (EndGame()) {
            objEndGame.play();
            obj.pause();
            clearInterval(interval);
            openModal();
        }
    }
    else
        Start();
}
function GameOver() {
    openModalEndGame();
}

function EndGame() {
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            if (board[i][j] != 0 && board[i][j] != 2 && board[i][j] != 4 && board[i][j] != 5 && board[i][j] != 6 && board[i][j] != 7 && board[i][j] != 8 && board[i][j] != 9) {
                return false;
            }
        }
    }
    
    var timeNow = time_elapsed;
    document.getElementById("endGameTime").innerHTML = "You did it in a " + timeNow;

    recordsScore(time_elapsed);
    return true;
}

function recordsScore(time_elapsed) {

    if (dataList == null) {
        dataList = []
    }
    dataList.splice(1, 0, time_elapsed);
    localStorage.setItem(storageKey, JSON.stringify(dataList))
    clearInterval(interval)
    openModal();
    var x = JSON.parse(localStorage.getItem(storageKey));
    console.log("x" + x);
    var highestScore = Math.min.apply(Math, x);
    console.log("highestScore" + highestScore);

    document.getElementById("bestResult").innerHTML = "Your best result is: " + highestScore;
    return highestScore;

}

function closeModal() {
    document.getElementById('myModal').style.display = 'none'
}
function openModal() {
    document.getElementById('myModal').style.display = 'block'
}

function openModalEndGame() {
    document.getElementById('myModalGameOver').style.display = 'block'
    clearInterval(interval)
}

function closeModalEndGame()  {
    document.getElementById('myModalGameOver').style.display = 'none'
}

var spanEndGame = document.getElementsByClassName("closeEndGame")[0];

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeWindow(){
    closeWindow = window.close('index.htm');
}