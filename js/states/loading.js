
/* 
** Loading State preloads the game assets.
*/

var LoadingState = (function (_super){ 

	__extends(LoadingState, _super);
	
	function LoadingState() // Constructor.
	{
		_super.call(this, 'LoadingState');
	}

	LoadingState.prototype.preload = function() // Preload the assets for the game.
	{
		this.addImage('titleStar', './assets/menu/star.png');
		this.addImage('levelEnd', './assets/level/level_end.png');
		this.addImage('levelTile0', './assets/level/level_tile_0.png');
		this.addImage('levelTile1', './assets/level/level_tile_1.png');
		this.addImage('levelTile5', './assets/level/level_tile_5.png');
		this.addImage('levelTile7', './assets/level/level_tile_7.png');
		this.addImage('crate', './assets/level/level_tile_crate.png');
		this.addImage('titleScreen', './assets/menu/title_screen.png');
		this.addSpriteSheet('newGameButton', './assets/menu/new_game_button.png', 289, 44);
		this.addSpriteSheet('settingsButton', './assets/menu/settings_button.png', 289, 44);
		this.addSpriteSheet('loadLevelButton', './assets/menu/load_level_button.png', 289, 44);
		this.addSpriteSheet('hero', './assets/characters/naughty_stolen_sprites_for_beta.png', 50, 50);
	}

	LoadingState.prototype.create = function () // Initialization that runs after object creation.
	{
		_super.prototype.create.call(this);
		this.game.states.switchState('MenuState');
		this.game.stage.width = 850;
		this.game.stage.height = 500;
	}
	return LoadingState;
})(Kiwi.State);