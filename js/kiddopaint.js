// Kiddo Paint Applications
var KiddoPaint = {};
KiddoPaint.Tools = {};
KiddoPaint.Textures = {};
KiddoPaint.Brushes = {};
KiddoPaint.Display = {};
KiddoPaint.Colors = {};
KiddoPaint.Current = {};

function init_kiddo_paint() {
  var canvas = document.getElementById('kiddopaint');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    // sets proper offset due to css canvas positioning and kiddopaint buttons
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    KiddoPaint.Display.canvas = canvas;
    KiddoPaint.Display.context = ctx;
    KiddoPaint.Display.step = 0;

    init_kiddo_defaults();
    init_listeners(canvas);
    init_color_selector();
  }
}

function init_kiddo_defaults() {
  KiddoPaint.Current.color = KiddoPaint.Colors.All.colorblack;
  KiddoPaint.Current.tool = KiddoPaint.Tools.PixelPencil;
}

function init_listeners(canvas) {
  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);
}

function colorSelect(e) {
  var color = e.srcElement.className;
  KiddoPaint.Current.color = KiddoPaint.Colors.All[color];
}

function init_color_selector() {
  var buttons = document.getElementById('colorselector').children;
  for(var i = 0, len = buttons.length; i < len; i++) {
    var button = buttons[i];
    button.addEventListener("click", colorSelect);
  }
}

function ev_canvas (ev) {
  // pre event 
  KiddoPaint.Display.step += 1;

  if (ev.layerX || ev.layerX == 0) {
    ev._x = ev.layerX;
    ev._y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  // handle event
  var func = KiddoPaint.Current.tool[ev.type];
  if (func) {
    func(ev);
  }

  // post event
}
