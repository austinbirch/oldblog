//holds the details of sprites in a sprite sheet

var SpriteSheet = function(data){
	
	this.sprites = [];
	this.sprite_width = 15;
	this.sprite_height = 29;
	
	this.load(data);	
}

SpriteSheet.prototype.load = function(data) {	
	
	this.sprites = data.sprites;
	this.sprite_width = data.width;
	this.sprite_height = data.height;
	
}

SpriteSheet.prototype.getFrame = function(spriteName) {
	//loop through all sprites, and find the one with the correct name
	
	for (var i = this.sprites.length - 1; i >= 0; i--){
		var sprite = this.sprites[i];
		
		//check the name
		if (sprite.name == spriteName) {
			//return the frame's position in the sprite sheet
			//and return it's dimensions
			
			//todo add offset support
			
			var ret = {
				x: (i * this.sprite_width),
				y: (0),
				width: this.sprite_width,
				height: this.sprite_height,
			};
						
			return ret;
			
		}		
	}
	
	return null;
	
}

