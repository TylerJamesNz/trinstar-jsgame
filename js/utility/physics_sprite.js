
/*
** Physics Sprite Class.
*/

var PhysicsSprite = (function (_super){ 

	__extends(PhysicsSprite, _super);
	
	function PhysicsSprite(texture, xPos, yPos) // Constructor.
	{
		_super.call(this, texture, xPos, yPos);

		this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this));
	}

	return PhysicsSprite;
})(Kiwi.GameObjects.Sprite);