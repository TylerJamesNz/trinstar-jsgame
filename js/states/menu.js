
/* 
** Menu State contains all the functionality for the game menu.
*/

var MenuState = (function (_super){ 

	__extends(MenuState, _super);
	
	function MenuState()
	{
		_super.call(this, 'MenuState');
	}

	MenuState.prototype.create = function() // Initialize menu objects.
	{
		_super.prototype.create.call(this);

		this.background = new Kiwi.GameObjects.StaticImage(this.textures['titleScreen'], 0, 0);	
		this.addChild(this.background);

		this.newGameButton = new Kiwi.GameObjects.Sprite(this.textures['newGameButton'], 285, 290);
		this.newGameButton.animation.add('inactive', [0], 0.1, false);
		this.newGameButton.animation.add('active', [1], 0.1, false);
		this.newGameButton.stateLink = 'Level1State';
		this.addChild(this.newGameButton);
		this.loadLevelButton = new Kiwi.GameObjects.Sprite(this.textures['loadLevelButton'], 285, 345);
		this.loadLevelButton.animation.add('inactive', [0], 0.1, false);
		this.loadLevelButton.animation.add('active', [1], 0.1, false);
		this.loadLevelButton.stateLink = '';
		this.addChild(this.loadLevelButton);
		this.settingsButton = new Kiwi.GameObjects.Sprite(this.textures['settingsButton'], 285, 400);
		this.settingsButton.animation.add('inactive', [0], 0.1, false);
		this.settingsButton.animation.add('active', [1], 0.1, false);
		this.settingsButton.stateLink = '';
		this.addChild(this.settingsButton);
		this.buttonArray = [this.newGameButton, this.loadLevelButton, this.settingsButton];

		this.mouse = this.game.input.mouse;
		
		this.numParticles = 150;
		this.particleArray = [];
		for(var i=0; i<this.numParticles; i++) // Place stars randomly around the menu screen.
		{
			var starXPos = Math.random() * this.game.stage._width;
			var starYPos = Math.random() * this.game.stage._height;
			var star = new Kiwi.GameObjects.StaticImage(this.textures['titleStar'], starXPos, starYPos);
			
			star.xVelocity = 0.1 + (Math.random() * 0.5);
			star._alpha = star.xVelocity * 1.5;
			this.particleArray.push(star);
			this.addChild(star);
		}

		/* Methods
		==================================*/

		this.particleUpdate = function() // Updates star positions.
		{
			for(var i=0; i<this.numParticles; i++) 
			{
				var star = this.particleArray[i];
				star.transform.x -= star.xVelocity;
				if(star.transform.x < star.width* -1)
				{
					star.transform.x = this.game.stage.width + star.width;
					star.transform.y = Math.random() * this.game.stage.height;
				}
			}
		}

		this.updateButton = function(button) // Set the hovered button to active.
		{
			buttonHovered = (this.mouse.x > button.transform._x && 
							this.mouse.x < button.transform._x + button.width &&
							this.mouse.y > button.transform._y &&
							this.mouse.y < button.transform._y + button.height);
			
			if(buttonHovered) // The mouse is hovering over the button
			{
				button.currentlyActive = true;
				button.animation.switchTo('active');
			} 
			else 
			{
				button.currentlyActive = false;
				button.animation.switchTo('inactive');
			}
		}

		this.menuUpdate = function() // Checks if menu functionality has been activated.
		{
			for(var i=0; i<this.buttonArray.length; i++) // Run functionality checks on each button.
			{
				var button = this.buttonArray[i];
				this.updateButton(button);
				
				if(this.mouse.isDown && button.currentlyActive && button.stateLink != '') // If the button is pressed.
				{
					this.game.states.switchState(button.stateLink,null,null, {'menuParticles': this.particleArray});
				}
			}
		}
	}

	MenuState.prototype.update = function()
	{
		this.particleUpdate();
		this.menuUpdate();
	}
	return MenuState;
})(Kiwi.State);