//depend "uuid"
//depend "chem/sprite"
var SS = window.SS
  , Chem = window.Chem
  , v = Chem.Vec2d
  , createId = SS.createId

SS.Ship = Ship;

var ROTATION_SPEED = Math.PI * 0.03;
var THRUST_AMT = 0.1;
var RECHARGE_AMT = 0.20;

function Ship(o) {
  o = o || {};
  this.vel = o.vel || v();
  this.pos = o.pos || v();
  this.rotation = o.rotation == null ? Math.PI / 2 : o.rotation;
  this.id = createId();
  this.sprite = new Chem.Sprite('ship_still');
  this.thrustInput = 0;
  this.rotateInput = 0;
  this.shootInput = 0;
  this.recharge = 0;
  this.team = o.team == null ? 0 : o.team;
}

Ship.ROTATION_SPEED = ROTATION_SPEED;

Ship.prototype.setThrustInput = function(value) {
  assert(Math.abs(value) <= 1);
  if (this.thrustInput === value) return;
  if (value === 0) {
    this.sprite.setAnimationName('ship_decel');
  } else {
    this.sprite.setAnimationName('ship_accel');
  }
  this.sprite.setFrameIndex(0);
  this.thrustInput = value;
};

Ship.prototype.setRotateInput = function(value) {
  this.rotateInput = value;
  if (this.rotateInput > 1) this.rotateInput = 1;
  if (this.rotateInput < -1) this.rotateInput = -1;
};

Ship.prototype.update = function(dt, dx, state) {
  this.pos.add(this.vel.scaled(dx));
  this.rotation += this.rotateInput * ROTATION_SPEED * dx;
  var thrust = v(Math.cos(this.rotation), Math.sin(this.rotation));
  this.vel.add(thrust.scaled(this.thrustInput * THRUST_AMT * dx));

  this.sprite.rotation = this.rotation + Math.PI / 2;
  this.sprite.pos = this.pos.floored();

  this.recharge -= dt;
  if (this.shootInput && this.recharge <= 0) {
    this.recharge = RECHARGE_AMT;
    // create projectile
    state.createBullet(this.pos.clone(), unitFromAngle(this.rotation), this.team);
  }
};

function unitFromAngle(angle) {
  return v(Math.cos(angle), Math.sin(angle));
}

function assert(value) {
  if (!value) throw new Error("Assertion Failure: " + value);
}
