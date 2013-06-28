//controller for game

//keypress faux-constants
var SPACE = 32;
var ARROW = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
var A = 65;
var D = 68;
var S = 83;
var R = 82;
var C = 67;

//game status faux-constants
var GAME_RUNNING = 1;
var GAME_PAUSED = 2;
var GAME_OVER = 3;
var GAME_RUNNER_WON = 4;

//block colors
var color_hash = { red: "rgba(255, 0, 0, 0.3)",
 										green: "rgba(0, 255, 0, 0.3)",
										blue: "rgba(0, 0, 255, 0.3)",
										fuchsia: "rgba(255, 0, 255, 0.3)",
										white: "rgba(255, 255, 255, 0.3)" };

//constructor - init objects 
var Game = function(){
	
	//game timer 
	this.game_timer;
				
	//keypress vars
	this.left_key_down = false
	this.right_key_down = false;
	this.space_key_down = false;
	
	this.a_key_down = false;
	this.d_key_down = false;
	this.s_key_down = false;
	
	
	//the simple AI
	this.ai_on = false;
	
	//game_vars
	this.status = GAME_RUNNING;
	
	//global gravity
	this.gravity = 0.5;
	
	this.previous_tick = 0;
	this.current_tick = 0;
	this.frames_per_second = 60;
	this.current_fps = 0;
	this.frames = 0;
	this.accumulator = 0;
	
	//global block width
	this.block_width = 32;
	
	//alert message to show over the main screen
	this.alert_message = "";
	this.alert_opacity = 0.7;
	
	//call the preloadImages routine - it will start the game via a callback
	this.imageManager = new ImageManager();

	//pre load the images	
	//player colors
	this.imageManager.addImage("runnerImageWhite", "./images/runnerWhite.png");
	this.imageManager.addImage("runnerImageFuchsia", "./images/runnerFuchsia.png");
	this.imageManager.addImage("runnerImageGreen", "./images/runnerGreen.png");
	
	//player sprite sheet
	this.imageManager.addImage("runnerSpriteSheet", "./images/runnerPlayer.png");
	
	//background
	this.imageManager.addImage("bg", "./images/bg.png");
	//blocks
	this.imageManager.addImage("blockImage", "./images/block-alt.png");
	//floor
	this.imageManager.addImage("floorImage", "./images/floor_two.png");
	//load the images, pass the context
	this.imageManager.loadImages(this, this.initObjects);
};

Game.prototype.initObjects = function() {	
	//store this context
	var oldthis = this;
	
	//the background 
	this.background = new Background();
	this.background.setBackgroundImage(this.imageManager);
	
	//the floor
	this.floor = null;
	this.floor = new Floor();
	this.floor.setFloorImage(this.imageManager);
	
	//the target height
	this.target_height = null;
	
	//make a runner player
	this.player = new RunnerPlayer();
	//set the player color
	this.player.setColor('white');
	//set the image using the imageManager
	this.player.setPlayerImage(oldthis.imageManager);
	
	//make a block player
	this.playerBlock = new BlockPlayer();
	//set the player color
	this.playerBlock.setColor(color_hash.fuchsia);
	//set the players width
	this.playerBlock.width = this.block_width;
	
	if (this.ai_on){
		//make an AI player
		this.AI = new AI();
		//set the AI block width - hacky
		this.AI.block.width = this.block_width;
		//give it a handle on the block array
		this.AI.target_block_array = this.block_array;
	}
	
	//block objects array
	this.block_array = new Array();
	for (var x = 2; x > 0; x--){
		var block = new Block();
		block.setBlockImage(this.imageManager);
		block.setPosition(x * block.getWidth(), block.getHeight() * x);
		block.moving = true;
		this.block_array[x] = block;
	}
	
	this.block_array[1].setColor(color_hash.red);
	this.block_array[2].setColor(color_hash.blue);
						
	//actually start the game 
	this.initGame();
};


Game.prototype.initGame = function(){
	
	console.log("initGame");
	
	//set things up for game here
	this.canvas = $("canvas");
	this.context = this.canvas.get(0).getContext("2d");
	
	this.canvas.attr("width", 800);
	this.canvas.attr("height", 500);
	
	
	//set up the floor
	this.floor.setWidth(canvas.width);
	//set the position of the floor
	this.floor.setPosition(0, (canvas.height - this.floor.getTileWidth()));
	
	//set up the target height
	this.target_height = (canvas.height / 100) * 22;
	
	//get the ground position
	this.ground = this.floor.position.y;
		
	//put the player in the starting position
	this.player.setPosition(100, (this.floor.position.y - this.player.getHeight()));
		
	//show the canvas	
	this.canvas.fadeIn(1000);

	//start the main loop
	this.timeout();
};

//restart the game, ready for again-ness
Game.prototype.restart_game = function() {
	//clear timer
	clearTimeout(this.game_timer);
	//reset stuff
	this.previous_tick = 0;
	this.current_tick = 0;
	this.frames_per_second = 60;
	this.current_fps = 0;
	this.frames = 0;
	this.accumulator = 0;
	
	//keypress vars
	this.left_key_down = false
	this.right_key_down = false;
	this.space_key_down = false;
	
	this.a_key_down = false;
	this.d_key_down = false;
	this.s_key_down = false;
	
	//start the game
	this.status = GAME_RUNNING;
	this.alert_message = "";
	this.initObjects();
};


//main loop - lets try a variable speed one ;-)
Game.prototype.timeout = function(){
	//store the previous tick
	this.previous_tick = this.current_tick;
			
	//get the new tick
	this.current_tick = (new Date).getTime();
	
	//skip the first timer
	if (this.previous_tick == 0){
		// this.update();
		// this.draw();
	}else{
		//update with the delta (delta = time between frames)
		var delta = (this.current_tick - this.previous_tick);
		
		//store the delta, test for fps
		this.accumulator = this.accumulator + delta;
		if (this.accumulator >= 1000){
			//greater than a second update current frame display
			this.current_fps = this.frames;
			this.frames = 1;
			this.accumulator = 0;
		}else{
			//not greater than a second, count another frame
			this.frames++;
		}		
		
		//update the scene
		this.update(delta/1000);
		//draw the scene
		this.draw();		
	}
	
	//call myself
		
	 var self = this;
	// 	var fps = 60;
	this.game_timer = setTimeout(function() { self.timeout() }, 1000/this.frames_per_second);
};

//update the positions etc
Game.prototype.update = function(delta){
		
	if(this.status == GAME_RUNNING){
	
		var originalPlayerPos = new Vector(this.player.position.x, this.player.position.y);	
				
		//if space was pressed - JUMP!
		if(this.player.jumping == false && this.space_key_down == true){
			//start making the player jump
			this.player.jumping = true;
			this.player.setVelocity(this.player.velocity.x, this.player.jump_speed);		
		}
				
		//if player is jumping -- update the velocity 
		if(this.player.jumping == true){
				//move player by y velocity
				//decrement y by gravity
				if (this.player.position.y + this.player.velocity.y < (this.ground - this.player.getHeight())){
					//move the player
					this.player.position.y = this.player.position.y + this.player.velocity.y;
					this.player.setVelocity(this.player.velocity.x, this.player.velocity.y + this.gravity);				
				} else {
					//we hit the floor
					this.player.jumping = false;
					//set to be on the floor 
					this.player.setPosition(this.player.position.x, this.ground - this.player.getHeight());
				}
		} else {
			//we're not jumping so maybe check for a fall
			for (var i = this.block_array.length - 1; i > 0; i--){
				var block = new Block();
				var collision = false;
				block = this.block_array[i];
				//collsion dection with extended bounds
				var newBounds = new Rect();
				newBounds = this.player.getBoundingRect();
				newBounds.height += 16;
				if (this.collisionDetect(newBounds, block.getBoundingRect())){
					//there is a collsion, don't fall
					collision = true;
					break;
				}			
			};
		
			if (collision == false){
				//no collsion, we should move
				this.player.jumping = true;
			}
		
		}
	
		//vertical collision detection - actual
		for (var i = this.block_array.length - 1; i > 0; i--){
			var block = new Block();
			block = this.block_array[i];
			//collision detection
			if (this.collisionDetect(this.player.getBoundingRect(), block.getBoundingRect())){
				//there is a collision
				this.player.position.y = block.position.y - this.player.getHeight();
				//stop the player falling
				this.player.velocity.y = this.gravity;
				this.player.jumping = false;
				//don't check anymore collisions
				break;
			}					
		};
		

		if(this.player.moving == false && this.right_key_down == true){
			//start moving the player to the right
			this.player.moving = true;
			this.player.setVelocity(+this.player.speed, this.player.velocity.y);
		} else if (this.player.moving == false && this.left_key_down == true){
			//start moving the player to the left
			this.player.moving = true;
			this.player.setVelocity(-this.player.speed, this.player.velocity.y);
		} else {
			this.player.moving = false;
		}
		
		//animation
		if(this.player.moving == true && this.right_key_down == true){
			//animate right
			this.player.animate_right = true;
			this.player.animate_left = false;
			//actually animate
			this.player.walk_right_animation.animate(delta);
		}else if(this.player.moving == true && this.left_key_down == true){
			//animate left
			this.player.animate_left = true;
			this.player.animate_right = false;
			//actually animate
			this.player.walk_left_animation.animate(delta);
		}
		
		if(this.left_key_down == false && this.right_key_down == false){
			//stop the animation
			this.player.animate_left = false;
			this.player.animate_right = false;
		}
			
		//if the player is moving, then move
		if (this.player.moving == true){
			var newPositionX = this.player.position.x + this.player.velocity.x;
			if (newPositionX > 0 && newPositionX < (canvas.width - this.player.getWidth())){
					//if within bounds of the canvas
					this.player.position.x = newPositionX;
					//test for collision				
					for (var i = (this.block_array.length - 1); i > 0; i--){
						var block = new Block();
						block = this.block_array[i];
					
						if (this.collisionDetect(this.player.getBoundingRect(), block.getBoundingRect()) == true){
							//there is a collision
							if (this.player.velocity.x > 0){
								//player is moving right
								this.player.position.x = block.position.x - this.player.getWidth();	
							}else if (this.player.velocity.x < 0){
								//the player is moving left
								this.player.position.x = block.position.x + block.getWidth();
							}
						}
					};
			}
		}
	
		//update the bock player
		if (this.a_key_down == true){
			//move left
			if (this.playerBlock.position.x > 0){
				//bounds detection okay, can move
				this.playerBlock.updatePosition(delta, this.playerBlock.position.x - this.block_width);
			}
		} else if (this.d_key_down == true){
			//move right
			if (this.playerBlock.position.x < canvas.width - this.block_width){
				this.playerBlock.updatePosition(delta, this.playerBlock.position.x + this.block_width);
			}
		}
	
		if (this.s_key_down == true){
			//fire a block
			this.playerBlock.fireBlock(delta, this.block_array, this.imageManager);
		}
	
		//update the background
		// newPlayerPos = new Vector(this.player.position.x, this.player.position.y);
		// 	deltaPos = new Vector(originalPlayerPos.x - newPlayerPos.x, originalPlayerPos.y - newPlayerPos.y);
		// 	this.background.updatePosition(deltaPos);
		
		//update blocks
		for (var x = (this.block_array.length - 1); x > 0; x--){
			var block = new Block();
			block = this.block_array[x];
				
			//block vs block collision detection
			if (block.moving == true){
				if (block.position.y < (this.ground - block.getHeight())){
					block.setVelocity(0, block.velocity.y + this.gravity)
					block.position.y = block.position.y + block.velocity.y;
				
					//collision detection against other blocks
					for (var y = (this.block_array.length - 1); y > 0; y--){
						var blockB = new Block();
						blockB = this.block_array[y];
						//make sure we are not testing against ourselves
						if (block != blockB){
							//test for collision
							if (this.collisionDetect(block.getBoundingRect(), blockB.getBoundingRect()) == true){
								//if a collision exsits
								//stop me
								block.moving = false;
								block.velocity.y = 0;
								block.position.y = blockB.position.y - block.getHeight();
							}
						}
					}
				
					//collision detection against the player
					if (this.collisionDetect(block.getBoundingRect(), this.player.getBoundingRect())){
						//this is a hit
						
						//check for player death					
						if (this.player.lives <= 0){
							//player is dead!
							this.alert_message = "YOU'RE DEAD!";
							this.status = GAME_OVER;
							if (this.alert_opacity != 0.7){
								//there is already a alert in progress, force a new one
								this.alert_opacity = 0.7;
							}
						}else{
							// alert('BOOM, HEADSHOT!');
							this.alert_message = "BOOM, HEADSHOT!";
							//remove a life from the player
							this.player.lives--;
							if (this.alert_opacity != 0.7){
								//there is already a alert in progress, force a new one
								this.alert_opacity = 0.7;
							}
						}
					}
				
				}else{
					//hit the floor
					block.position.y = this.ground - block.getHeight();
					block.moving = false;
					block.velocity.y = 0;
				}
			}
		} // end of for loop
	
		//update the ai, if it's turned on
		if(this.ai_on){
			this.AI.update(delta, this.player.position.x);
		
			if (this.AI.firing){
				//fire a block
				this.AI.fire(delta, this.block_array, this.imageManager);
			}
		}
		
		//has the player won?
		if ((this.player.position.y + this.player.getHeight()) < this.target_height && this.player.lives >= 0){
			this.status = GAME_RUNNER_WON;
			if (this.alert_opacity != 0.7){
				//alert in progress, force a new one
				this.alert_opacity = 0.7;
			}
		}
	
	
		//alter the alert message opacity, if there is one
		if (this.alert_message != ""){
			this.alert_opacity -= 0.008;
			if (this.alert_opacity < 0.02) { 
				//reset message & opacity
				this.alert_message = "";
				this.alert_opacity = 0.7;
			}
		}	
	} // end of if
	
	switch (this.status){
			case GAME_RUNNER_WON:
				//display a giant restart message
				this.alert_message = "WIN! R TO RESTART"
				this.alert_opacity = 0.7;
				break;
			case GAME_OVER:
				//display a giant restart message
				this.alert_message = "DEAD! R TO RESTART";
				this.alert_opacity = 0.7;
				break;
		}
		
};

//actually draw
Game.prototype.draw = function(){
	//clear the screen
	// this.context.fillStyle = "rgb(255, 255, 255)";
	// this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.canvas.width = this.canvas.width;
	
	//draw the background
	this.background.draw(this.context);
				
	//draw the block array
	for (var x = (this.block_array.length - 1); x > 0; x--){
		var block = new Block();
		block = this.block_array[x];
		block.draw(this.context);
	}
	
	//draw the player
	this.player.draw(this.context);
	
	//draw the block player
	this.playerBlock.draw(this.context);
	
	//draw the AI
	if(this.ai_on){
		this.AI.draw(this.context);
	}
	
	//display the current fps
	this.context.fillStyle = "rgb(255, 255, 255)";
	this.context.font = "12px Courier";
	this.context.fillText("fps: " + this.current_fps, 10, 20);
	
	//display the ai status
	if(this.ai_on){
		this.context.fillText("ai: on", (this.canvas.width() - 100), 35);
	}else{
		this.context.fillText("ai: off", (this.canvas.width() - 100), 35);
	}
	
	//draw the target line
	this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
	this.context.fillRect(0, this.target_height, this.canvas.width(), 1);
	//draw the target label
	this.context.font = "14px Courier";
	this.context.fillText("target line", 10, this.target_height);
	
	//draw the floor last - hides some of the overshooting of blocks
	this.floor.draw(this.context);
		
	//draw the alert message over everything else
	if (this.alert_message != ""){
		this.context.font = "64px Courier";		
		this.context.fillStyle = "rgba(255, 255, 255," + this.alert_opacity +  ")";
		this.context.textAlign = "center";
		this.context.fillText(this.alert_message, this.canvas.width() / 2, this.canvas.height() / 2);
		//reset the text align for the context
		this.context.textAlign = "left";		
	}
			
};

Game.prototype.collisionDetect = function(rectA, rectB) {
	// detect for a collision between two objects - each object should report it's bounding box as a 'Rect'
	//rectA = objA.getBoundingRect();
	//rectB = objB.getBoundingRect();
	
	leftA = rectA.x;
	rightA = rectA.x + rectA.width;
	topA = rectA.y;
	bottomA = rectA.y + rectA.height;
	
	leftB = rectB.x;
	rightB = rectB.x + rectB.width;
	topB = rectB.y;
	bottomB = rectB.y + rectB.height;
	
	// if (leftA > leftB && leftA < rightB){
	// 		//potential collision (in-line vertically)
	// 		if (topA > topB && topA < bottomB){
	// 			//collision
	// 			return true;
	// 			console.log("collision");
	// 		}
	// 	}
	
	if (bottomA < topB){
		return false;
	}
	
	if (topA > bottomB){
		return false;
	}
	
	if (rightA < leftB){
		return false;
	}
	
	if (leftA > rightB){
		return false;
	}
	
	//collision! - return true
	return true;
	
};

//keydown event
Game.prototype.keyDown = function(e) {
	var keyCode = e.keyCode;
	
	//grab the right context
	var self = e.data.self;
	
	//which key was pressed?
	switch (keyCode) {
		case ARROW.LEFT:
			self.left_key_down = true;
			break;
		case ARROW.RIGHT:
			self.right_key_down = true;
			break;
		case ARROW.DOWN:
			break;
		case ARROW.UP:
			break;
		case SPACE:
			self.space_key_down = true;
			break;
					
		case A:
			self.a_key_down = true;
			break;
		case D:
			self.d_key_down = true;
			break;
		case S:
			self.s_key_down = true;
			break;
	};
	
	//stop the browser from processing all of the events we will deal with
	//not particularly good practice, I'll change this later
	switch (keyCode){
		case ARROW.LEFT:
		case ARROW.RIGHT:
		case ARROW.UP:
		case ARROW.DOWN:
		case SPACE:
			return false;
	};
	
};

//keyup event
Game.prototype.keyUp = function(e) {
	var keyCode = e.keyCode;
	
	//grab the right context
	var self = e.data.self;
	
	//which key was pressed?
	switch (keyCode) {
		case ARROW.LEFT:
			self.left_key_down = false;
			break;
		case ARROW.RIGHT:
			self.right_key_down = false;
			break;
		case ARROW.DOWN:
			break;
		case ARROW.UP:
			break;
		case SPACE:
			self.space_key_down = false;
			break;	
			
		case A:
			self.a_key_down = false;
			break;
		case D:
			self.d_key_down = false;
			break;
		case S:
			self.s_key_down = false;
			break;
		case R:
			console.log('R');
			self.restart_game();
			break;
		case C:
			if(self.ai_on == true){
				self.ai_on = false;
			}else{
				self.ai_on = true;
			}
			self.restart_game();
	};
};

