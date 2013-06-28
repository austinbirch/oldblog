//image manager, stores references to images used and pre-loads them before the game begins.

var ImageManager = function(){
	//stores the actual images
	this.imageHashTable = {};
	//stores the src for the image
	this.srcHashTable = {};
	//stores the amount of images registered in the ImageManager 
	this.imageCount = 0;
	//stores the amount of images that have been loaded by the ImageManager
	this.loadCount = 0;
};


//load all the images managed by the ImageManager
ImageManager.prototype.loadImages = function(context, callback) {
	console.log("load images (ImageManager)");
	//to store the images
	var tmpImage = {};
	
	//to store the key
	var key;
		
	//loop through all of the image sources, and build images from them
	for (key in this.srcHashTable){

		//store the image 
		tmpImage[key] = new Image();
		//store the context for image.onload
		oldSelf = this;
		//callback for when the image is done loading
		tmpImage[key].onload = function(){
			console.log("tmpImage[" + this.id + "].onload");
			//add it to the imageHashTable, once it's in memory
			//the id attr of theImage(this) contains the key it belongs to.
			oldSelf.imageHashTable[this.id] = tmpImage[this.id];
			//increase the loadCount ready for testing
			oldSelf.loadCount++;
			
			//if the loadcount = the total image count then callback
			if (oldSelf.loadCount == oldSelf.imageCount){
				if($.isFunction(callback)){
					callback.call(context);
				}
			}
			
		};
		//create an image from the source
		tmpImage[key].src = this.srcHashTable[key];
		tmpImage[key].id = key;
	}
	
};


//add an image to the ImageManager
ImageManager.prototype.addImage = function(key, src) {
	//make sure src string is not null
	if (src != "" && key != ""){
		//store the key with it's src in the srcHashTable
		this.srcHashTable[key] = src;
		this.imageCount++;
	};	
};

//return an image from the hash via its key
ImageManager.prototype.getImage = function(key) {
	//get the object from the hash 
	var returnImage = this.imageHashTable[key];
	//return the image property using the key
	return returnImage;
};

