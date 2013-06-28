//block object

var Block = function(){
	//create a space for its image
	this.blockImage = null;
	this.position = new Vector(100, 100);
	this.velocity = new Vector(0, -0.1);
	this.speed = 10;
	this.color = "rgba(255, 0, 0, 0.3)";
	this.moving = false;
	
	this.boundingRect = new Rect(0, 0, 0, 0);
};

//set the block image using the imagemanager
Block.prototype.setBlockImage = function(imageManager) {
	this.blockImage = imageManager.getImage("blockImage");
};


//update the block
Block.prototype.update = function(canvas) {
	
};

//draw the block
Block.prototype.draw = function(ctx) {
	ctx.drawImage(this.blockImage, this.position.x, this.position.y);
	
	ctx.lineWidth = 2;
	
	//draw the color overlay
	ctx.fillStyle = this.color;
	ctx.strokeStyle = "rgb(0, 0, 0)";
	ctx.fillRect(this.position.x, this.position.y, this.getWidth(), this.getHeight());
	ctx.strokeRect(this.position.x, this.position.y, this.getWidth(), this.getHeight());
		
	// //draw the velocity text
	// ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
	// ctx.font = "10px Monaco, Courier";
	// ctx.fillText(this.velocity.y, (this.position.x + 5), (this.position.y + 10));
};

//get the bounding rect
Block.prototype.getBoundingRect = function() {
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

//set the position of the block
Block.prototype.setPosition = function(x, y) {
	this.position.setVector(x, y);
};

//set the velocity of the block
Block.prototype.setVelocity = function(x, y) {
	this.velocity.setVector(x, y);
};

//return the block's width
Block.prototype.getWidth = function() {
	return this.blockImage.width;
};
//return the block's height
Block.prototype.getHeight = function() {
	return this.blockImage.height;
};

//set the color of the block
Block.prototype.setColor = function(color) {
	 this.color = color;
};



