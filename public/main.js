var game = new Phaser.Game(550, 685, Phaser.CANVAS, 'gameboard'),
    hole,
    i;
var mainState = {
  preload: function(){
    game.stage.backgroundColor = '#71c5cf';
    game.load.image('bkgrd', 'assets/bkgrd.png');
    game.load.image('whale', 'assets/whale.png');
    game.load.image('rock','assets/rock.png');
    game.load.image('anchor', 'assets/anchor.png');
    game.load.audio('splat', 'assets/jab.mp3');
    game.load.audio('jump', 'assets/water-drop.mp3');
  },
  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.background = this.game.add.sprite(0, 0, 'bkgrd');

    this.rocks = game.add.group();
    this.rocks.enableBody = true;
    this.rocks.createMultiple(20, 'rock');
    this.rocks.forEach(function(rock){
      rock.body.width = 20;
    });
    this.timer = game.time.events.loop(2500, this.addRowOfRocks, this);

    this.anchors = game.add.group();
    this.anchors.enableBody = true;
    this.anchors.createMultiple(20, 'anchor');
    this.anchors.forEach(function(anchor){
      anchor.body.width = 1;
      anchor.anchor.setTo(0.5, 0.5);

    });
    this.timer = game.time.events.loop(2500, this.addRowOfAnchors, this);

    this.whale = this.game.add.sprite(100, 245, 'whale');

    game.physics.arcade.enable(this.whale);
    this.whale.body.gravity.y = 1000;

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    this.whale.anchor.setTo(-0.2, 0.5);
    this.whale.body.height = 20;
    this.score = -1;
    this.labelScore = game.add.text(40, 20, '0', {font: '30px Arial', fill: '#ffffff'});
    this.splatSound = game.add.audio('splat');
    this.jumpSound= game.add.audio('jump');

  },
  update: function(){
    if(this.whale.inWorld === false){
      this.restartGame();
    }
    game.physics.arcade.overlap(this.whale, this.rocks, this.hitObstacle, null, this);
    game.physics.arcade.overlap(this.whale, this.anchors, this.hitObstacle, null, this);

    if(this.whale.angle < 7)
      this.whale.angle += 1;
  },
  jump: function(){
    if(this.whale.alive === false)
      return;
    this.whale.body.velocity.y = -300;
    game.add.tween(this.whale).to({angle: -5}, 100).start();
    this.jumpSound.play();
  },
  restartGame: function(){
    game.state.start('main');
  },
  addOneRock: function(x,y){
    var rock = this.rocks.getFirstDead();
    rock.reset(x,y);
    rock.body.velocity.x = -200;
    rock.checkWorldBounds = true;
    rock.outOfBoundsKill = true;
  },
  addRowOfRocks: function(){
    var height = Math.floor(Math.random()*100) +400;
     this.addOneRock(500, height);
     this.score += 1;
     this.labelScore.text = this.score;
  },
  addOneAnchor: function(x,y){
    var anchor = this.anchors.getFirstDead();
    anchor.reset(x,y);
    anchor.body.velocity.x = -200;
    anchor.checkWorldBounds = true;
    anchor.outOfBoundsKill = true;
  },
  addRowOfAnchors: function(){
    //var height = Math.floor(Math.random()*100) - 200;
    height = 100;
    this.addOneAnchor(500, height);
  },
  hitObstacle: function(){
    if(this.whale.alive === false)
      return;
    this.splatSound.play();
    this.whale.alive = false;
    game.time.events.remove(this.timer);

    this.rocks.forEachAlive(function(p){
      p.body.velocity.x = 0;
    }, this);

    this.anchors.forEachAlive(function(p){
      p.body.velocity.x = 0;
    }, this);
  },
  render: function(){

    this.anchors.forEach(function(anchor){
      game.debug.body(anchor);
    });
    this.rocks.forEach(function(rock){
      game.debug.body(rock);
    });

    game.debug.body(this.whale);
  }
};

game.state.add('main', mainState);
game.state.start('main');
