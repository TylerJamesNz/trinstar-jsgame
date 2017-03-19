
/* 
** This state contains all the functionality for level 1.
*/

var Level2State = (function (_super){ 

	__extends(Level2State, _super);
	
	function Level2State() // Constructor.
	{
		_super.call(this, 'Level2State');
	}

	Level2State.prototype.create = function (stars) // Init stuff.
	{
		_super.prototype.create.call(this);

		this.levelObjectArray = [];
		this.levelArray = 	[
								[0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0],
								[0,	0,	0,	1, 	0, 'e',	0,	0,	0,	0,	1,	0,	0,	0,	0,	0, 	0],
								[0,	0,	0,	1,	1,	1,	1,	1,	0,	0,	1,	0,	0,	0,	0,	0,	0],
								[0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	0,	0,	0],
								[0,	0,	0,	1,	0,	0,	0,	6,	0,	1,	1,	0,	0,	0, 'h',	0,	0],
								[0,	0,	0,	1, 	0,	0,	1,	1,	0,	1,	1,	0,	0,	0,	0,	0,	0],
								[0,	0,	0,	1, 	0,	0,	0,	0,	1,	1,	1,	5,	5,	1,	1,	1, 	0],
								[0,	0,	0,	1,	1,	5,	5,	5,	5,	5,	5,	5,	5,	1,	0,	0, 	0],
								[0,	0,	0,	1,	1,	1,	5,	5,	5,	5,	5,	5,	5,	1,	0,	0, 	0],
								[0,	0,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0,	0, 	0]
							];

		this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
		this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
		this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
		this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);

		this.game.stage._color = 'black';
		this.stars = stars;
		this.dynamicLevelObjects = [];
		this.gravity = 2;
		this.friction = 0.94;
		this.terminalVelocity = 50;
		
		/* Methods
		==================================*/

		this.populateSky = function(stars) // Fills the sky with stars.
		{
			for(var i=0; i<this.stars.length; i++)
			{
				this.addChild(this.stars[i]);
				this.stars[i].xVelocityIncrease = 0;
			}
		}

		this.updateSky = function() // Iterates through the stars moving them at the correct velocity.
		{
			for(var i=0; i<stars.length; i++) 
			{
				var star = stars[i];
				star.transform.x -= star.xVelocity;
				if(star.transform.x < star.width* -1) // Reset the stars that pass the edge of the stage.
				{
					star.transform.x = this.game.stage.width + star.width;
					star.transform.y = Math.random() * this.game.stage.height;
				}
			}
		}

		/* Init Functions
		==================================*/

		this.populateSky(this.stars);
		CustomFunctions.populateLevel(this);
	}

	Level2State.prototype.update = function() // The game loop.
	{
		this.updateSky();
		this.hero.physics.update();
		CustomFunctions.updateHero(this, this.hero);
		CustomFunctions.heroLevelCollisions(this, this.hero);
		CustomFunctions.updateDynamicLevelObjects(this);
	}
	return Level2State;
})(Kiwi.State);