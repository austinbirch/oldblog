//background class - displays a moveable background

var Background = function(){
	//create a space for the image
	this.backgroundImage = null;
	this.position = new Vector(0, 0);
	
	this.canvas_width = 800;
	this.canvas_height = 500;
	
	this.tile_width = 0;
	this.tile_height = 0;
	
	this.map_tiled_width = 0;
	this.map_tiled_height = 0;
	
	this.offset_x = 0;
	this.offset_y = 0;
	
	this.scrolledPos = new Vector(0, 0);
}

//set the background image
Background.prototype.setBackgroundImage = function(imageManager) {
	this.backgroundImage = imageManager.getImage("bg");
	
	//set the tile width & height
	this.tile_width = this.backgroundImage.width;
	this.tile_height = this.backgroundImage.height;
	//set the map width & height (add two so that we can put a one tile border around the whole bg)
	this.map_tiled_width = Math.ceil((this.canvas_width / this.backgroundImage.width));
	console.log(this.map_tiled_width);
	this.map_tiled_height = Math.ceil((this.canvas_height / this.backgroundImage.height));
	console.log(this.map_tiled_height);
};

//draw the background image
Background.prototype.draw = function(ctx) {

	//vertical
	for (var y = this.map_tiled_height; y >= 0; y--){
		//horizontal
		for (var x = this.map_tiled_width; x >= 0; x--){
			var x_pos = x * this.tile_width;
			var y_pos = y * this.tile_height;
			ctx.drawImage(this.backgroundImage, x_pos, y_pos);
		}
	}
		
};

//update position
Background.prototype.updatePosition = function(deltaVector) {
	//update the scroll position
	this.scrolledPos = new Vector(this.scrolledPos.x + deltaVector.x, this.scrolledPos.y + deltaVector.y);
	
	//calculate offset
	this.offset_x = this.scrolledPos.x;
	this.offset_y = this.scrolledPos.y;
	
	//if the offset is greater or equal to tile size (+ or -), reset the position to zero
	if (Math.abs(this.offset_x) >= this.tile_width){
		//reset the scrollposition
		this.scrolledPos.x = this.position.x;
	}
	
	//if the offset is greater or equal to tile size (+ or -), reset the position to zero
	if (Math.abs(this.offset_y) >= this.tile_height){
		//reset the scrollposition
		this.scrolledPos.y = this.position.y;
	}
	
};

