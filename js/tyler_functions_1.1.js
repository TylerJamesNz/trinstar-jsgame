
/*
** Class for all of the game functions.
**
** - populateLevel(state) - Fills a level with tiles based on the tile array in the level.
** - getCollisionInfo(object1, object2) - Checks wether two kiwi objects are overlapping and returns collision values.
** - heroLevelCollisions(state) - Apply the heros collisions with the level.
** - updateDynamicLevelObjects(state) - Updates all the dynamic level objects in a state.
** - updateHero(state) - Deals with the input and forces affecting the hero and which animations play.
*/

var CustomFunctions = { // Contains all the custom reusable functions for the game.
	
	populateLevel: function(state) // Fills the level with tiles.
	{
		for (var i = 0; i < state.levelArray.length; i++) 
		{
			var tileY = i * state.textures['levelTile1'].height;
			
			for (var j = 0; j < state.levelArray[i].length; j++) 
			{
				var tileX = j * state.textures['levelTile1'].width;

				switch(state.levelArray[i][j])
				{
					case 0:
						var levelTile0 = new Kiwi.GameObjects.StaticImage(state.textures['levelTile0'],tileX,tileY);
						levelTile0.tileType = 'empty';
						state.levelObjectArray.push(levelTile0);
						break;
					
					case 1:
						var levelTile1 = new PhysicsSprite(state.textures['levelTile1'], tileX, tileY);
						levelTile1.tileType = 'solid';
						levelTile1.physics.immovable = true;
						state.addChild(levelTile1);
						state.levelObjectArray.push(levelTile1);
						break;

					case 5:
						var levelTile5 = new Kiwi.GameObjects.StaticImage(state.textures['levelTile5'], tileX, tileY);
						levelTile5.tileType = 'liquid';
						state.addChild(levelTile5);
						state.levelObjectArray.push(levelTile5);
						break;

					case 6:
						var levelTile6 = new PhysicsSprite(state.textures['crate'], tileX, tileY);
						levelTile6.tileType = 'crate';
						levelTile6.physics.immovable = false;
						levelTile6.physics.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
						levelTile6.physics.velocity.x = 0;
						levelTile6.physics.velocity.y = 0;
						state.addChild(levelTile6);
						state.dynamicLevelObjects.push(levelTile6);
						break;

					case 7:
						var levelTile7 = new PhysicsSprite(state.textures['levelTile7'], tileX, tileY);
						levelTile7.tileType = 'jumper';
						levelTile7.physics.immovable = true;
						levelTile7.physics.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
						state.addChild(levelTile7);
						state.levelObjectArray.push(levelTile7);
						break;
					
					case 'h':
						state.hero = new PhysicsSprite(state.textures['hero'], tileX, tileY);
						state.hero.physics.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
						state.hero.accelerationRate = 10;
						state.hero.maxVelocity = 35; // Physics max velocity in simulation doesnt work.
						state.hero.jumpVelocity = 63;
						state.hero.physics.drag.x = 20;
						state.hero.currentlyJumping = true;
						state.hero.facing = 'right';
						state.hero.animation.add('idleright', [0], 0.1, false);
						state.hero.animation.add('jumpright', [1], 0.1, false);
						state.hero.animation.add('jumpleft', [13], 0.1, false);
						state.hero.animation.add('idleleft', [14], 0.1, false);
						state.hero.animation.add('moveright', [1, 2, 3, 4], 0.1, true);
						state.hero.animation.add('moveleft', [13, 12, 11, 10], 0.1, true);
						state.hero.animation.switchTo('idleright', true);
						state.addChild(state.hero);
						break;

					case 'e':
						var levelEnd = new Kiwi.GameObjects.Sprite(state.textures['levelEnd'], tileX, tileY);
						levelEnd.tileType = 'stateChanger';
						levelEnd.stateLink = 'NextLevel';
						state.addChild(levelEnd);
						state.levelObjectArray.push(levelEnd);
						break;
				}
			}
		}
	},

	heroLevelCollisions: function(state, hero) // Apply the heros collisions with the level.
	{
		hero.collidingWithSolid = false; // Assume the hero has not collided with a solid object yet.

		for (var i = 0; i < state.levelObjectArray.length; i++) // Iterate through the static level tiles.
		{
			var levelObject = state.levelObjectArray[i];

			switch(levelObject.tileType)
			{

				case 'solid':
					var beforeCollisionY = state.hero.transform.y;
					
					hero.physics.overlaps(levelObject, true);

					if(state.hero.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
					{
						hero.currentlyJumping = false;
						hero.physics.acceleration.y = 0;
					}
					break;

				case 'liquid':
					var liquidTerminalVelocity = 20;

					if(hero.physics.overlaps(levelObject, false)) // If the hero is colliding with water.
					{
						hero.physics.velocity.x *= 0.98;

						if(hero.physics.velocity.y > liquidTerminalVelocity) // If the hero falls faster than terminal velocity in water.
						{
							hero.physics.velocity.y = liquidTerminalVelocity;
						}
						if(hero.physics.velocity.y < liquidTerminalVelocity * -3)// Else if her is jumping faster than terminal velocity
						{
							hero.physics.velocity.y = liquidTerminalVelocity * -3;
						}
					}
					break;

				case 'jumper':
					var beforeCollisionY = state.hero.transform.y;
					
					hero.physics.overlaps(levelObject, true);

					if(state.hero.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
					{
						hero.currentlyJumping = true;
						hero.physics.acceleration.y = 0;
						hero.physics.velocity.y = hero.jumpVelocity * -1.4;
					}
					break;

				case 'empty':
					state.gravity = 2;
					break;

				case 'stateChanger':
					state.hero.physics.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
					
					if(hero.physics.overlaps(levelObject, false)) // If the hero overlaps the level end.
					{
						if(levelObject.stateLink == 'NextLevel') // If the state changer block specifys to switch to the next level.
						{
							var currentLevelNum = state.name.split('Level');
							currentLevelNum = currentLevelNum[1].split('State');
							currentLevelNum = currentLevelNum[0];
							var nextLevelNum = Number(currentLevelNum) + 1;
							var nextLevelName = 'Level' + nextLevelNum + 'State';
							state.game.states.switchState(nextLevelName,null,null, {'menuParticles': state.stars});
						}
					}
					break;
			}
		}

		for(var i = 0; i < state.dynamicLevelObjects.length; i++) // Iterate through the dynamic level tiles.
		{
			var dynamicObject = state.dynamicLevelObjects[i];

			switch(dynamicObject.tileType)
			{
				case 'crate':
					var beforeCollisionY = state.hero.transform.y;

					hero.physics.overlaps(dynamicObject, true);

					if(state.hero.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
					{
						hero.currentlyJumping = false;
						hero.physics.acceleration.y = 0;
					}
					break;
			}
		}
	},

	updateHero: function(state, hero) // Deals with the input and forces affecting the hero and which animations play.
	{
		if(!state.leftKey.isDown && !state.rightKey.isDown) // If left and right are not pressed.
		{
			hero.physics.acceleration.x = 0;

			if(!hero.currentlyJumping) // If the hero is not currently in jumpig state.
			{
				hero.animation.switchTo('idle' + hero.facing);
			}
		}
		
		if(state.leftKey.isDown) // Left key is pressed.
		{
			hero.physics.acceleration.x = hero.accelerationRate * -1;
			hero.facing = 'left';
			
			if(hero.animation.currentAnimation.name != 'move' + hero.facing && !hero.currentlyJumping)
			{ 
				hero.animation.switchTo('moveleft', true);	
			}

			if(Math.abs(hero.physics.velocity.x) > hero.maxVelocity) // Set the velocity back to max if it goes too high.
			{
				hero.physics.velocity.x = hero.maxVelocity * -1;
			}
		}

		if(state.rightKey.isDown) // Right key is pressed.
		{ 
			hero.physics.acceleration.x = hero.accelerationRate;
			hero.facing = 'right';

			if(hero.animation.currentAnimation.name != 'move' + hero.facing && !hero.currentlyJumping)
			{ 
				hero.animation.switchTo('moveright', true);
			} 

			if(Math.abs(hero.physics.velocity.x) > hero.maxVelocity) // Set the acceleration back to max if it goes too high set it back to max.
			{
				hero.physics.velocity.x = hero.maxVelocity;
			}
		}
	
		if(state.upKey.isDown && !hero.currentlyJumping) // If the arrow key is pressed and the hero is not currently jumping.
		{
			hero.physics.velocity.y = hero.jumpVelocity*-1;
			hero.currentlyJumping = true;
			hero.animation.switchTo('jump' + hero.facing);
		}

		hero.physics.acceleration.y += state.gravity;
		
		if(hero.physics.velocity.y > state.terminalVelocity) // If the hero exceeds the states terminal velocity.
		{
			hero.physics.velocity.y = state.terminalVelocity;
		}

		hero.animation.update();
	},

	updateDynamicLevelObjects: function(state) // This function deals with level collisions and updates to optimize code.
	{

		for(var i=0; i<state.dynamicLevelObjects.length; i++)
		{
			var dynamicObject = state.dynamicLevelObjects[i];
			
			dynamicObject.physics.acceleration.y += state.gravity;
			dynamicObject.physics.velocity.x *= state.friction;

			for(var j=0; j<state.levelObjectArray.length; j++) // Test for collisions against static level objects.
			{
				var staticObject = state.levelObjectArray[j];

				switch(dynamicObject.tileType) // Apply collisions and updates to the different types of object.
				{
					case 'crate':
						if(staticObject.tileType == 'solid') // If the crate collides with a solid object.
						{
							var beforeCollisionY = dynamicObject.transform.y;
							dynamicObject.physics.overlaps(staticObject, true);

							if(dynamicObject.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
							{
								dynamicObject.physics.acceleration.y = 0;
							}
						}

						if(staticObject.tileType == 'jumper') // If the crate collides with a solid object.
						{
							var beforeCollisionY = dynamicObject.transform.y;
							dynamicObject.physics.overlaps(staticObject, true);

							if(dynamicObject.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
							{
								dynamicObject.physics.acceleration.y = 0;
							}
						}
						break;
				}
			}

			for(var j=0; j<state.dynamicLevelObjects.length; j++) // Test for collisions against other dynamic level objects.
			{
				var dynamicObject2 = state.dynamicLevelObjects[j];

				switch(dynamicObject.tileType)
				{
					case 'crate':
						if(dynamicObject2.tileType == 'crate') // If the crate collides with another crate.
						{
							var beforeCollisionY = dynamicObject.transform.y;

							dynamicObject.physics.overlaps(dynamicObject2, true);

							if(dynamicObject.transform.y < beforeCollisionY) // If the hero has moved up after a collision marking the top of an object.
							{
								dynamicObject.physics.acceleration.y = 0;
								dynamicObject2.physics.acceleration.y = 0;
							}
						}
						break;
				}
			}

			dynamicObject.physics.update();
		}
	}
}

