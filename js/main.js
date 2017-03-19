
/* Game Initialization
==================================================*/

var myGame = new Kiwi.Game();

myGame.states.addState(new LoadingState());
myGame.states.addState(new MenuState());
myGame.states.addState(new Level1State());
myGame.states.addState(new Level2State());
myGame.states.addState(new Level3State());
myGame.states.switchState('LoadingState');