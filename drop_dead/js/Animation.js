//animation class – deals with all frame animations

//constructor
var Animation = function (data, sprite_sheet){
	this.frameDuration = 0.1;
	this.displayDuration = this.frameDuration;
	this.currentFrame = 0;
	this.frames = data;
	this.sprite_sheet = sprite_sheet;
		
}

Animation.prototype.animate = function(deltaTime) {
	//reduce the display duration by delta
	this.displayDuration -= deltaTime;
	
	//if it's time to switch frame
	if (this.displayDuration <= 0){
		//change to the next frame in the sequence
		this.currentFrame++;
		//if we are at the end, reset frame index
		if (this.currentFrame == this.frames.length){
			this.currentFrame = 0;
		}
		
		//reset the frame duration
		this.displayDuration = this.frameDuration;	
	}
}

//get the sprite for the current frame
Animation.prototype.getSprite = function() {
	return this.sprite_sheet.getFrame(this.frames[this.currentFrame].sprite);
};


