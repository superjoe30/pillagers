var chem = require('chem');
var State = require('./state');
var team = require('./team');
var FlagShip = require('./flag_ship');
var TitleScreen = require('./title_screen');
var LevelCompleteScreen = require('./level_complete_screen');
var CreditsScreen = require('./credits_screen');
var GameOverScreen = require('./game_over_screen');

var playerTeam = team.get(0);
var enemyTeam = team.get(1);

module.exports = Campaign;

function Campaign(game) {
  this.game = game;
  this.engine = game.engine;
}

Campaign.prototype.toggleMusic = function() {
  this.game.toggleMusic();
};

Campaign.prototype.showGameOverScreen = function() {
  var gameOverScreen = new GameOverScreen(this);
  gameOverScreen.start();
};

Campaign.prototype.showTitleScreen = function() {
  var title = new TitleScreen(this.game);
  title.start();
};

Campaign.prototype.showCredits = function() {
  var credits = new CreditsScreen(this.game);
  credits.start();
};

Campaign.prototype.start = function() {
  this.levelIndex = 0;
  this.cash = 0;
  this.unlockedShips = {};

  // start campaign with only a flagship
  var flagship = new FlagShip(null, {
    team: playerTeam,
  });
  this.playLevel([flagship]);
};

Campaign.prototype.playLevel = function(convoy) {
  var state = new State(this);
  var levelText = chem.resources.text["level" + this.levelIndex + ".json"];
  if (levelText == null) {
    // user beat all the levels
    this.showCredits();
    return;
  }
  var level;
  try {
    level = JSON.parse(levelText);
  } catch (err) {
    throw new Error("Error parsing level. Invalid JSON: " + err.stack);
  }

  state.load(level, convoy);
  state.start();
};

Campaign.prototype.showLevelComplete = function(o) {
  var levelCompleteScreen = new LevelCompleteScreen(this, o);
  levelCompleteScreen.start();
};
