// Kiddo Paint Applications
var KiddoPaint = {};
KiddoPaint.Tools = {};
KiddoPaint.Textures = {};
KiddoPaint.Brushes = {};
KiddoPaint.Builders = {};
KiddoPaint.Stamps = {};
KiddoPaint.Sounds = {};
KiddoPaint.Display = {};
KiddoPaint.Colors = {};
KiddoPaint.Current = {};
KiddoPaint.Cache = {};

function init_kiddo_paint() {
  var canvas = document.getElementById('kiddopaint');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    // sets proper offset due to css canvas positioning and kiddopaint buttons
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var container = canvas.parentNode;

    previewCanvas = document.createElement('canvas');
    previewCanvas.id     = 'previewCanvas';
    previewCanvas.width  = canvas.width;
    previewCanvas.height = canvas.height;
    container.appendChild(previewCanvas);
    previewContext = previewCanvas.getContext('2d');
    previewContext.clearRect(0, 0, canvas.width, canvas.height);

    tmpCanvas = document.createElement('canvas');
    tmpCanvas.id     = 'tmpCanvas';
    tmpCanvas.width  = canvas.width;
    tmpCanvas.height = canvas.height;
    container.appendChild(tmpCanvas);
    tmpContext = tmpCanvas.getContext('2d');
    tmpContext.clearRect(0, 0, canvas.width, canvas.height);

    KiddoPaint.Display.canvas = tmpCanvas;
    KiddoPaint.Display.context = tmpContext;

    KiddoPaint.Display.previewCanvas = previewCanvas;
    KiddoPaint.Display.previewContext = previewContext;

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
  KiddoPaint.Current.modified = false;
  KiddoPaint.Current.modifiedAlt = false;
  KiddoPaint.Current.modifiedCtrl = false;
  reset_ranges();
}

function reset_ranges() {
  KiddoPaint.Current.modifiedRange = 0;
  KiddoPaint.Current.modifiedAltRange = 0;
  KiddoPaint.Current.modifiedCtrlRange = 0;
}

function init_listeners(canvas) {
  canvas.addEventListener('mousedown', ev_canvas);
  canvas.addEventListener('mousemove', ev_canvas);
  canvas.addEventListener('mouseup', ev_canvas);
  canvas.addEventListener('mouseleave', function() { KiddoPaint.Display.clearPreview(); });
  canvas.addEventListener("mousewheel", mouse_wheel);

  document.onkeydown = function checkKey(e) {
    if(e.keyCode == 16) {
      KiddoPaint.Current.scaling = 2;
      KiddoPaint.Current.modified = true;
     }
     else if(e.keyCode == 91) {
      KiddoPaint.Current.modifiedCtrl = true;
     }
     else if(e.keyCode == 18) {
      KiddoPaint.Current.modifiedAlt = true;
     }
     else if(e.keyCode == 83) {
      save_to_file();
     }
  }
  document.onkeyup = function checkKey(e) {
    if(e.keyCode == 16) {
      KiddoPaint.Current.scaling = 1;
      KiddoPaint.Current.modified = false;
    }
    else if(e.keyCode == 91) {
      KiddoPaint.Current.modifiedCtrl = false;
    }
    else if(e.keyCode == 18) {
      KiddoPaint.Current.modifiedAlt = false;
    };
  }
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
  reset_ranges();
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

  document.getElementById('line').addEventListener('mousedown', function() {
    show_sub_toolbar('linetoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Line;
  });

  document.getElementById('brush').addEventListener('mousedown', function() {
    show_sub_toolbar('brushtoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
  });

  document.getElementById('stamp1').addEventListener('mousedown', function() {
    init_stamp_bar('stamp1');
    show_sub_toolbar('stamptoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
  });

  document.getElementById('stamp2').addEventListener('mousedown', function() {
    init_stamp_bar('stamp2');
    show_sub_toolbar('stamptoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
  });

  document.getElementById('stamp3').addEventListener('mousedown', function() {
    init_stamp_bar('stamp3');
    show_sub_toolbar('stamptoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
  });

  document.getElementById('stamp4').addEventListener('mousedown', function() {
    init_stamp_bar('stamp4');
    show_sub_toolbar('stamptoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
  });

  document.getElementById('undo').addEventListener('mousedown', function() {
    KiddoPaint.Sounds.oops();
    KiddoPaint.Display.undo();
  });

  document.getElementById('erase').addEventListener('mousedown', function() {
    KiddoPaint.Sounds.explosion();
    KiddoPaint.Display.clearAll();
  });
};

function init_stamp_bar(stampgroup) {
  var stamptoolbar = KiddoPaint.Stamps.grouping[stampgroup].stamps;
  KiddoPaint.Tools.Stamp.stamp = stamptoolbar[0];
  for(var i = 0; i < stamptoolbar.length; i++) {
    var buttonValue = '<h1>' + stamptoolbar[i] + '</h1>';
    document.getElementById('xst' + i).innerHTML = buttonValue;
  }
}

function init_subtool_bars() {
  init_pencil_subtoolbar();
  init_line_subtoolbar();
  init_brush_subtoolbar();
  init_stamp_subtoolbar();
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

function init_line_subtoolbar() {
  document.getElementById('lw1').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 1; });
  document.getElementById('lw2').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 5; });
  document.getElementById('lw3').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 7; });
  document.getElementById('lw4').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 25; });
  document.getElementById('lw5').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 100; });

  document.getElementById('lt1').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('lt2').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('lt3').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('lt4').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('lt7').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = false; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.RSolid(); } });
}

function init_brush_subtoolbar() {
  document.getElementById('br1').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Current.modified ? KiddoPaint.Builders.Arrow(KiddoPaint.Colors.randomColor(), angle) : KiddoPaint.Builders.Arrow(KiddoPaint.Current.color, angle); }; });
  document.getElementById('br2').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Road(KiddoPaint.Current.color, angle); }; });
  document.getElementById('br3').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function() { return KiddoPaint.Current.modified ? KiddoPaint.Brushes.RCircles() : KiddoPaint.Brushes.Circles(KiddoPaint.Current.color); } });
  document.getElementById('br4').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '👣',  angle); }; });
  document.getElementById('br5').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '🐾', angle); }; });
  document.getElementById('br6').addEventListener('mousedown', function() { KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Rail(KiddoPaint.Colors.randomColor(), angle) }; });
}

function init_stamp_subtoolbar() {
  // document.getElementsByName("xx") ; name="xx"
  var stampselect = document.querySelectorAll('*[id^="xst"]');
  for(var i = 0; i < stampselect.length; i++) {
    var stampButton = stampselect[i];
    stampButton.addEventListener('mousedown', function(ev) { reset_ranges(); KiddoPaint.Tools.Stamp.stamp = ev.srcElement.firstChild.nodeValue; });
  }
}


function ev_canvas(ev) {
  // pre event 
  KiddoPaint.Display.step += 1;
  KiddoPaint.Display.clearPreview();
  KiddoPaint.Current.ev = ev;

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
}

function mouse_wheel(ev) {
  var delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)));
  if(KiddoPaint.Current.modified) {
    KiddoPaint.Current.modifiedRange += delta;
    if(KiddoPaint.Current.modifiedRange > 100) {
      KiddoPaint.Current.modifiedRange = -100;
    }
    else if (KiddoPaint.Current.modifiedRange < -100) {
      KiddoPaint.Current.modifiedRange = 100;
    }
  }
  else if(KiddoPaint.Current.modifiedAlt) {
    KiddoPaint.Current.modifiedAltRange += delta;
    if(KiddoPaint.Current.modifiedAltRange > 100) {
      KiddoPaint.Current.modifiedAltRange = -100;
    }
    else if (KiddoPaint.Current.modifiedAltRange < -100) {
      KiddoPaint.Current.modifiedAltRange = 100;
    }
  }
  else if(KiddoPaint.Current.modifiedCtrl) {
    KiddoPaint.Current.modifiedCtrlRange += delta;
    if(KiddoPaint.Current.modifiedCtrlRange > 100) {
      KiddoPaint.Current.modifiedCtrlRange = -100;
    }
    else if (KiddoPaint.Current.modifiedCtrlRange < -100) {
      KiddoPaint.Current.modifiedCtrlRange = 100;
    }
  }
  // kick off a redraw of preview
  if(KiddoPaint.Current.ev) { ev_canvas(KiddoPaint.Current.ev); }
  if(ev.preventDefault) { ev.preventDefault(); }
  ev.returnValue = false;  
  return false;
}

function save_to_file() {
  var image = KiddoPaint.Display.main_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href=image; 
}
