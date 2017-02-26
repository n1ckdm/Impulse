// Class for the ship object
'use strict'

var globals = require('./globals.js');
var Vector2 = require('./vector2.js');
var Sprite = require('./sprite.js');
var Bullet = require('./bullet.js');

var ship = class Ship {
  constructor(x, y) {
    this.size = new Vector2(25,50);
    this.position = new Vector2(x,y);
    this.velocity = new Vector2(0,0);
    this.direction = 0; //Angle we're facing in radians
    this.color = '#00A';
    this.thrust = false;
    this.rotate_left = false;
    this.rotate_right = false;
    this.tractor = false;
    this.mass = 300;
    this.bullets= [];
    this.firepower = 100;

    var image = new Image();
    image.src = './images/spaceship.png';
    this.sprite = new Sprite({
      "img_size": new Vector2(560,560),
      "image": image,
      "frame_width": 280
    });
  }

  fire() {
    var bullet_vel = new Vector2(
      Math.sin(this.direction)*this.firepower+this.velocity.x,
      Math.cos(this.direction)*this.firepower+this.velocity.y
    );
    var bullet_pos = new Vector2(
      this.position.x,
      this.position.y
    );
    this.bullets.push(new Bullet(bullet_pos, bullet_vel));
  }

  isAlive() {
    if(this.position.x+this.size.x/2<0) {return false;}
    if(this.position.x-this.size.x/2>globals.canvas_width) {return false;}
    if(this.position.y-this.size.y/2>globals.canvas_heiht) {return false;}
    if(this.position.y+this.size.y/2<0) {return false;}
    return true;
  }

  frame() {
    if (this.thrust==true) {
      return 1;
    } else {
      return 0;
    }
  }

  draw(canvas) {
    this.sprite.render(canvas,this);
    this.bullets.forEach(bullet => {
      bullet.draw(canvas);
    });
  }

  getAcceleration() {
    var Fx = 0;
    var Fy = 0;
    if (this.thrust===true) {
      Fx = Math.sin(this.direction) * globals.thrust*this.mass;
      Fy = Math.cos(this.direction) * globals.thrust*this.mass -this.mass*globals.g;
    } else {
      Fy = -this.mass*globals.g
    }
    return new Vector2(Fx/this.mass,Fy/this.mass);
  }

  rotate() {
    if (this.rotate_left) {
      this.direction -= 0.1;
    } else if (this.rotate_right) {
      this.direction += 0.1;
    }
  }

  update(dt) {
    this.rotate();
    var a = this.getAcceleration();
    this.velocity.y += a.y*dt;
    this.velocity.x += a.x*dt;
    this.position.y -= this.velocity.y*dt;
    this.position.x += this.velocity.x*dt;
    this.bullets = this.bullets.filter(item => {
      return item.life > 0;
    });
    this.bullets.forEach(bullet => {
      bullet.update(dt);
    });
  }

}

return module.exports = ship;
