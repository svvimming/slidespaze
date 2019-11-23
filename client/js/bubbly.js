let growth;
let splash;
let glooper;
let globz = [];
var globNum = 10;

class Glob {
 constructor(canvas, rad, xrot, yrot, xpos, ypos, xrate, yrate, red, grn, blu) {
   this.canvas = canvas;
   this.rad = rad;
   this.xrot = xrot;
   this.yrot = yrot;
   this.xpos = xpos;
   this.ypos = ypos;
   this.xrate = xrate;
   this.yrate = yrate;
   this.red = red;
   this.grn = grn;
   this.blu = blu;
 }
  gloop(){
    fill(this.red, this.grn, this.blu);
    sphere(this.rad, 24, 24);
  }
   move() {
     var xdummy = this.xpos - 600;//((millis()*this.xrate) % this.canvas) - this.xpos - 600;
     var ydummy = ((-1)*(millis()*this.yrate) % this.canvas) - this.ypos +700;
     translate(xdummy, ydummy);
   }
   rot_ate(){
     rotateX((millis()/1000)*(PI / (this.xrot)) + radians(180));
     rotateY((millis()/1000)*(PI / (this.yrot)));
   }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for(let i = 0; i < globNum; i++) {
    globz[i] = new Glob(
      windowWidth,
      random(50, 100),
      random(6,40),
      random(6,40),
      random(0, 1200),
      random(0, 700),
      random(0.1, 0.3),
      random(0.1, 0.2),
      random(170, 250),
      random(170, 250),
      random(170, 250)
    );
    globz[i+globNum] = new Glob(
      windowWidth,
      random(10, 25),
      random(6,40),
      random(6,40),
      random(0, 1000),
      random(0, 500),
      random(0.1, 0.3),
      random(0.1, 0.2),
      random(170, 250),
      random(170, 250),
      random(170, 250)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //drag to move the world.
  orbitControl();

  for(let k = 0; k < globNum*2; k++) {
    push();
    globz[k].move();
    globz[k].rot_ate();
    globz[k].gloop();
    pop();
  }
}
