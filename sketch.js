/** 

HATCH

**/


/* Variables ***********************************************************************************/

var canvas;
var controls;

var canvasWidth = 1000.0;
var canvasHeight = 500.0;

var vertex = []; // objetos "Vertex"
var hatches = []; // objetos "Linehatch" que corresponden a los achurados. Cada achurado usa 4 Vertex
var numX = 16; // cantidad de Vertex en x
var numY = 8; // cantidad de Vertex en y
var margin = 40; // margen global
var currentVertexDragged = -1; // para evitar draggear 2 vértices de una
var hatchWidth = 5; // ancho del achurado del Linehatch

/* Core ****************************************************************************************/


var z;

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  createVertices();
  createHatches();
  textFont("Monaco", 8, 12);
  textAlign(CENTER);
  ellipseMode(CENTER);

}

function createVertices() {
  // se crean puntos en una retícula ordenada
  // para esto se definen los espaciadores de la retícula

  var xSpacer = (canvasWidth - 2 * margin) / (numX - 1);
  var ySpacer = (canvasHeight - 2 * margin) / (numY - 1);

  var index = 0; // contador para recorrer el arreglo de puntos
  for (var y = 0; y < numY; y++) {
    for (var x = 0; x < numX; x++) {
      // las coordenadas del nuevo punto
      var px = margin + xSpacer * x;
      var py = margin + ySpacer * y;
      vertex[index] = new Vertex(px, py, index);
      index++;
    }
  }
}

function drawVertices() {
  var length = numX * numY; // vertex.length;
  for (var i = 0; i < length; i++) {
    vertex[i].display();
  }
}

function createHatches() {
  var index = 0;
  var length = numX * numY; // vertex.length;
  for (var i = 0; i < length - numX - 1; i++) {
    if ((i - (numX - 1)) % numX !== 0) {
      hatches[index] = new Linehatch(vertex[i], vertex[i + 1], vertex[i + numX], vertex[i + numX + 1]);
      index++;
    }
  }
  println(index);
}

function drawHatches() {
  stroke(0, 40);
  var l = hatches.length;
  for (var i = 0; i < l; i++) {
    hatches[i].display();
  }
}

function draw() {
  background(255, 240, 245);
  drawVertices();
  drawHatches();
  // z.display();
}

function hatch(a, b, c, d, num) {
  var incx1 = (b.x - a.x) / (num - 1);
  var incy1 = (b.y - a.y) / (num - 1);
  var incx2 = (d.x - c.x) / (num - 1);
  var incy2 = (d.y - c.y) / (num - 1);
  stroke(100, 0, 0, 20);
  for (var i = 0; i < num; i++) {
    line(a.x + incx1 * i, a.y + incy1 * i,
      c.x + incx2 * i, c.y + incy2 * i);
  }
}

function mouseReleased() {
  for (var i = 0; i < hatches.length; i++) {
    if (hatches[i].over) {
      hatches[i].horizontal = !hatches[i].horizontal;
    }
  }
}

/* Classes ***************************************************************************************/

function Vertex(x, y, index) {
  var over;
  var d;
  this.x = x;
  this.y = y;
  this.index = index;

  this.check = function() {
    d = round(dist(this.x, this.y, mouseX, mouseY));
    if (d < 8 && currentVertexDragged == -1) {
      over = true;
    } else if (mouseIsPressed && over) {
      this.x = mouseX;
      this.y = mouseY;
      currentVertexDragged = this.index;
    } else if (!mouseIsPressed) {
      over = false;
      currentVertexDragged = -1;
    }
  }

  this.display = function() {
    this.check();
    if (over) {
      fill(200, 50, 50, 200);
    } else {
      fill(200, 50, 50, 0);
    }
    noStroke();
    ellipse(this.x, this.y, 4, 4);
    fill(0, 100);
    text(round(d), this.x, this.y - 8);
  }
}

function Linehatch(a, b, c, d) {
  var centro;
  var radio;
  var over;
  var horizontal;

  var n = random(1);
  if (n < .5) {
    horizontal = true;
  } else {
    horizontal = false;
  }

  // el promedio
  var x = (a.x + b.x + c.x + d.x) / 4;
  var y = (a.y + b.y + c.y + d.y) / 4;
  centro = new Vertex(x, y, -100);


  this.display = function() {
    this.calc();
    //strokeWeight(anchoTrazo);
    //stroke(lineas);
    if (over) {
      stroke(0);
    } else {
      stroke(200, 100, 100);
    }
    if (horizontal) {
      hatch(a, b, c, d, 10);
    } else {
      hatch(c, a, d, b, 10);
    }
    // noFill();
    // quad(a.x, a.y, b.x, b.y, d.x, d.y, c.x, c.y);
  }


  this.calc = function() {
    // defino el centro como el promedio de las esquinas
    centro.x = (a.x + b.x + c.x + d.x) / 4;
    centro.y = (a.y + b.y + c.y + d.y) / 4;

    // calculo los mínimos y máximos
    var minX = min(a.x, b.x, c.x, d.x);
    var maxX = max(a.x, b.x, c.x, d.x);
    var minY = min(a.y, b.y, c.y, d.y);
    var maxY = max(a.y, b.y, c.y, d.y);

    // y defino el radio a partir de las medidas
    radio = min((maxX - minX), (maxY - minY)) / 2;

    if (dist(mouseX, mouseY, centro.x, centro.y) < radio) {
      this.over = true;
    } else {
      this.over = false;
    }
  }
}