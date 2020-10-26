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
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    }, false);

    var canvas = document.getElementById('kiddopaint');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // sets proper offset due to css canvas positioning and kiddopaint buttons
        canvas.width = canvas.width;
        canvas.height = canvas.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var container = canvas.parentNode;

        previewCanvas = document.createElement('canvas');
        previewCanvas.id = 'previewCanvas';
        previewCanvas.width = canvas.width;
        previewCanvas.height = canvas.height;
        container.appendChild(previewCanvas);
        previewContext = previewCanvas.getContext('2d');
        previewContext.clearRect(0, 0, canvas.width, canvas.height);

        tmpCanvas = document.createElement('canvas');
        tmpCanvas.id = 'tmpCanvas';
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        container.appendChild(tmpCanvas);
        tmpContext = tmpCanvas.getContext('2d');
        tmpContext.clearRect(0, 0, canvas.width, canvas.height);

        KiddoPaint.Display.canvas = tmpCanvas;
        KiddoPaint.Display.context = tmpContext;
        KiddoPaint.Display.context.globalAlpha = 1.0;

        KiddoPaint.Display.previewCanvas = previewCanvas;
        KiddoPaint.Display.previewContext = previewContext;
        KiddoPaint.Display.previewContext.globalAlpha = 1.0;

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
    KiddoPaint.Current.color = KiddoPaint.Colors.currentPalette()[0];
    KiddoPaint.Current.altColor = KiddoPaint.Colors.currentPalette()[0];
    KiddoPaint.Current.terColor = KiddoPaint.Colors.currentPalette()[0];
    KiddoPaint.Current.tool = KiddoPaint.Tools.Pencil;
    KiddoPaint.Current.globalAlpha = 1.0;
    KiddoPaint.Current.scaling = 1;
    KiddoPaint.Display.step = 0;
    KiddoPaint.Current.modified = false;
    KiddoPaint.Current.modifiedAlt = false;
    KiddoPaint.Current.modifiedCtrl = false;
    KiddoPaint.Current.modifiedToggle = false;
    KiddoPaint.Current.modifiedMeta = false;
    KiddoPaint.Current.modifiedTilde = false;
    KiddoPaint.Current.velToggle = false;
    KiddoPaint.Alphabet.page = 1;
    KiddoPaint.Stamps.page = 1;
    KiddoPaint.Stamps.currentFace = KiddoPaint.Stamps.grouping.face;
    KiddoPaint.Current.multiplier = 1;
    KiddoPaint.Current.prevEv = null;
    KiddoPaint.Current.prevEvTs = Date.now();
    KiddoPaint.Current.velocity = 0;
    KiddoPaint.Current.velocityMultiplier = 1;
    reset_ranges();
}

function reset_ranges() {
    KiddoPaint.Current.multiplier = 1;
    KiddoPaint.Current.modifiedRange = 0;
    KiddoPaint.Current.modifiedAltRange = 0;
    KiddoPaint.Current.modifiedCtrlRange = 0;
    KiddoPaint.Current.modifiedToggle = false;
    KiddoPaint.Current.velToggle = false;
    KiddoPaint.Current.modifiedMeta = false;
    KiddoPaint.Current.modifiedTilde = false;
}

function init_listeners(canvas) {
    canvas.addEventListener('mousedown', ev_canvas);
    canvas.addEventListener('mousemove', ev_canvas);
    canvas.addEventListener('mouseup', ev_canvas);

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        e.touches[0].type = e.type;
        ev_canvas(e.touches[0]);
    }, {
        passive: false
    });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        e.touches[0].type = e.type;
        ev_canvas(e.touches[0]);
    }, {
        passive: false
    });
    canvas.addEventListener('touchend', e => {
        e.preventDefault();
        e.touches[0].type = e.type;
        ev_canvas(e.touches[0]);
    }, {
        passive: false
    });

    canvas.addEventListener('mouseleave', function() {
        KiddoPaint.Display.clearPreview();
    });
    canvas.addEventListener("mousewheel", mouse_wheel);
    canvas.addEventListener("dragover", function(ev) {
        if (ev.preventDefault) {
            ev.preventDefault();
        };
        ev.returnValue = false;
        return false;
    }, false);
    canvas.addEventListener("drop", image_upload);

    document.onkeydown = function checkKey(e) {
        if (e.keyCode == 16) {
            KiddoPaint.Current.scaling = 2;
            KiddoPaint.Current.modified = true;
        } else if (e.keyCode == 91) {
            KiddoPaint.Current.modifiedCtrl = true;
        } else if (e.keyCode == 18) {
            KiddoPaint.Current.modifiedAlt = true;
        } else if (e.keyCode == 17) {
            KiddoPaint.Current.modifiedMeta = true;
        } else if (e.keyCode == 192) {
            KiddoPaint.Current.modifiedTilde = true;
        } else if (e.keyCode == 78) { // n
            var c = KiddoPaint.Colors.nextAllColor();
            // keep them in sync
            KiddoPaint.Current.color = c;
            KiddoPaint.Current.altColor = c;
            KiddoPaint.Current.terColor = c;
            document.getElementById('currentColor').style = 'background-color: ' + c;
        } else if (e.keyCode == 67) { // c
            KiddoPaint.Colors.nextPalette();
            set_colors_to_current_palette();
        } else if (e.keyCode == 82) { // r
            var c = KiddoPaint.Colors.randomAllColor();
            KiddoPaint.Current.color = c;
            document.getElementById('currentColor').style = 'background-color: ' + c;
            KiddoPaint.Current.altColor = KiddoPaint.Colors.randomAllColor();
            KiddoPaint.Current.terColor = KiddoPaint.Colors.randomAllColor();
        } else if (e.keyCode == 83) {
            save_to_file();
        } else if (e.keyCode > 48 && e.keyCode < 58) {
            KiddoPaint.Current.multiplier = e.keyCode - 48;
        } else if (e.keyCode == 32) {
            e.stopPropagation();
            e.preventDefault();
            KiddoPaint.Current.modifiedToggle = !KiddoPaint.Current.modifiedToggle;
        } else if (e.keyCode == 86) {
            KiddoPaint.Current.velToggle = !KiddoPaint.Current.velToggle;
        }
    }
    document.onkeyup = function checkKey(e) {
        if (e.keyCode == 16) {
            KiddoPaint.Current.scaling = 1;
            KiddoPaint.Current.modified = false;
        } else if (e.keyCode == 91) {
            KiddoPaint.Current.modifiedCtrl = false;
        } else if (e.keyCode == 17) {
            KiddoPaint.Current.modifiedMeta = false;
        } else if (e.keyCode == 192) {
            KiddoPaint.Current.modifiedTilde = false;
        } else if (e.keyCode == 18) {
            KiddoPaint.Current.modifiedAlt = false;
        };
    }
}

function colorSelect(e) {
    var src = e.srcElement || e.target;
    var colorId = src.id;
    var colorSelected = KiddoPaint.Colors.currentPalette()[colorId];
    if (e.which == 1) {
        KiddoPaint.Current.color = colorSelected
        document.getElementById('currentColor').style = "background-color:" + colorSelected;
    } else if (e.which == 3) {
        KiddoPaint.Current.altColor = colorSelected;
    } else if (e.which == 2) {
        KiddoPaint.Current.terColor = colorSelected;
    }
}

function set_colors_to_current_palette() {
    var pal = KiddoPaint.Colors.currentPalette();
    var buttons = document.getElementById('colorselector').children;
    for (var i = 0, len = buttons.length; i < len; i++) {
        var button = buttons[i];
        var buttonid = button.id;
        var color = pal[buttonid];
        button.style = "background-color:" + color;
    }
}

function init_color_selector() {
    var buttons = document.getElementById('colorselector').children;
    for (var i = 0, len = buttons.length; i < len; i++) {
        var button = buttons[i];
        button.id = i;
        button.addEventListener('mousedown', colorSelect);
    }
    set_colors_to_current_palette();
    document.getElementById('currentColor').style = "background-color:" + KiddoPaint.Current.color;
}

function show_sub_toolbar(subtoolbar) {
    reset_ranges();
    var subtoolbars = document.getElementById('subtoolbars').children;
    for (var i = 0, len = subtoolbars.length; i < len; i++) {
        var div = subtoolbars[i];
        if (div.id === subtoolbar) {
            div.className = 'subtoolbar'
        } else {
            div.className = 'hidden'
        }
    }
}

function init_tool_bar() {
    document.getElementById('save').addEventListener('mousedown', function() {
        save_to_file();
    });

    document.getElementById('pencil').addEventListener('mousedown', function() {
        show_generic_submenu('pencil');
        KiddoPaint.Current.tool = KiddoPaint.Tools.Pencil;
    });

    document.getElementById('pen').addEventListener('mousedown', function() {
        show_generic_submenu('pencil');
        KiddoPaint.Current.tool = KiddoPaint.Tools.SmoothPen;
    });

    document.getElementById('line').addEventListener('mousedown', function() {
        show_generic_submenu('line');
        KiddoPaint.Current.tool = KiddoPaint.Tools.Line;
    });

    document.getElementById('square').addEventListener('mousedown', function() {
        show_generic_submenu('square');
        KiddoPaint.Current.tool = KiddoPaint.Tools.Square;
    });

    document.getElementById('circle').addEventListener('mousedown', function() {
        show_generic_submenu('circle');
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

    document.getElementById('flood').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Flood;
    });
    document.getElementById('truck').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Cut;
    });

    document.getElementById('undo').addEventListener('mousedown', function() {
        KiddoPaint.Sounds.oops();
        KiddoPaint.Display.undo(!KiddoPaint.Current.modifiedAlt);
    });

    document.getElementById('erase').addEventListener('mousedown', function() {
        KiddoPaint.Sounds.explosion();
        KiddoPaint.Display.clearAll();
    });

    document.getElementById('alnext').addEventListener('mousedown', function() {
        KiddoPaint.Alphabet.nextPage();
        init_alphabet_bar('character' + KiddoPaint.Alphabet.page);
    });

    document.getElementById('stnext').addEventListener('mousedown', function(e) {
        (e.which == 1) ? KiddoPaint.Stamps.nextPage(): KiddoPaint.Stamps.prevPage(); // left click is 1, right click is 3
        init_stamp_bar('stamp' + KiddoPaint.Stamps.page);
    });

    document.getElementById('alphaslider').addEventListener('input', function() {
        KiddoPaint.Current.globalAlpha = this.value / 100.0;
        KiddoPaint.Display.context.globalAlpha = KiddoPaint.Current.globalAlpha;
        KiddoPaint.Display.previewContext.globalAlpha = KiddoPaint.Current.globalAlpha;
    });
    document.getElementById('jumble').addEventListener('mousedown', function() {
        show_generic_submenu('jumble');
        KiddoPaint.Current.tool = KiddoPaint.Tools.WholeCanvasEffect;
    });
};

function init_stamp_bar(stampgroup) {
    // clear prev page for varying length stamp packs
    var stampselect = document.querySelectorAll('*[id^="xst"]');
    for (var i = 0; i < stampselect.length; i++) {
        var stampButton = stampselect[i];
        var buttonValue = '<emj> </emj>';
        stampButton.innerHTML = buttonValue;
    }

    // populate values
    var stamptoolbar = KiddoPaint.Stamps.grouping[stampgroup].stamps;
    KiddoPaint.Tools.Stamp.stamp = stamptoolbar[0];
    for (var i = 0; i < stamptoolbar.length; i++) {
        var buttonValue = '<emj>' + stamptoolbar[i] + '</emj>';
        document.getElementById('xst' + i).innerHTML = buttonValue;
    }
}

function init_alphabet_bar(alphabetgroup) {
    var alphabettoolbar = KiddoPaint.Alphabet.english[alphabetgroup].letters;
    KiddoPaint.Tools.Stamp.stamp = alphabettoolbar[0];
    for (var i = 0; i < alphabettoolbar.length; i++) {
        var buttonValue = '<h1>' + alphabettoolbar[i] + '</h1>';
        document.getElementById('xal' + i).innerHTML = buttonValue;
    }
}

function init_subtool_bars() {
    init_pencil_subtoolbar();
    init_brush_subtoolbar();
    init_stamp_subtoolbar();
    init_alphabet_subtoolbar();
    init_special_handlers();
}

function init_pencil_subtoolbar() {
    // this is the default, so we show show it
    show_generic_submenu('pencil');
}

function init_special_handlers() {

    // punch color mode
    document.getElementById('currentColor').addEventListener('dblclick', function(e) {
        // turn off undo and short circuit saving to main...
        KiddoPaint.Display.toggleUndo();
        if (KiddoPaint.Display.undoOn) {
            // second click re-enables undo, we then force propagate the previous dest-in operaetions to main and go back to default source-over
            KiddoPaint.Display.allowClearTmp = true;
            KiddoPaint.Display.saveMain();
            KiddoPaint.Display.main_context.globalCompositeOperation = 'source-over';
            e.target.innerHTML = ' ';
        } else {
            // first click turns this on and all operations don't propagate
            e.target.innerHTML = '⁉️';
            KiddoPaint.Display.main_context.globalCompositeOperation = 'destination-in';
            KiddoPaint.Display.allowClearTmp = false;
        }
    });

    // set current color to blank
    document.getElementById('currentColor').addEventListener('mousedown', function(e) {
        if (e.which == 3) {
            var colorSelected = KiddoPaint.Colors.Palette.Blank[0];
            KiddoPaint.Current.color = colorSelected
            document.getElementById('currentColor').style = "background-color:" + colorSelected;
        }
    });
}

function init_brush_subtoolbar() {
    document.getElementById('br1').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function(angle) {
            return KiddoPaint.Current.modifiedMeta ? KiddoPaint.Builders.Arrow(KiddoPaint.Colors.randomColor(), angle) : KiddoPaint.Builders.Arrow(KiddoPaint.Current.color, angle);
        };
    });
    document.getElementById('br2').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function(angle) {
            return KiddoPaint.Builders.Road(KiddoPaint.Current.color, KiddoPaint.Current.altColor, angle);
        };
    });
    document.getElementById('br3').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 25;
        KiddoPaint.Tools.PlainBrush.texture = function() {
            return KiddoPaint.Current.modifiedMeta ? KiddoPaint.Brushes.RCircles() : KiddoPaint.Brushes.Circles(KiddoPaint.Current.color);
        }
    });
    document.getElementById('br4').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function(angle) {
            return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '👣', angle);
        };
    });
    document.getElementById('br5').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function(angle) {
            return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, '🐾', angle);
        };
    });
    document.getElementById('br6').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function(angle) {
            return KiddoPaint.Builders.Rail(KiddoPaint.Colors.randomColor(), angle)
        };
    });
    document.getElementById('br7').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function() {
            return KiddoPaint.Brushes.Spray(KiddoPaint.Current.color, KiddoPaint.Current.terColor)
        };
        KiddoPaint.Tools.PlainBrush.preprocess = function() {
            KiddoPaint.Display.context.shadowBlur = 16;
            KiddoPaint.Display.context.shadowColor = KiddoPaint.Current.altColor;
        };
        KiddoPaint.Tools.PlainBrush.postprocess = function() {
            KiddoPaint.Display.context.shadowBlur = 0;
            KiddoPaint.Display.context.shadowColor = null;
        };
    });
    document.getElementById('br7').addEventListener('dblclick', function() {
        show_generic_submenu('spray');
    });
    document.getElementById('br8').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Scribble;
    });
    document.getElementById('br9').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 40;
        KiddoPaint.Tools.PlainBrush.texture = function() {
            return KiddoPaint.Brushes.Pies(KiddoPaint.Current.color)
        };
    });
    document.getElementById('br10').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 1;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.Concentric(KiddoPaint.Current.color, step)
        };
    });
    document.getElementById('br11').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 1;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.Twirly(KiddoPaint.Current.modifiedMeta ? KiddoPaint.Colors.nextColor() : KiddoPaint.Current.color, step)
        };
    });
    document.getElementById('br12').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 1;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Current.modifiedCtrl ? KiddoPaint.Brushes.RotatingPentagon(KiddoPaint.Current.modifiedMeta ? KiddoPaint.Colors.nextColor() : KiddoPaint.Current.color, step) : KiddoPaint.Brushes.FollowingSine(KiddoPaint.Current.modifiedMeta ? KiddoPaint.Colors.nextColor() : KiddoPaint.Current.color, step)
        };
    });
    document.getElementById('br13').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 1;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.Rose(KiddoPaint.Current.color, step)
        };
    });
    document.getElementById('br14').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Guilloche;
    });
    document.getElementById('br15').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Contours;
    });
    document.getElementById('br16').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Astroid;
    });
    document.getElementById('br17').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Magnify;
    });
    document.getElementById('br18').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Kaleidoscope;
    });
    document.getElementById('br19').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function() {
            return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, KiddoPaint.Alphabet.nextWingding(1));
        };
    });
    document.getElementById('br20').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Brush;
        KiddoPaint.Tools.Brush.texture = function() {
            return KiddoPaint.Builders.Prints(KiddoPaint.Current.color, KiddoPaint.Alphabet.nextWingding(2));
        };
    });
    document.getElementById('br21').addEventListener('mousedown', function() {
        /*
        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.MeanStreak(step)
        };
*/

        KiddoPaint.Tools.Composite.clearComposed();

        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.MeanStreak(step)
        };

        KiddoPaint.Tools.Composite.compose(KiddoPaint.Tools.PlainBrush);

        KiddoPaint.Tools.Smudge.size = 15;
        KiddoPaint.Tools.Composite.compose(KiddoPaint.Tools.Smudge);

        KiddoPaint.Current.tool = KiddoPaint.Tools.Composite;
    });
    document.getElementById('br22').addEventListener('mousedown', function() {
        KiddoPaint.Tools.Smudge.size = 36;
        KiddoPaint.Current.tool = KiddoPaint.Tools.Smudge;
    });
    document.getElementById('br23').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Maze;
    });

    document.getElementById('br24').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Tree;
    });

    /*
    document.getElementById('br24').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.BezFollow;
    });
    */

    document.getElementById('br25').addEventListener('mousedown', function() {

        KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.RainbowBall(step)
        };

    });

    document.getElementById('br26').addEventListener('mousedown', function() {
        KiddoPaint.Current.tool = KiddoPaint.Tools.Smoke;
    });
}

function init_stamp_subtoolbar() {
    // document.getElementsByName("xx") ; name="xx"
    var stampselect = document.querySelectorAll('*[id^="xst"]');
    for (var i = 0; i < stampselect.length; i++) {
        var stampButton = stampselect[i];
        stampButton.addEventListener('mousedown', function(ev) {
            reset_ranges();
            src = ev.srcElement || ev.target;
            KiddoPaint.Tools.Stamp.stamp = src.firstChild.nodeValue;
        });
        stampButton.addEventListener('dblclick', function(ev) {
            src = ev.srcElement || ev.target;
            if ('✨' == src.firstChild.nodeValue) {
                reset_ranges();
                show_generic_submenu('sparkles');
            }
        });
    }
}

function init_alphabet_subtoolbar() {
    var alphaselect = document.querySelectorAll('*[id^="xal"]');
    for (var i = 0; i < alphaselect.length; i++) {
        var alphaButton = alphaselect[i];
        alphaButton.addEventListener('mousedown', function(ev) {
            reset_ranges();
            src = ev.srcElement || ev.target;
            KiddoPaint.Tools.Stamp.stamp = src.firstChild.nodeValue;
        });
    }
}

function ev_canvas(ev) {
    if (!ev) {
        return;
    }
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
    if (ev.type === "touchstart") {
        ev.type = "mousedown";
    }
    if (ev.type === "touchmove") {
        ev.type = "mousemove";
    }
    if (ev.type === "touchend") {
        ev.type = "mouseup";
    }

    var func = KiddoPaint.Current.tool[ev.type];
    if (func) {
        func(ev);
    }

    // common ev processing
    common_ev_proc(ev);

    KiddoPaint.Current.prevEv = ev;
    KiddoPaint.Current.prevEvTs = Date.now();
}

function common_ev_proc(ev) {
    if (!KiddoPaint.Current.prevEv)
        return;

    var dist = distanceBetween(KiddoPaint.Current.prevEv, ev);
    var tsdelta = (Date.now() - KiddoPaint.Current.prevEvTs) + 1;
    var velocity = (1.0 * dist) / tsdelta * 1000.0;
    KiddoPaint.Current.velocity = velocity;
    KiddoPaint.Current.velocityMultiplier = (velocity > 1000) ? velocity / 1000 : 1.0;
    if (KiddoPaint.Current.velToggle) {
        KiddoPaint.Current.scaling = KiddoPaint.Current.velocityMultiplier;
    }
}

function mouse_wheel(ev) {
    var delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)));
    if (KiddoPaint.Current.modified) {
        KiddoPaint.Current.modifiedRange += delta;
        if (KiddoPaint.Current.modifiedRange > 100) {
            KiddoPaint.Current.modifiedRange = -100;
        } else if (KiddoPaint.Current.modifiedRange < -100) {
            KiddoPaint.Current.modifiedRange = 100;
        }
    } else if (KiddoPaint.Current.modifiedAlt) {
        KiddoPaint.Current.modifiedAltRange += delta;
        if (KiddoPaint.Current.modifiedAltRange > 100) {
            KiddoPaint.Current.modifiedAltRange = -100;
        } else if (KiddoPaint.Current.modifiedAltRange < -100) {
            KiddoPaint.Current.modifiedAltRange = 100;
        }
    } else if (KiddoPaint.Current.modifiedCtrl) {
        KiddoPaint.Current.modifiedCtrlRange += delta;
        if (KiddoPaint.Current.modifiedCtrlRange > 100) {
            KiddoPaint.Current.modifiedCtrlRange = -100;
        } else if (KiddoPaint.Current.modifiedCtrlRange < -100) {
            KiddoPaint.Current.modifiedCtrlRange = 100;
        }
    }
    // kick off a redraw of preview
    if (KiddoPaint.Current.ev) {
        ev_canvas(KiddoPaint.Current.ev);
    }
    if (ev.preventDefault) {
        ev.preventDefault();
    }
    ev.returnValue = false;
    return false;
}

function save_to_file() {
    //  var image = KiddoPaint.Display.main_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //  window.location.href=image; 
    var canvasToSave = KiddoPaint.Current.modifiedAlt ? trimCanvas(KiddoPaint.Display.main_canvas) : KiddoPaint.Display.main_canvas;
    var image = canvasToSave.toDataURL("image/png");
    var a = document.createElement("a");
    a.href = image;
    a.download = "kiddopaint-" + Date.now() + ".png";
    a.click();
}

function image_upload(ev) {
    var files = ev.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        if (typeof FileReader !== "undefined") {
            var reader = new FileReader();
            reader.onload = function(evt) {
                var img = new Image();
                img.onload = function() {
                    if (KiddoPaint.Current.modifiedAlt) {
                        KiddoPaint.Display.context.drawImage(img, 0, 0);
                        KiddoPaint.Display.saveMain();
                    } else {
                        KiddoPaint.Tools.Placer.image = img;
                        KiddoPaint.Tools.Placer.size = {
                            width: img.width,
                            height: img.height
                        };
                        KiddoPaint.Tools.Placer.prevTool = KiddoPaint.Current.tool;
                        KiddoPaint.Current.tool = KiddoPaint.Tools.Placer;
                    }
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    if (ev.preventDefault) {
        ev.preventDefault();
    }
    ev.returnValue = false;
    return false;
}