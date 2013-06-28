//simple ai - placeholding for real boys.

//constructor
var AI = function(){
	//how quickly our AI can move, how often it drops blocks 
	//lower is more difficult
	this.difficulty = 0.5;
		
	//the block that represents the AI
	this.block = new BlockPlayer();
	this.block.player_name = "AI";
	
	this.deltaAccumulator = 0;
	
	this.fire_rate = 1;
	
	this.fire_accumulator = 0;
		
};

AI.prototype.update = function(delta, playerPosX) {
	
	//update the accumulator
	this.deltaAccumulator = this.deltaAccumulator + delta;
	
	//we want to move toward the player, if the difficulty allows it
	if (playerPosX > (this.block.position.x + this.block.width)){
		//the player is to the right
		if (this.deltaAccumulator > this.difficulty){
			//we can move!
			this.block.position.x = this.block.position.x + this.block.width;
			//reset the accumulator
			this.deltaAccumulator = 0;
			this.firing = false;	
		}
	}else if (playerPosX < this.block.position.x){
		//the player is to the left
		if (this.deltaAccumulator > this.difficulty){
			//we can move!
			this.block.position.x = this.block.position.x - this.block.width;
			//reset the accumulator
			this.deltaAccumulator = 0;
			this.firing = false;
		}
	}else{
		//the player is directly underneath - don't move
		//reset the accumulator
		this.deltaAccumulator = 0;
		this.firing = true;		
	}
	
};

AI.prototype.fire = function(delta, blockArray, imageManager) {
	//replace this function
	// this.block.fireBlock(delta, blockArray, imageManager);	
	
	this.fire_accumulator += delta;
		
	if (this.fire_accumulator > this.fire_rate){
		var firedBlock = new Block();
		firedBlock.color = this.block.color;
		firedBlock.position = new Vector(this.block.position.x, this.block.position.y);
		firedBlock.moving = true;
		//set the block image
		firedBlock.setBlockImage(imageManager);
		blockArray.push(firedBlock);
		this.fire_accumulator = 0;
	}
	
};


AI.prototype.draw = function(context) {
	this.block.draw(context);
};

