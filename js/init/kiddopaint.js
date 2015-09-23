// Kiddo Paint Applications
var KiddoPaint = {};
KiddoPaint.Tools = {};
KiddoPaint.Tools.Toolbox = {};
KiddoPaint.Textures = {};
KiddoPaint.Brushes = {};
KiddoPaint.Builders = {};
KiddoPaint.Stamps = {};
KiddoPaint.Sounds = {};
KiddoPaint.Display = {};
KiddoPaint.Colors = {};
KiddoPaint.Current = {};
KiddoPaint.Cache = {};
KiddoPaint.Alphabet = {};

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

    KiddoPaint.Display.loadFromLocalStorage();

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
  KiddoPaint.Current.modifiedToggle = false;
  KiddoPaint.Alphabet.page = 1;
  KiddoPaint.Stamps.page = 1;
  KiddoPaint.Stamps.currentFace = KiddoPaint.Stamps.grouping.face;
  KiddoPaint.Current.multiplier = 1;
  reset_ranges();
}

function reset_ranges() {
  KiddoPaint.Current.modifiedRange = 0;
  KiddoPaint.Current.modifiedAltRange = 0;
  KiddoPaint.Current.modifiedCtrlRange = 0;
  KiddoPaint.Current.modifiedToggle = false;
}

function init_listeners(canvas) {
  canvas.addEventListener('mousedown', ev_canvas);
  canvas.addEventListener('mousemove', ev_canvas);
  canvas.addEventListener('mouseup', ev_canvas);
  canvas.addEventListener('mouseleave', function() { KiddoPaint.Display.clearPreview(); });
  canvas.addEventListener("mousewheel", mouse_wheel);
  canvas.addEventListener("dragover", function(ev) { if(ev.preventDefault) { ev.preventDefault(); }; ev.returnValue = false;  return false; }, false);
  canvas.addEventListener("drop", image_upload);

  document.onkeydown = function checkKey(e) {
  console.log(e.keyCode);
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
     else if(e.keyCode > 48 && e.keyCode < 58) {
      KiddoPaint.Current.multiplier = e.keyCode - 48;
     }
     else if(e.keyCode == 32) {
       KiddoPaint.Current.modifiedToggle = ! KiddoPaint.Current.modifiedToggle;
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
  var src = e.srcElement || e.target;
  var color = src.className.split(' ')[1];
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

  document.getElementById('square').addEventListener('mousedown', function() {
    show_sub_toolbar('squaretoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Square;
  });

  document.getElementById('circle').addEventListener('mousedown', function() {
    show_sub_toolbar('circletoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Circle;
  });

  document.getElementById('brush').addEventListener('mousedown', function() {
    show_sub_toolbar('brushtoolbar');
    KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
  });

  document.getElementById('stamp').addEventListener('mousedown', function() {
    init_stamp_bar('stamp' + KiddoPaint.Stamps.page);
    show_sub_toolbar('stamptoolbar');
    KiddoPaint.Tools.Stamp.useColor = false;
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
    KiddoPaint.Stamps.currentFace = KiddoPaint.Stamps.grouping.face;
  });

  document.getElementById('alphabet').addEventListener('mousedown', function() {
    init_alphabet_bar('character' + KiddoPaint.Alphabet.page);
    show_sub_toolbar('alphabettoolbar');
    KiddoPaint.Tools.Stamp.useColor = true;
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
    KiddoPaint.Stamps.currentFace = KiddoPaint.Alphabet.english.face;
  });

  document.getElementById('undo').addEventListener('mousedown', function() {
    KiddoPaint.Sounds.oops();
    KiddoPaint.Display.undo();
  });

  document.getElementById('erase').addEventListener('mousedown', function() {
    KiddoPaint.Sounds.explosion();
    KiddoPaint.Display.clearAll();
  });

  document.getElementById('alnext').addEventListener('mousedown', function() {
    KiddoPaint.Alphabet.nextPage();
    init_alphabet_bar('character' + KiddoPaint.Alphabet.page);
  });

  document.getElementById('stnext').addEventListener('mousedown', function() {
    KiddoPaint.Stamps.nextPage();
    init_stamp_bar('stamp' + KiddoPaint.Stamps.page);
  });
};

function init_stamp_bar(stampgroup) {
  var stamptoolbar = KiddoPaint.Stamps.grouping[stampgroup].stamps;
  KiddoPaint.Tools.Stamp.stamp = stamptoolbar[0];
  for(var i = 0; i < stamptoolbar.length; i++) {
    var buttonValue = '<emj>' + stamptoolbar[i] + '</emj>';
    document.getElementById('xst' + i).innerHTML = buttonValue;
  }
}

function init_alphabet_bar(alphabetgroup) {
  var alphabettoolbar = KiddoPaint.Alphabet.english[alphabetgroup].letters;
  KiddoPaint.Tools.Stamp.stamp = alphabettoolbar[0];
  for(var i = 0; i < alphabettoolbar.length; i++) {
    var buttonValue = '<h1>' + alphabettoolbar[i] + '</h1>';
    document.getElementById('xal' + i).innerHTML = buttonValue;
  }
}

function init_subtool_bars() {
  init_pencil_subtoolbar();
  init_line_subtoolbar();
  init_square_subtoolbar();
  init_circle_subtoolbar();
  init_brush_subtoolbar();
  init_stamp_subtoolbar();
  init_alphabet_subtoolbar();
}

function init_pencil_subtoolbar() {
  document.getElementById('pw1').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 1; });
  document.getElementById('pw2').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 5; });
  document.getElementById('pw3').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 7; });
  document.getElementById('pw4').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 25; });
  document.getElementById('pw5').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.size = 100; });

  document.getElementById('pt1').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('ipt1').src = makeIcon(KiddoPaint.Textures.Solid);
  
  document.getElementById('pt2').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('ipt2').src = makeIcon(KiddoPaint.Textures.Partial1);
  
  document.getElementById('pt3').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('ipt3').src = makeIcon(KiddoPaint.Textures.Partial2);
  
  document.getElementById('pt4').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('ipt4').src = makeIcon(KiddoPaint.Textures.Partial3);
  
  document.getElementById('pt5').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Current.modifiedAlt ? KiddoPaint.Textures.RSmiley() : KiddoPaint.Textures.Smiley(KiddoPaint.Current.color); } });
  document.getElementById('ipt5').src = makeIcon(KiddoPaint.Textures.Smiley);
  
  document.getElementById('pt6').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.PartialSquares(KiddoPaint.Current.color); } });
  document.getElementById('ipt6').src = makeIcon(KiddoPaint.Textures.PartialSquares);

  document.getElementById('pt8').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color); } });
  document.getElementById('ipt8').src = makeIcon(KiddoPaint.Textures.Speckles);
  
  document.getElementById('pt9').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color); } });
  document.getElementById('ipt9').src = makeIcon(KiddoPaint.Textures.Bubbles);

  document.getElementById('pt10').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color); } });
  document.getElementById('ipt10').src = makeIcon(KiddoPaint.Textures.Diamond);

  document.getElementById('pt11').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Sand(KiddoPaint.Current.color); } });
  document.getElementById('ipt11').src = makeIcon(KiddoPaint.Textures.Sand);

  document.getElementById('pt12').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Brick(KiddoPaint.Current.color); } });
  document.getElementById('ipt12').src = makeIcon(KiddoPaint.Textures.Brick);

  document.getElementById('pt13').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color); } });
  document.getElementById('ipt13').src = makeIcon(KiddoPaint.Textures.CornerStair);

  document.getElementById('pt14').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color); } });
  document.getElementById('ipt14').src = makeIcon(KiddoPaint.Textures.Houndstooth);

  document.getElementById('pt7').addEventListener('mousedown', function() { KiddoPaint.Tools.PixelPencil.texture = function() { return KiddoPaint.Textures.RSolid(); } });
}

function init_line_subtoolbar() {
  document.getElementById('lw1').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 1; });
  document.getElementById('lw2').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 5; });
  document.getElementById('lw3').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 7; });
  document.getElementById('lw4').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 25; });
  document.getElementById('lw5').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.size = 100; });

  document.getElementById('lt1').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('ilt1').src = makeIcon(KiddoPaint.Textures.Solid);

  document.getElementById('lt2').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('ilt2').src = makeIcon(KiddoPaint.Textures.Partial1);
  
  document.getElementById('lt3').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('ilt3').src = makeIcon(KiddoPaint.Textures.Partial2);
  
  document.getElementById('lt4').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('ilt4').src = makeIcon(KiddoPaint.Textures.Partial3);

  document.getElementById('lt5').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.PartialSquares(KiddoPaint.Current.color); } });
  document.getElementById('ilt5').src = makeIcon(KiddoPaint.Textures.PartialSquares);

  document.getElementById('lt6').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Thatch(KiddoPaint.Current.color); } });
  document.getElementById('ilt6').src = makeIcon(KiddoPaint.Textures.Thatch);
  
  document.getElementById('lt8').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Shingles(KiddoPaint.Current.color); } });
  document.getElementById('ilt8').src = makeIcon(KiddoPaint.Textures.Shingles);

  document.getElementById('lt9').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Ribbon(KiddoPaint.Current.color); } });
  document.getElementById('ilt9').src = makeIcon(KiddoPaint.Textures.Ribbon);

  document.getElementById('lt10').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Brick(KiddoPaint.Current.color); } });
  document.getElementById('ilt10').src = makeIcon(KiddoPaint.Textures.Brick);

  document.getElementById('lt11').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Chevron(KiddoPaint.Current.color); } });
  document.getElementById('ilt11').src = makeIcon(KiddoPaint.Textures.Chevron);
  
  document.getElementById('lt12').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Stairs(KiddoPaint.Current.color); } });
  document.getElementById('ilt12').src = makeIcon(KiddoPaint.Textures.Stairs);
  
  document.getElementById('lt13').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.Cross(KiddoPaint.Current.color); } });
  document.getElementById('ilt13').src = makeIcon(KiddoPaint.Textures.Cross);
  
  document.getElementById('lt14').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = true; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.DiagBrick(KiddoPaint.Current.color); } });
  document.getElementById('ilt14').src = makeIcon(KiddoPaint.Textures.DiagBrick);

  document.getElementById('lt7').addEventListener('mousedown', function() { KiddoPaint.Tools.Line.stomp = false; KiddoPaint.Tools.Line.texture = function() { return KiddoPaint.Textures.RSolid(); } });
}

function init_square_subtoolbar() {
  document.getElementById('sqt1').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.None(KiddoPaint.Current.color); } });
  document.getElementById('isqt1').src = makeIcon(KiddoPaint.Textures.None);

  document.getElementById('sqt2').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('isqt2').src = makeIcon(KiddoPaint.Textures.Solid);
  
  document.getElementById('sqt3').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('isqt3').src = makeIcon(KiddoPaint.Textures.Partial1);

  document.getElementById('sqt4').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('isqt4').src = makeIcon(KiddoPaint.Textures.Partial2);
  
  document.getElementById('sqt5').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('isqt5').src = makeIcon(KiddoPaint.Textures.Partial3);
  
  document.getElementById('sqt6').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Stripes(KiddoPaint.Current.color); } });
  document.getElementById('isqt6').src = makeIcon(KiddoPaint.Textures.Stripes);
  
  document.getElementById('sqt7').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color); } });
  document.getElementById('isqt7').src = makeIcon(KiddoPaint.Textures.Speckles);
  
  document.getElementById('sqt8').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color); } });
  document.getElementById('isqt8').src = makeIcon(KiddoPaint.Textures.Bubbles);
  
  document.getElementById('sqt9').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Thatch(KiddoPaint.Current.color); } });
  document.getElementById('isqt9').src = makeIcon(KiddoPaint.Textures.Thatch);
  
  document.getElementById('sqt10').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Shingles(KiddoPaint.Current.color); } });
  document.getElementById('isqt10').src = makeIcon(KiddoPaint.Textures.Shingles);
  
  document.getElementById('sqt11').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color); } });
  document.getElementById('isqt11').src = makeIcon(KiddoPaint.Textures.Diamond);
  
  document.getElementById('sqt12').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Ribbon(KiddoPaint.Current.color); } });
  document.getElementById('isqt12').src = makeIcon(KiddoPaint.Textures.Ribbon);
  
  document.getElementById('sqt13').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Sand(KiddoPaint.Current.color); } });
  document.getElementById('isqt13').src = makeIcon(KiddoPaint.Textures.Sand);
  
  document.getElementById('sqt14').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Brick(KiddoPaint.Current.color); } });
  document.getElementById('isqt14').src = makeIcon(KiddoPaint.Textures.Brick);
  
  document.getElementById('sqt15').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Chevron(KiddoPaint.Current.color); } });
  document.getElementById('isqt15').src = makeIcon(KiddoPaint.Textures.Chevron);
  
  document.getElementById('sqt16').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Stairs(KiddoPaint.Current.color); } });
  document.getElementById('isqt16').src = makeIcon(KiddoPaint.Textures.Stairs);
  
  document.getElementById('sqt17').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Cross(KiddoPaint.Current.color); } });
  document.getElementById('isqt17').src = makeIcon(KiddoPaint.Textures.Cross);
  
  document.getElementById('sqt18').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.DiagBrick(KiddoPaint.Current.color); } });
  document.getElementById('isqt18').src = makeIcon(KiddoPaint.Textures.DiagBrick);

  document.getElementById('sqt19').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color); } });
  document.getElementById('isqt19').src = makeIcon(KiddoPaint.Textures.CornerStair);

  document.getElementById('sqt20').addEventListener('mousedown', function() { KiddoPaint.Tools.Square.texture = function() { return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color); } });
  document.getElementById('isqt20').src = makeIcon(KiddoPaint.Textures.Houndstooth);
}

function init_circle_subtoolbar() {
  document.getElementById('ct1').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.None(KiddoPaint.Current.color); } });
  document.getElementById('ict1').src = makeCircleIcon(KiddoPaint.Textures.None);
  
  document.getElementById('ct2').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); } });
  document.getElementById('ict2').src = makeCircleIcon(KiddoPaint.Textures.Solid);
  
  document.getElementById('ct3').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color); } });
  document.getElementById('ict3').src = makeCircleIcon(KiddoPaint.Textures.Partial1);

  document.getElementById('ct4').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color); } });
  document.getElementById('ict4').src = makeCircleIcon(KiddoPaint.Textures.Partial2);

  document.getElementById('ct5').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color); } });
  document.getElementById('ict5').src = makeCircleIcon(KiddoPaint.Textures.Partial3);

  document.getElementById('ct6').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Stripes(KiddoPaint.Current.color); } });
  document.getElementById('ict6').src = makeCircleIcon(KiddoPaint.Textures.Stripes);
  
  document.getElementById('ct7').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color); } });
  document.getElementById('ict7').src = makeCircleIcon(KiddoPaint.Textures.Speckles);
  
  document.getElementById('ct8').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color); } });
  document.getElementById('ict8').src = makeCircleIcon(KiddoPaint.Textures.Bubbles);
  
  document.getElementById('ct9').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Thatch(KiddoPaint.Current.color); } });
  document.getElementById('ict9').src = makeCircleIcon(KiddoPaint.Textures.Thatch);
  
  document.getElementById('ct10').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Shingles(KiddoPaint.Current.color); } });
  document.getElementById('ict10').src = makeCircleIcon(KiddoPaint.Textures.Shingles);
  
  document.getElementById('ct11').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color); } });
  document.getElementById('ict11').src = makeCircleIcon(KiddoPaint.Textures.Diamond);
  
  document.getElementById('ct12').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Ribbon(KiddoPaint.Current.color); } });
  document.getElementById('ict12').src = makeCircleIcon(KiddoPaint.Textures.Ribbon);
  
  document.getElementById('ct13').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Sand(KiddoPaint.Current.color); } });
  document.getElementById('ict13').src = makeCircleIcon(KiddoPaint.Textures.Sand);
  
  document.getElementById('ct14').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Brick(KiddoPaint.Current.color); } });
  document.getElementById('ict14').src = makeCircleIcon(KiddoPaint.Textures.Brick);
  
  document.getElementById('ct15').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Chevron(KiddoPaint.Current.color); } });
  document.getElementById('ict15').src = makeCircleIcon(KiddoPaint.Textures.Chevron);
  
  document.getElementById('ct16').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Stairs(KiddoPaint.Current.color); } });
  document.getElementById('ict16').src = makeCircleIcon(KiddoPaint.Textures.Stairs);
  
  document.getElementById('ct17').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Cross(KiddoPaint.Current.color); } });
  document.getElementById('ict17').src = makeCircleIcon(KiddoPaint.Textures.Cross);
  
  document.getElementById('ct18').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.DiagBrick(KiddoPaint.Current.color); } });
  document.getElementById('ict18').src = makeCircleIcon(KiddoPaint.Textures.DiagBrick);

  document.getElementById('ct19').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color); } });
  document.getElementById('ict19').src = makeCircleIcon(KiddoPaint.Textures.CornerStair);

  document.getElementById('ct20').addEventListener('mousedown', function() { KiddoPaint.Tools.Circle.texture = function() { return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color); } });
  document.getElementById('ict20').src = makeCircleIcon(KiddoPaint.Textures.Houndstooth);
}

function init_brush_subtoolbar() {
  document.getElementById('br1').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Current.modified ? KiddoPaint.Builders.Arrow(KiddoPaint.Colors.randomColor(), angle) : KiddoPaint.Builders.Arrow(KiddoPaint.Current.color, angle); }; });
  document.getElementById('br2').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Road(KiddoPaint.Current.color, angle); }; });
  document.getElementById('br3').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 25; KiddoPaint.Tools.PlainBrush.texture = function() { return KiddoPaint.Current.modified ? KiddoPaint.Brushes.RCircles() : KiddoPaint.Brushes.Circles(KiddoPaint.Current.color); } });
  document.getElementById('br4').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '👣',  angle); }; });
  document.getElementById('br5').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '🐾', angle); }; });
  document.getElementById('br6').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function(angle) { return KiddoPaint.Builders.Rail(KiddoPaint.Colors.randomColor(), angle) }; });
  document.getElementById('br7').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 0; KiddoPaint.Tools.PlainBrush.texture = function() { return KiddoPaint.Brushes.Spray(KiddoPaint.Current.color) }; });
  document.getElementById('br8').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Scribble; });
  document.getElementById('br9').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 40; KiddoPaint.Tools.PlainBrush.texture = function() { return KiddoPaint.Brushes.Pies(KiddoPaint.Current.color) }; });
  document.getElementById('br10').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 1; KiddoPaint.Tools.PlainBrush.texture = function(step) { return KiddoPaint.Brushes.Concentric(KiddoPaint.Current.color, step) }; });
  document.getElementById('br11').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 1; KiddoPaint.Tools.PlainBrush.texture = function(step) { return KiddoPaint.Brushes.Twirly(KiddoPaint.Current.modified ? KiddoPaint.Colors.nextColor() : KiddoPaint.Current.color, step) }; });
  document.getElementById('br12').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 1; KiddoPaint.Tools.PlainBrush.texture = function(step) { return KiddoPaint.Current.modifiedAlt ? KiddoPaint.Brushes.RotatingPentagon(KiddoPaint.Current.color, step) : KiddoPaint.Brushes.FollowingSine(KiddoPaint.Current.color, step) }; });
  document.getElementById('br13').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush; KiddoPaint.Tools.PlainBrush.spacing = 1; KiddoPaint.Tools.PlainBrush.texture = function(step) { return KiddoPaint.Brushes.Rose(KiddoPaint.Current.color, step) }; });
  document.getElementById('br14').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Guilloche; });
  document.getElementById('br15').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Contours; });
  document.getElementById('br16').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Astroid; });
  document.getElementById('br17').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Magnify; });
  document.getElementById('br18').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Kaleidoscope; });
  document.getElementById('br19').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function() { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, KiddoPaint.Alphabet.nextWingding(1)); }; });
  document.getElementById('br20').addEventListener('mousedown', function() { KiddoPaint.Current.tool = KiddoPaint.Tools.Brush; KiddoPaint.Tools.Brush.texture = function() { return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, KiddoPaint.Alphabet.nextWingding(2)); }; });
}

function init_stamp_subtoolbar() {
  // document.getElementsByName("xx") ; name="xx"
  var stampselect = document.querySelectorAll('*[id^="xst"]');
  for(var i = 0; i < stampselect.length; i++) {
    var stampButton = stampselect[i];
    stampButton.addEventListener('mousedown', function(ev) { reset_ranges(); src = ev.srcElement || ev.target; KiddoPaint.Tools.Stamp.stamp = src.firstChild.nodeValue; });
  }
}

function init_alphabet_subtoolbar() {
  var alphaselect = document.querySelectorAll('*[id^="xal"]');
  for(var i = 0; i < alphaselect.length; i++) {
    var alphaButton = alphaselect[i];
    alphaButton.addEventListener('mousedown', function(ev) { reset_ranges(); src = ev.srcElement || ev.target; KiddoPaint.Tools.Stamp.stamp = src.firstChild.nodeValue; });
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

function image_upload(ev) {
  var files = ev.dataTransfer.files;
  if (files.length > 0) {
    var file = files[0];
    if (typeof FileReader !== "undefined") {
      var reader = new FileReader();
      reader.onload = function (evt) {
        var img = new Image();
        img.onload = function() { KiddoPaint.Display.context.drawImage(img, 0, 0); KiddoPaint.Display.saveMain(); };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  if(ev.preventDefault) { ev.preventDefault(); }
  ev.returnValue = false;  
  return false;
}
