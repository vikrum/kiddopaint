// Kiddo Paint Applications
var KiddoPaint = {};
KiddoPaint.Tools = {};
KiddoPaint.Textures = {};
KiddoPaint.Brushes = {};
KiddoPaint.Builders = {};
KiddoPaint.Display = {};
KiddoPaint.Colors = {};
KiddoPaint.Current = {};

function init_kiddo_paint() {
  var canvas = document.getElementById('kiddopaint');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    // sets proper offset due to css canvas positioning and kiddopaint buttons
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var container = canvas.parentNode;
    tmpCanvas = document.createElement('canvas');
    tmpCanvas.id     = 'tmpCanvas';
    tmpCanvas.width  = canvas.width;
    tmpCanvas.height = canvas.height;
    container.appendChild(tmpCanvas);
    tmpContext = tmpCanvas.getContext('2d');
    tmpContext.clearRect(0, 0, canvas.width, canvas.height);

    KiddoPaint.Display.canvas = tmpCanvas;
    KiddoPaint.Display.context = tmpContext;

    KiddoPaint.Display.main_canvas = canvas;
    KiddoPaint.Display.main_context = ctx;

    init_kiddo_defaults();
    init_listeners(tmpCanvas);
    init_tool_bar();
    init_subtool_bars();
    init_color_selector();
  }
}

function init_kiddo_defaults() {
  KiddoPaint.Current.color = KiddoPaint.Colors.All.colorblack;
  KiddoPaint.Current.tool = KiddoPaint.Tools.PixelPencil;
  KiddoPaint.Current.scaling = 1;
  KiddoPaint.Display.step = 0;
}

function init_listeners(canvas) {
  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);

  document.onkeydown = function checkKey(e) { if(e.keyCode == 16) { KiddoPaint.Current.scaling = 2; KiddoPaint.Current.modified = true; }; }
  document.onkeyup = function checkKey(e) { if(e.keyCode == 16) { KiddoPaint.Current.scaling = 1; KiddoPaint.Current.modified = false; }; }
}

function colorSelect(e) {
  var color = e.srcElement.className.split(' ')[1];
  KiddoPaint.Current.color = KiddoPaint.Colors.All[color];
  document.getElementById('currentColor').className = 'currentColor ' + color;
}

function init_color_selector() {
  var buttons = document.getElementById('colorselector').children;
  for(var i = 0, len = buttons.length; i < len; i++) {
    var button = buttons[i];
    button.addEventListener('mousedown', colorSelect);
  }
}

function show_sub_toolbar(subtoolbar) {
  var subtoolbars = document.getElementById('subtoolbars').children;
  for(var i = 0, len = subtoolbars.length; i < len; i++) {
    var div = subtoolbars[i];
    if(div.id === subtoolbar) {
      div.className = 'subtoolbar'
    }
    else {
      div.className = 'hidden'
    }
  }

}

function init_tool_bar() {
  document.getElementById('pencil').addEventListener('mousedown', function() {
    show_sub_toolbar('penciltoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.PixelPencil;
  });

  document.getElementById('brush').addEventListener('mousedown', function() {
    show_sub_toolbar('brushtoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
  });

  document.getElementById('builder').addEventListener('mousedown', function() {
    show_sub_toolbar('buildertoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Builder;
  });

  document.getElementById('erase').addEventListener('mousedown', function() {
    KiddoPaint.Display.context.clearRect(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);
    KiddoPaint.Display.main_context.clearRect(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);
  });
};

function init_subtool_bars() {
  init_pencil_subtoolbar();
  init_builder_subtoolbar();
}

function init_pencil_subtoolbar() {
  document.getElementById('pw1').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 1; });
  document.getElementById('pw2').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 5; });
  document.getElementById('pw3').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 7; });
  document.getElementById('pw4').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 25; });
  document.getElementById('pw5').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 100; });

  document.getElementById('pt1').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('pt2').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('pt3').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('pt4').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('pt5').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Smiley(KiddoPaint.Current.color); } });
  document.getElementById('pt6').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.PartialSquares(KiddoPaint.Current.color); } });
  document.getElementById('pt7').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.RSolid(); } });
  document.getElementById('pt8').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.RSmiley(); } });
}

function init_builder_subtoolbar() {
  document.getElementById('bl1').addEventListener('mousedown', function() { KiddoPaint.Tools.Builder.texture = function(angle) { return KiddoPaint.Current.modified ? KiddoPaint.Brushes.Arrow(KiddoPaint.Colors.randomColor(), angle) : KiddoPaint.Brushes.Arrow(KiddoPaint.Current.color, angle); }; });
  document.getElementById('bl2').addEventListener('mousedown', function() { KiddoPaint.Tools.Builder.texture = function(angle) { return KiddoPaint.Builders.Road(KiddoPaint.Current.color, angle); }; });
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
