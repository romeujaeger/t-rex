//Vars

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage, cloudGroup 
var cactus1, cactus2, catus3, cactus4, cactus5, cactus6;
var Play = 1
var end = 0
var gameState = Play
var cactusGroup
var jumpS, dieS, checkS
var gameover, restart, gameoverIMG, restartIMG

var score = 0;

//Function: Imagens do jogo
function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
 cloudImage = loadImage("cloud.png");
  
 cactus1 = loadImage ("obstacle1.png");
 cactus2 = loadImage ("obstacle2.png");
 cactus3 = loadImage ("obstacle3.png");
 cactus4 = loadImage ("obstacle4.png");
 cactus5 = loadImage ("obstacle5.png");
 cactus6 = loadImage ("obstacle6.png");
 jumpS = loadSound ('jump.mp3');
 dieS = loadSound ('die.mp3');
 checkS = loadSound ('checkpoint.mp3');
 gameoverIMG = loadImage ('gameOver.png');
 restartIMG = loadImage ('restart.png');
}

function setup() {

  createCanvas(600,200)
  
  cloudGroup = new Group()
  cactusGroup = new Group()

  //Criar um sprite pro trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  trex.setCollider('circle', 0, 0, 40);
  trex.debug = false

  //Criar um sprite pro chão
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //Criar o  chão invisível
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //Gerar números aleatórios
  var rand =  Math.round(random(1,100))
  console.log(rand)

  gameover = createSprite(300, 100);
  gameover.addImage(gameoverIMG);
  gameover.scale = 0.5

  restart = createSprite(300, 140);
  restart.addImage(restartIMG);
  restart.scale = 0.5
}


//Function: Draw
function draw() {
  background("white");
  textSize(15);
  text('Pontuação: ' + score, 450, 30);


  console.log(frameCount)
  
  //Game State

  if (gameState === Play){
    ground.velocityX = -(4 + score/100);

    gameover.visible = false
    restart.visible = false

    score = score + Math.round (getFrameRate()/60);
    
    if (score > 0 && score%100 === 0){
      checkS.play();
    }


    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -10;
      jumpS.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnCactus();
    spawnClouds();
    
    if (cactusGroup.isTouching(trex)){
      gameState = end
      dieS.play();
      //trex.velocityY = -12
    }


  }


  else if (gameState === end){
    ground.velocityX = 0;
    cactusGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    trex.changeAnimation('collided', trex_collided);
    cactusGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    gameover.visible = true
    restart.visible = true
  }

  
  //Impedir que o trex caia (chão invisível)
  trex.collide(invisibleGround);
  
if (mousePressedOver(restart)){
  reset()
}

  drawSprites();
}

function reset(){
  score = 0
   gameState = Play
   cactusGroup.destroyEach();
   cloudGroup.destroyEach();
}

//Function: gerar as nuvens
function spawnClouds(){
 if (frameCount % 60 === 0){
  var cloud = createSprite (600, 100, 40, 10);
  cloud.velocityX = -3 
  cloud.addImage (cloudImage); 
  cloud.scale = 0.7 
  cloud.y = Math.round (random(10, 80)); 
  cloud.depth = trex.depth    
  trex.depth = trex.depth + 1 
  cloudGroup.add(cloud);
 }
}

//Function: gerar os cactus
function spawnCactus(){
    if (frameCount % 60 === 0){
    var cactus = createSprite (600, 165, 10, 40)
    cactus.velocityX = -(4 + score/100); 
    var rand = Math.round(random(1, 6));
      switch(rand){
        case 1: cactus.addImage(cactus1);
        break;
        case 2: cactus.addImage(cactus2);
        break;
        case 3: cactus.addImage(cactus3);
        break;
        case 4: cactus.addImage(cactus4);
        break;
        case 5: cactus.addImage(cactus5);
        break;
        case 6: cactus.addImage(cactus6);
        break;
        default: break;
    }
    cactus.scale = 0.5
    cactus.lifetime = 200
    cactusGroup.add(cactus);
  }
}