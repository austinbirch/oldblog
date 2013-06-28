//player object

var LAST_ANIM_LEFT = 1;
var LAST_ANIM_RIGHT = 2;

var RunnerPlayer = function(){
	this.playerImage = null;
	this.walk_right_animation = null;
	this.walk_left_animation = null;
	this.last_animation = null;
	
	//animate left or right?
	this.animate_left = false;
	this.animate_right = false;
	
	//player color - determines which image is loaded. default = black
	this.color = "white";
	//player name
	this.player_name = "player"
	
	//default player position
	this.position = new Vector(50, 50);
	
	//default player velocity
	this.speed = 7;
	//current scale (to scale movement)
	this.scale = new Vector(1, 1);
	//x and y velocities
	this.velocity = new Vector(0,0);
	
	//bounding rectangle for the player
	this.boundingRect = new Rect(0, 0, 0, 0);
	
	//player jump speed
	this.jump_speed = -8;
	
	this.max_lives = 2;
	this.lives = this.max_lives;
	
	//default acceleration
	this.defaultAcceleration = 5;
	//current acceleration
	this.acceleration = 4;
	this.jumping = false;
	this.moving = false;
};

RunnerPlayer.prototype.setPlayerImage = function(imageManager) {
	// switch (this.color) {
	// 	case 'fuchsia':
	// 		this.playerImage = imageManager.getImage("runnerImageFuchsia");
	// 		break;
	// 	case 'green':
	// 		this.playerImage = imageManager.getImage("runnerImageGreen");
	// 		break;
	// 	case 'white':
	// 		this.playerImage = imageManager.getImage("runnerImageWhite");
	// 		break;
	// 	default:
	// 		this.playerImage = imageManager.getImage("runnerImageWhite");
	// 		break;
	// }
	
	//set up the sprite sheet
	this.playerImage = imageManager.getImage("runnerSpriteSheet");
	
	player_sprite_sheet = new SpriteSheet({
		width: 15,
		height: 29,
		sprites: [
			{ name: 'stand', x: 0, y: 0 },
			{ name: 'walk_1', x: 0, y: 0 },
			{ name: 'walk_2', x: 0, y: 0 },
			{ name: 'stand_rev', x: 0, y: 0 },
			{ name: 'walk_1_rev', x: 0, y: 0 },
			{ name: 'walk_2_rev', x: 0, y: 0 }
		]
	});
	
	//set up the animations
	this.walk_right_animation = new Animation([
		{ sprite: 'walk_1' },
		{ sprite: 'stand' },
		{ sprite: 'walk_2' },
		{ sprite: 'stand' },
	], player_sprite_sheet);
	
	this.walk_left_animation = new Animation([
		{ sprite: 'walk_1_rev' },
		{ sprite: 'stand_rev' },
		{ sprite: 'walk_2_rev' },
		{ sprite: 'stand_rev' }
	], player_sprite_sheet);
	
};

RunnerPlayer.prototype.update = function(delta) {
	
};


//draw the player
RunnerPlayer.prototype.draw = function(ctx) {
	
	var frame = null;
	
	if (this.animate_left){
		//get the current frame position
		frame = this.walk_left_animation.getSprite();
		this.last_animation = LAST_ANIM_LEFT;
	}else if(this.animate_right){
		this.last_animation = LAST_ANIM_RIGHT;
		frame = this.walk_right_animation.getSprite();
	}else if(this.animate_right == false && this.animate_left == false){
		// no animation - just grab a standing frame
		if (this.last_animation == LAST_ANIM_RIGHT){
					frame = this.walk_right_animation.sprite_sheet.getFrame('stand');
		}else{
					frame = this.walk_left_animation.sprite_sheet.getFrame('stand_rev');
		}
	}
	//draw the players current frame	
	ctx.drawImage(this.playerImage, frame.x, frame.y, 15, 29, this.position.x, this.position.y, 15, 29);
	//draw the player text
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "12px Courier";
	ctx.fillText(this.player_name, (this.position.x - 10), (this.position.y - 5));

	//draw the player lives 
	ctx.fillText("lives left: " + this.lives, (ctx.canvas.width - 100), 20);
};

//set the position of the player
RunnerPlayer.prototype.setPosition = function(x, y) {
	this.position.setVector(x, y);
};

RunnerPlayer.prototype.setVelocity = function(x, y) {
	this.velocity.setVector(x, y);
};

//return the player's width
RunnerPlayer.prototype.getWidth = function() {
	//TODO FIX THIS!
	return 15;
};
//return the player's height
RunnerPlayer.prototype.getHeight = function() {
	//TODO FIX THIS!
	return 29;
};

RunnerPlayer.prototype.getBoundingRect = function() {
	width = 0, height = 0;
	
	width = this.getWidth();
	height = this.getHeight();
	
	//80% of actual rect
	col_width = width * 0.80;
	col_height = height * 0.80;
	
	col_x_offset = (width - col_width) / 2;
	col_y_offset = (height - col_height) / 2;
		
	this.boundingRect.setRect(this.position.x + col_x_offset, this.position.y + col_y_offset, col_width, col_height);
	
	return this.boundingRect;
};


//set the player's color
RunnerPlayer.prototype.setColor = function(color) {
	this.color = color;
};


