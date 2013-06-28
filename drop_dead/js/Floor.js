//floor

var Floor = function(){
	//create a space for its image
	this.floorImage = null;
	this.position = new Vector(0,0);
	this.width = 0;
}

//set image using the ImageManager
Floor.prototype.setFloorImage = function(imageManager) {
	this.floorImage = imageManager.getImage("floorImage");
};

Floor.prototype.createFloor = function() {
	//make the floor out of many tiles
	
};

//draw the floor
Floor.prototype.draw = function(ctx) {
	for (var x = 0; x < this.width; x = x + 32){
		ctx.drawImage(this.floorImage, x, this.position.y);
	}
};

//set the width of the floor
Floor.prototype.setWidth = function(width) {
	this.width = width;
};

//get the width of the floor image
Floor.prototype.getTileWidth = function() {
	return this.floorImage.width;
};


//set position of the floor
Floor.prototype.setPosition = function(x, y) {
	this.position = new Vector(x, y);
};

