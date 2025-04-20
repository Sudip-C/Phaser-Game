// Create our only scene called mainScene, in the game.js file
class mainScene {
    // The three methods currently empty
  
    preload() {
      // This method is called once at the beginning
      // It will load all the assets, like sprites and sounds  
      this.load.image('player', 'assets/alien.png');
      this.load.image('coin', 'assets/coin.png');
    }
    create() {
      // This method is called once, just after preload()
      // It will initialize our scene, like the positions of the sprites
      this.started=false;
      this.player = this.physics.add.sprite(120, 120, 'player');
      this.coin = this.physics.add.sprite(300, 300, 'coin');

      this.physics.pause(); // Pause game at the beginning

      this.score = 0; // Initialize the score to 0
      let style = { font: '20px Arial', fill: '#fff' };
      this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);
      this.arrow = this.input.keyboard.createCursorKeys(); // Create the arrow keys

      this.startText = this.add.text(700, 250, 'Press Any Arrow Key to Start', {
        font: '28px Arial',
        fill: '#fff'
      }).setOrigin(0.5)

      this.physics.add.overlap(this.player, this.coin, this.hit, null, this);

      this.timeleft=30;//seconds
      this.timerText = this.add.text(20, 50, 'Time: ' + this.timeleft, style);
    //   this.timer = this.time.addEvent({
    //     delay:1000,
    //     callback: this.updateTimer,
    //     callbackScope: this,
    //     loop: true
    //   })


      this.gameOver = false;
      this.gameOverText = this.add.text(700, 300, 'Game Over!\nPress R to Restart', {
        font: '32px Arial',
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5).setVisible(false);

      this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

      // Enable boundary collision for the player
      this.player.setCollideWorldBounds(true); // Prevent the player from going out of bounds
      this.player.body.onWorldBounds = true; // Enable world bounds for the player
      this.physics.world.on('worldbounds', () => {
        this.endGame()
      })

    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements
      if (this.gameOver) {
        if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
          this.scene.restart();
        }
        return; // Don't run update logic if game is over
      }
    //   if(this.physics.overlap(this.player, this.coin)){
    //     //call the hit function when the player and coin overlap
    //     this.hit();
    //   }

    if(!this.started){
        if(
        this.arrow.left.isDown || 
        this.arrow.right.isDown || 
        this.arrow.up.isDown || 
        this.arrow.down.isDown
        ){
            this.startGame()
        }
        return
    }


    this.player.setVelocity(0); // Reset velocity to 0 before checking input
      if(this.arrow.right.isDown) {
         // If the right arrow is pressed, move to the right
        this.player.setVelocityX(350)
      }else if(this.arrow.left.isDown) {
        // If the left arrow is pressed, move to the left
        this.player.setVelocityX(-350)
    }
        if(this.arrow.up.isDown) {
            // If the up arrow is pressed, move up
            this.player.setVelocityY(-350)
        }else if(this.arrow.down.isDown) {
            // If the down arrow is pressed, move down
            this.player.setVelocityY(350)
        }
    }
    hit(){
        if (this.gameOver) return;
        // Change the position x and y of the coin randomly
        this.coin.x = Phaser.Math.Between(100, 1100);
        this.coin.y = Phaser.Math.Between(100, 570);
        // Increment the score by 10
        this.score += 10;
        // Update the score text
        this.scoreText.setText('score: ' + this.score);
        this.tweens.add({
            targets:this.player, //on the player
            duration:200, //for 200ms
            scaleX:1.2 ,//that scale vertically by 20%
            scaleY:1.2 ,//and horizontally by 20%
            yoyo:true, //then go back to the original size

        })
    }
    updateTimer() {
        this.timeleft--;
        this.timerText.setText('Time: ' + this.timeleft);
    
        if (this.timeleft <= 0) {
          this.endGame();
        }
      }
      endGame() {
        this.gameOver = true;
        this.timer.remove();
        this.gameOverText.setVisible(true);
        this.player.setVelocity(0);
        this.player.setTint(0xff0000); // Red tint for effect
      }
      startGame(){
        this.started=true;
        this.startText.setVisible(false);
        this.physics.resume(); // Resume the physics engine
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        })
      }
  }
  new Phaser.Game({
    width: 1100, // Width of the game in pixels
    height: 570, // Height of the game in pixels
    backgroundColor: '#3498db', // The background color (blue)
    scene: mainScene, // The name of the scene we created
    physics: { default: 'arcade' }, // The physics engine to use
    parent: 'game', // Create the game inside the <div id="game"> 
  })