$(function() {
	//initialize variables
	//game object
	var game;
	
	function init(){
				
		//create a new game object
		game = new Game;
		//bind key events to be assigned by Game object
		initListeners();
	}
	
	function initListeners(){
		//bind key press events
		$(window).bind("keydown", { self: game }, game.keyDown);
		$(window).bind("keyup", { self: game }, game.keyUp);
		$(window).bind("keypress", { self: game}, game.keyPress);
	}
	
	// $("#changes").load("recent_changes.txt");
		
	//initialize the game
	init();
	
});