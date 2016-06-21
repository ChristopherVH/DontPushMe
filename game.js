var myGamePiece;
var myObstacles = [];
var startTime;
var playerImage = new Image();
playerImage.src = "./Fother-penguin.png";
var database = firebase.database();
var highScores = [];
var windowFocus = true;

$(window).focus(function() {
    windowFocus = true;
}).blur(function() {
    windowFocus = false;
});

function saveScore(name, score) {
  var playerScore = {
    name: name,
    score: score
  };
  database.ref().child('scores').push(playerScore);
}

function updateHighScores(){
  var innerHTML = "";
  highScores = [];
  database.ref("scores")
    .limitToLast(10)
      .orderByChild("score")
        .on("child_added", function(snapshot){
            highScores.push({name: snapshot.val().name, score: snapshot.val().score });
        });
  $("#highScoreList").empty();
  highScores.reverse();
  for(var i=0; i<highScores.length; i++){
    innerHTML = (i + 1).toString() + " ) " +  highScores[i].name + " : " + highScores[i].score;
    $("#highScoreList").append($("<li>").text(innerHTML));

  }
}

function restartCanvas(){
  myObstacles = [];
  myGamePiece.x = 270;
  myGamePiece.y = 540;
  myGamePiece.xmove = 0;
  myGamePiece.ymove = 0;
  myGamePiece.crashUp = false;
  myGamePiece.crashDown = false;
  myGamePiece.crashRight = false;
  myGamePiece.crashLeft = false;
  myGamePiece.crashNumb = 0;
  myGameArea.keys = [];
  myGameArea.start();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        startTime = new Date();
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(unFocused, 20);
        this.frameNo = 0;
        this.addspeed = 0;
        this.speed = 2;
        this.times = 3;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
      clearInterval(this.interval);
      var finalScore = ((new Date() - startTime)/1000);
      restartCanvas();
      var person = prompt("Please enter your name to get high-score bragging rights");
      if (person !== undefined && person !== "" &&  person.length < 25 && person.length > 0 && !(person.startsWith(" "))){
        saveScore(person, finalScore);
      }
      updateHighScores();
      startTime = new Date;
    }
};

function drawElapsedTime() {
    var elapsed = (parseInt((new Date() - startTime))/ 1000);
    ctx = myGameArea.context;
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(elapsed.toString(),500,550);
}

function unFocused(){
  if (windowFocus){
    updateGameArea();
  }else{
    startTime = new Date();
  }
}



function component(width, height, color, x, y, speed) {
    this.width = width;
    this.height = height;
    this.crashUp = false;
    this.crashDown = false;
    this.crashLeft = false;
    this.crashRight = false;
    this.color = color;
    this.crashNumb = 0;
    this.speed = speed;
    this.moveleft = -5;
    this.moveright = 5;
    this.movedown = 5;
    this.moveup = -5;
    this.x = x;
    this.y = y;
    this.crashPositions = {top:false, bottom:false, right:false, left:false};
    this.xmove = 0;
    this.ymove = 0;
    if(myGameArea.keys && myGameArea.keys[37] && this.color !== "blue"){
      this.speedleft = this.moveleft;
    }else{
      this.speedleft = 0;
    }
    if(myGameArea.keys && myGameArea.keys[39] && this.color !== "blue"){
      this.speedright = this.moveright;
    }else{
      this.speedright = 0;
    }
    if(myGameArea.keys && myGameArea.keys[40]  && this.color !== "blue"){
      this.speeddown = this.movedown;
    }else{
      this.speeddown = 0;
    }
    if(myGameArea.keys && myGameArea.keys[38]  && this.color !== "blue"){
      this.speedup = this.moveup;
    }else{
      this.speedup = 0;
    }
    this.update = function(){
        this.lastmove = [this.x, this.y];
        ctx = myGameArea.context;
        if (this.color !== "blue"){
          if (myGameArea.keys && myGameArea.keys[40]){
            if(myGameArea.keys && myGameArea.keys[39]){
              ctx.drawImage(playerImage, 80, 40, 40, 40, this.x, this.y, 30, 30);
              //down and right
            }else if(myGameArea.keys && myGameArea.keys[37]){
              //down and left
              ctx.drawImage(playerImage, 80, 295, 40, 40, this.x, this.y, 30, 30);
            }else{
              ctx.drawImage(playerImage, 80, 0, 40, 40, this.x, this.y, 30, 30);
            }
          }else if (myGameArea.keys && myGameArea.keys[38]){
            if(myGameArea.keys && myGameArea.keys[39]){
              ctx.drawImage(playerImage, 80, 125, 40, 40, this.x, this.y, 30, 30);
              //up and right
            }else if(myGameArea.keys && myGameArea.keys[37]){
              //up and left
              ctx.drawImage(playerImage, 80, 210, 40, 40, this.x, this.y, 30, 30);
            }else{
              ctx.drawImage(playerImage, 80, 170, 40, 40, this.x, this.y, 30, 30);
            }
          }else if(myGameArea.keys && myGameArea.keys[39]){
            ctx.drawImage(playerImage, 80, 85, 40, 40, this.x, this.y, 30, 30);
            // just right
          }else if(myGameArea.keys && myGameArea.keys[37]){
            ctx.drawImage(playerImage, 80, 250, 40, 40, this.x, this.y, 30, 30);
            //just left
          }
          else{
            ctx.drawImage(playerImage, 80, 0, 40, 40, this.x, this.y, 30, 30);
          }
        }else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
    this.die = function(){
      var mybottom = this.y + (this.height);
      var end = false;
      if (mybottom > myGameArea.canvas.height){
        end = true;
      }
      return end;
    };
    this.hitSides = function(){
      var mytop = this.y;
      var myleft = this.x;
      var myright = this.x + (this.width);
      if (mytop < 0){
        this.y = 0;
        //reset to canvas height
      }
      if(myleft < 0){
        this.x = 0;
        //reset to 0
      }
      if(myright > myGameArea.canvas.width){
        this.x = myGameArea.canvas.width - this.width;
        // reset to canvas width
      }
    };
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;

        if ((mybottom - this.speeddown < othertop ) ||
               (mytop + this.speedup > otherbottom ) ||
               (myright + this.speedright < otherleft) ||
               (myleft - this.speedleft > otherright)) {
           crash = false;
        }
        // if(mybottom < othertop || myleft > otherright || myright > otherleft || mytop > otherbottom){
        //   crash = false;
        // }
        // crash positions relative to object
        if (crash){
          this.xmove = 0;
          this.ymove = 0;
          if (mytop <= othertop && mybottom >= otherbottom){
            if(myright >= otherright){
              this.xmove = otherright - myleft + this.speedleft;
              this.moveleft = 0;
            }else if(myleft <= otherleft){
              this.xmove = otherleft - myright - this.speedright;
              this.moveright = 0;
            }
          }
          else if(myleft >= otherleft && myright <= otherright){
            if(mytop <= othertop){
              this.ymove = othertop - mybottom + otherobj.speed;
              this.movedown = 0;
              //4
            }else{
              this.ymove = otherbottom - mytop + otherobj.speed;
              this.moveup = 0;
              //8
            }
          }
          else if(myleft <= otherleft){
            if(mytop <= othertop){
              this.xmove = otherleft - myright - this.speedright;
              this.ymove = othertop - mybottom + otherobj.speed;// sleepx
              if((Math.abs(this.ymove) < Math.abs(this.xmove)) || (this.crashRight && this.crashNumb < 2)){
                this.xmove = 0;
                this.movedown = 0;
              }else{
                this.ymove = 0;
                this.moveright = 0;
              }
              //3
            }else if(mytop >= othertop){
              if(mybottom >= otherbottom){
                this.xmove =  otherleft - myright - this.speedright;
                this.ymove = otherbottom - mytop + otherobj.speed;


                if((Math.abs(this.ymove) < Math.abs(this.xmove)) || (this.crashRight && this.crashNumb < 2)) {
                  this.xmove = 0;
                  this.moveup = 0;
                }else{
                  // this.xmove = 0;
                  this.ymove = 0;
                  this.moveright = 0;
                }
                //1
              }else{
                this.xmove = otherleft - myright - this.speedright;
                this.moveright = 0;
                //2
              }
            }
          }
          else if(myright >= otherright){
            if(mytop <= othertop){
              this.ymove = othertop - mybottom + otherobj.speed;
              this.xmove = otherright - myleft + this.speedleft;

              if((Math.abs(this.ymove) < Math.abs(this.xmove) ) || (this.crashLeft && this.crashNumb < 2)){
                this.xmove = 0;
                this.movedown = 0;
              }else{
                this.ymove = 0;
                this.moveleft = 0;
              }
              //5
            }else if(mytop >= othertop){
              if(mybottom <= otherbottom){
                this.xmove = otherright - myleft + this.speedleft;
                this.moveleft = 0;
                //6
              }else{
                this.xmove = otherright - myleft + this.speedleft;
                this.ymove = otherbottom - mytop + otherobj.speed;


                if((Math.abs(this.ymove) < Math.abs(this.xmove)) || (this.crashLeft && this.crashNumb < 2)){
                  this.xmove = 0;
                  this.moveup = 0;
                }else{
                  // this.xmove = 0;
                  this.ymove = 0;
                  this.moveleft = 0;
                }
                //7
              }
            }
          }
        }
          // if (myright > otherleft && myleft > otherleft){
          //   this.crashPositions.right = true;
          // }
          // if (myleft < otherright && myright < otherright){
          //   this.crashPositions.left = true;
          // }
          // if (mytop < otherbottom && mybottom < otherbottom){
          //   this.crashPositions.top = true;
          // }
          // if (mybottom > othertop && mytop > othertop){
          //   this.crashPositions.bottom = true;
          // }

        return crash;
    };
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}


function updateGameArea() {

    var x, y;
    myGameArea.frameNo += 1;
    if (everyinterval(1000)){
      myGameArea.speed += 1;
    }
    if (everyinterval(300)){
      myGameArea.times +=1;
    }
    if (everyinterval(900)){
      myGameArea.addspeed += 1;
    }
    if( myGamePiece.die()){
      myGameArea.stop();
    }
    myGamePiece.crashUp = false;
    myGamePiece.crashDown = false;
    myGamePiece.crashRight = false;
    myGamePiece.crashLeft = false;
    myGamePiece.crashNumb = 0;
    if (myGameArea.frameNo == 1 || everyinterval(20)) {
       y = -100;
       minWidth = 30;
       maxWidth = 50;
       minHeight = 12;
       maxHeight = 30;
       for (var i = 0; i < myGameArea.times; i++) {
         x = Math.floor(Math.random() * (myGameArea.canvas.width));
         randHeight = Math.floor(Math.random()*(maxHeight-minHeight+1) + minHeight);//TODO change back to min height
         randWidth = Math.floor(Math.random()*(maxWidth-minWidth+1) + minWidth);
         randSpeed = Math.floor(Math.random()* 5 + myGameArea.speed);
         myObstacles.push(new component(randWidth, randHeight, "blue", x, y, randSpeed));
       }
    }
    myGamePiece.movedown = 5 + myGameArea.addspeed;
    myGamePiece.moveright = 5 + myGameArea.addspeed;
    myGamePiece.moveleft = -5 - myGameArea.addspeed;
    myGamePiece.moveup = -5 - myGameArea.addspeed;
    for (i = 0; i < myObstacles.length; i += 1) {
      if (myObstacles[i].y > 600){
        myObstacles.splice(i,1);
      }
      for (j = 0; j < myObstacles.length; j += 1){
        if (myObstacles[i].crashWith(myObstacles[j])){
          if(myObstacles[i].ymove < 0){
            myObstacles[i].y = myObstacles[i].y + myObstacles[i].ymove;
            myObstacles[i].speed = myObstacles[j].speed;
          }
        }
      }
        if (myGamePiece.crashWith(myObstacles[i])) {
          if (myGamePiece.ymove < 0){
            myGamePiece.crashUp = true;
            myGamePiece.crashNumb +=1;
            // console.log("CRASHUP");
          }
          if (myGamePiece.ymove > 0){
            myGamePiece.crashDown = true;
            myGamePiece.crashNumb +=1;
            // console.log("CRASHDOWN");
          }
          if (myGamePiece.xmove < 0){
            myGamePiece.crashRight = true;
            myGamePiece.crashNumb +=1;
            // console.log("CRASHRIGHT");
          }
          if (myGamePiece.xmove > 0){
            myGamePiece.crashLeft = true;
            myGamePiece.crashNumb +=1;
            // console.log("CRASHLEFT");
          }

          if ((myGamePiece.crashUp && myGamePiece.crashDown)){
            myGameArea.stop();
          }

          // console.log(myGamePiece.crashUp);
          // console.log(myGamePiece.crashRight);
          // console.log(myGamePiece.crashDown);
          // console.log(myGamePiece.crashLeft);
          myGamePiece.x = myGamePiece.x + myGamePiece.xmove;
          myGamePiece.y = myGamePiece.y + myGamePiece.ymove;
          // myObstacles[i].y + myObstacles[i].height + myObstacles[i].speed;
          // if (myGamePiece.ymove > 0){
          //   myGamePiece.y = myGamePiece.y + myGamePiece.ymove + myObstacles[i].speed;
          // }
          // if(myGamePiece.ymove > 0){
          //   myGamePiece.y += myObstacles[i].speed;
          // }
          // if(myGamePiece.xmove > 0){
            // myGameArea.keys[37] = false;
            // myGamePiece.moveleft = 0;
          // }else if(myGamePiece.xmove < 0){
            // myGameArea.keys[39] = false;
            // myGamePiece.moveleft = 0;
          // }
          // else if(myGamePiece.ymove > 0){
            // myGameArea.keys[38] = false;
            // myGamePiece.y += myObstacles[i].speed;
            // myGamePiece.moveup = 0;
          // }
          // else if(myGamePiece.ymove < 0){
            // myGameArea.keys[40] = false;

            // myGamePiece.moveup = 0;
          // }
        }
    }

    myGameArea.clear();

    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.x += myGamePiece.moveleft; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.x += myGamePiece.moveright; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.y += myGamePiece.moveup; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.y += myGamePiece.movedown; }
    myGamePiece.hitSides();
    myGamePiece.update();

   for (i = 0; i < myObstacles.length; i += 1) {
       myObstacles[i].y += myObstacles[i].speed;
       myObstacles[i].update();
   }
   drawElapsedTime();
    // myObstacle.y += 1;
    // myObstacle2.y += 3;

    // if (myGamePiece.crashWith(myObstacle)) {
    //   console.log(myGamePiece.xmove);
    //   console.log(myGamePiece.ymove);


    // }

    // myObstacle.update();
    // myObstacle2.update();
}

function startGame() {
  updateHighScores();
  $("#startButton").click(function (){
    $("#startButton").hide();
    $("#infoContainer").hide();
    myGameArea.start();
    startTime = new Date();
    myGamePiece = new component(30, 30, "red", 270, 540);
  });
}
