//rect object - used for storing bounding box

//constructor
var Rect = function (x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
}

Rect.prototype.setRect = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
