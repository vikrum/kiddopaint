KiddoPaint.Tools.Toolbox = {};

KiddoPaint.Tools.Toolbox.PixelPencil = function() {
	var tool = this;
	this.isDown = false;
	this.size = 7;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
	};

	this.mousemove = function (ev) {
		var ctx = tool.isDown ? KiddoPaint.Display.context : KiddoPaint.Display.previewContext;
		ctx.fillStyle = tool.texture();
		ctx.fillRect(Math.round(ev._x), Math.round(ev._y), tool.size * KiddoPaint.Current.scaling, tool.size * KiddoPaint.Current.scaling);
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.PixelPencil = new KiddoPaint.Tools.Toolbox.PixelPencil();

KiddoPaint.Tools.Toolbox.Brush = function() {
	var tool = this;
	this.isDown = false;
	this.didMove = false;
	this.previousEv = null;
	this.minDistance = 0;
	this.texture = function(angle) { return KiddoPaint.Current.modified ? KiddoPaint.Builders.Arrow(KiddoPaint.Colors.randomColor(), angle) : KiddoPaint.Builders.Arrow(KiddoPaint.Current.color, angle); };

	this.mousedown = function (ev) {
		tool.isDown = true;

		tool.didMove = true; // put first click
		tool.mousemove(ev);
		tool.didMove = false; // clear first click if need be

		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(!tool.didMove) {
				// just kidding! we're moving, so clear the first builder mark and ...
				KiddoPaint.Display.clearTmp();
				tool.didMove = true;
			        tool.previousEv = ev;
				// ... start drawing the new builder as soon as possible.
				tool.minDistance = 0;
			}
			else if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.minDistance) {
				var angle = tool.previousEv == null ? 0 : angleBetween(tool.previousEv, ev) + 0.5 * Math.PI;
				var brushFill = tool.texture(angle);
				KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y));
				tool.previousEv = ev;
				// next builder should be spaced out
				tool.minDistance = 25;
			}
		}
		else {
			var angle = tool.previousEv == null ? 0 : angleBetween(tool.previousEv, ev) + 0.5 * Math.PI;
			var brushFill = tool.texture(angle);
			KiddoPaint.Display.previewContext.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y));
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.isDown = false;
			tool.previousEv = null;
			tool.minDistance = 0;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Brush = new KiddoPaint.Tools.Toolbox.Brush();

KiddoPaint.Tools.Toolbox.PlainBrush = function() {
	var tool = this;
	this.isDown = false;
	this.previousEv = null;
	this.texture = function() { };
	this.spacing = 5;
	this.step = 0;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.spacing) {
			  var brushFill = tool.texture(tool.step);
			  KiddoPaint.Display.context.drawImage(brushFill.brush, Math.round(ev._x - brushFill.offset), Math.round(ev._y - brushFill.offset));
			  tool.previousEv = ev;
			  tool.step += 1;
			}
		}
		else {
			  var brushFill = tool.texture(0);
			  KiddoPaint.Display.previewContext.drawImage(brushFill.brush, Math.round(ev._x - brushFill.offset), Math.round(ev._y - brushFill.offset));
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			tool.previousEv = null;
			tool.step = 0;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.PlainBrush = new KiddoPaint.Tools.Toolbox.PlainBrush();

KiddoPaint.Tools.Toolbox.Line = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
	this.stomp = true;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.x = ev._x;
		tool.y = ev._y;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.stomp) {
				KiddoPaint.Display.clearTmp();
			}

			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.moveTo(Math.round(tool.x), Math.round(tool.y));
			if(KiddoPaint.Current.modified) {
				deltax = Math.abs(ev._x - tool.x);
				deltay = Math.abs(ev._y - tool.y);
				if(deltax < deltay) {
					KiddoPaint.Display.context.lineTo(tool.x, ev._y);
				}
				else {
					KiddoPaint.Display.context.lineTo(ev._x, tool.y);
				}
			}
			else {
				KiddoPaint.Display.context.lineTo(ev._x,   ev._y);
			}
			KiddoPaint.Display.context.strokeStyle = tool.texture();
			KiddoPaint.Display.context.lineWidth = tool.size;
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Line = new KiddoPaint.Tools.Toolbox.Line();

KiddoPaint.Tools.Toolbox.Stamp = function() {
	var tool = this;
	this.isDown = false;
	this.stamp = '🚂';
	this.size = 64;
	this.useColor = false;
	this.texture = function() {
			var altSize = KiddoPaint.Cache.getStampSettings(tool.stamp).altSize;
			if(KiddoPaint.Current.modifiedRange !== 0) {
				var modifiedSize = KiddoPaint.Current.modifiedRange + 112;
				KiddoPaint.Cache.setStampSetting(tool.stamp, 'altSize', modifiedSize);
				altSize = modifiedSize;
			}
			tool.size = KiddoPaint.Current.modified ? altSize : 64;

			var hueShift = KiddoPaint.Cache.getStampSettings(tool.stamp).hueShift;
			if(KiddoPaint.Current.modifiedCtrlRange !== 0) {
				var modifiedHue = KiddoPaint.Current.modifiedCtrlRange / 100;
				KiddoPaint.Cache.setStampSetting(tool.stamp, 'hueShift', modifiedHue);
				hueShift = modifiedHue;
			}

			return KiddoPaint.Stamps.stamp(tool.stamp, KiddoPaint.Current.modifiedAlt, tool.size, hueShift, tool.useColor ? KiddoPaint.Current.color : null );
	};

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Sounds.stamp();

		KiddoPaint.Display.context.fillStyle = tool.useColor ? KiddoPaint.Current.color : null;
		var brushFill = tool.texture();
		KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y - tool.size));
	};

	this.mousemove = function (ev) {
		if( ! tool.isDown) {
			KiddoPaint.Display.previewContext.fillStyle = tool.useColor ? KiddoPaint.Current.color : null;
			var brushFill = tool.texture();
			KiddoPaint.Display.previewContext.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y - tool.size));
		}
	};

	this.mouseup = function (ev) {
		tool.isDown = false;
		KiddoPaint.Display.saveMain();
	};
};
KiddoPaint.Tools.Stamp = new KiddoPaint.Tools.Toolbox.Stamp();

KiddoPaint.Tools.Toolbox.Square = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
	this.stomp = true;
	this.texture = function() { return KiddoPaint.Textures.None(); };
	this.stroke = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.x = ev._x;
		tool.y = ev._y;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.stomp) {
				KiddoPaint.Display.clearTmp();
			}
			KiddoPaint.Display.context.strokeStyle = tool.stroke();
			KiddoPaint.Display.context.lineWidth = 1.5;
			KiddoPaint.Display.context.strokeRect(tool.x, tool.y, ev._x - tool.x, ev._y - tool.y);

			KiddoPaint.Display.context.fillStyle = tool.texture();
			KiddoPaint.Display.context.fillRect(tool.x, tool.y, ev._x - tool.x, ev._y - tool.y);
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Square = new KiddoPaint.Tools.Toolbox.Square();

KiddoPaint.Tools.Toolbox.Circle = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
	this.stomp = true;
	this.texture = function() { return KiddoPaint.Textures.None(); };
	this.stroke = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.x = ev._x;
		tool.y = ev._y;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.stomp) {
				KiddoPaint.Display.clearTmp();
			}
			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.fillStyle = tool.texture();
			KiddoPaint.Display.context.strokeStyle = tool.stroke();
			KiddoPaint.Display.context.lineWidth = 1.5;
			KiddoPaint.Display.context.arc(tool.x, tool.y, Math.abs(tool.x - ev._x), 0, 2*Math.PI);
			KiddoPaint.Display.context.fill();
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Circle = new KiddoPaint.Tools.Toolbox.Circle();

KiddoPaint.Tools.Toolbox.Scribble = function() {
	var tool = this;
	this.isDown = false;
	this.previousEv = null;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };
	this.spacing = 5;
	this.size = 1;
	this.jitter = function () { return 25 + (Math.random() * 25); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Display.context.beginPath();
		KiddoPaint.Display.context.moveTo(ev._x, ev._y);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.spacing) {
			  jitterx = tool.jitter();
			  jittery = tool.jitter();
			  KiddoPaint.Display.context.lineTo(ev._x + (Math.random() * jitterx - jitterx / 2), ev._y + (Math.random() * jittery - jittery / 2));
			  KiddoPaint.Display.context.strokeStyle = tool.texture();
			  KiddoPaint.Display.context.lineWidth = tool.size;
			  KiddoPaint.Display.context.stroke();
			  tool.previousEv = ev;
			}
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			tool.previousEv = null;
			KiddoPaint.Display.context.closePath();
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Scribble = new KiddoPaint.Tools.Toolbox.Scribble();

KiddoPaint.Tools.Toolbox.Guilloche = function() {
	var tool = this;
	this.isDown = false;
	this.connected = true;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		var outradius = 41 + 64 * Math.random();
		var inradius = 21 + 42 * Math.random();
		var r = -5 * Math.random(), Q = 7 * Math.random(), m = 5 * Math.random(), n = 10 * Math.random();

		tool.isDown = true;
		KiddoPaint.Display.context.beginPath();

		KiddoPaint.Display.context.lineWidth = 0.5;
		KiddoPaint.Display.context.strokeStyle = tool.texture();
		KiddoPaint.Display.context.fillStyle = tool.texture();

		for(var i = 0; i < Math.PI * 4; i += 0.007) {
		        var coord = guil(outradius, r, m, i, inradius, Q, m, n);
			if(tool.connected) {
				KiddoPaint.Display.context.lineTo(Math.round(ev._x + coord.x), Math.round(ev._y + coord.y));
			}
			else {
				KiddoPaint.Display.context.fillRect(Math.round(ev._x + coord.x), Math.round(ev._y + coord.y), 1, 1);
			}
		}
		KiddoPaint.Display.context.stroke();
		KiddoPaint.Display.context.closePath();
	};

	this.mousemove = function (ev) { };
	this.mouseup = function (ev) { if (tool.isDown) { tool.isDown = false; KiddoPaint.Display.saveMain(); } };
};
KiddoPaint.Tools.Guilloche = new KiddoPaint.Tools.Toolbox.Guilloche();

KiddoPaint.Tools.Toolbox.Contours = function() {
	var tool = this;
	this.isDown = false;
	this.size = 2;
	this.stroke = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.modified ? KiddoPaint.Colors.randomColor() : KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.x = ev._x;
		tool.y = ev._y;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.strokeStyle = tool.stroke();
			KiddoPaint.Display.context.lineWidth = tool.size;
			KiddoPaint.Current.modifiedAlt ? KiddoPaint.Display.context.moveTo(tool.x, ev._y) : KiddoPaint.Display.context.moveTo(ev._x, tool.y);
			KiddoPaint.Display.context.lineTo(ev._x, ev._y);
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Contours = new KiddoPaint.Tools.Toolbox.Contours();

KiddoPaint.Tools.Toolbox.Astroid = function() {
	var tool = this;
	this.size = 1;
	this.stroke = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };
	this.points = [];

	// http://mathworld.wolfram.com/Astroid.html
	this.drawAstroid = function(pt1, pt2, pt3) {
		var interval = 31;

		seg1deltax = (pt2.x - pt1.x) / interval;
		seg1deltay = (pt2.y - pt1.y) / interval;

		seg2deltax = (pt3.x - pt2.x) / interval;
		seg2deltay = (pt3.y - pt2.y) / interval;
	
		for(var i = 0; i <= interval; i++) {
			var a1 = {x: pt1.x + (seg1deltax * i), y: pt1.y + (seg1deltay * i)};
			var a2 = {x: pt2.x + (seg2deltax * i), y: pt2.y + (seg2deltay * i)};
			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.moveTo(Math.round(a1.x), Math.round(a1.y));
			KiddoPaint.Display.context.lineTo(Math.round(a2.x), Math.round(a2.y));
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
		}
	}

	this.mousedown = function (ev) {
		tool.points.push({x: ev._x, y: ev._y});
	};

	this.mousemove = function (ev) {
		KiddoPaint.Display.clearTmp();
		if(tool.points.length == 1) {
			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.moveTo(Math.round(tool.points[0].x), Math.round(tool.points[0].y));
			KiddoPaint.Display.context.lineTo(ev._x,   ev._y);
			KiddoPaint.Display.context.strokeStyle = tool.stroke();
			KiddoPaint.Display.context.lineWidth = tool.size;
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
		}
		else if(tool.points.length == 2) {
			KiddoPaint.Display.context.beginPath();
			KiddoPaint.Display.context.moveTo(Math.round(tool.points[0].x), Math.round(tool.points[0].y));
			KiddoPaint.Display.context.lineTo(Math.round(tool.points[1].x), Math.round(tool.points[1].y));
//			KiddoPaint.Display.context.lineTo(ev._x,   ev._y); // some offset bug derp
			KiddoPaint.Display.context.strokeStyle = tool.stroke();
			KiddoPaint.Display.context.lineWidth = tool.size;
			KiddoPaint.Display.context.stroke();
			KiddoPaint.Display.context.closePath();
			tool.drawAstroid(tool.points[0], tool.points[1], {x: ev._x, y: ev.y});
		}
	};

	this.mouseup = function (ev) {
		if(tool.points.length == 3) {
			KiddoPaint.Display.clearTmp();
			tool.drawAstroid(tool.points[0], tool.points[1], {x: ev._x, y: ev.y});
			tool.points = [];
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Astroid = new KiddoPaint.Tools.Toolbox.Astroid();

KiddoPaint.Tools.Toolbox.Magnify = function() {
	var tool = this;
	this.isDown = false;
	this.size = 30;
	this.scale = 2;

	this.mousedown = function (ev) {
		tool.isDown = true;
	};

	this.mousemove = function (ev) {
		KiddoPaint.Display.clearTmp();
		var target = KiddoPaint.Display.main_context.getImageData(ev._x - tool.size, ev._y - tool.size, 2 * tool.size, 2 * tool.size);
		var scaled = scaleImageData(target, tool.scale);
		KiddoPaint.Display.context.putImageData(scaled, ev._x - (tool.scale * tool.size), ev._y - (tool.scale * tool.size));
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Magnify = new KiddoPaint.Tools.Toolbox.Magnify();

KiddoPaint.Tools.Toolbox.Kaleidoscope = function() {
	var tool = this;
	this.isDown = false;
	this.size = 2;
	this.origin = {};
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.previousEv = {x: 0, y: 0};
		tool.origin = ev;
		KiddoPaint.Display.context.strokeStyle = tool.texture();
		KiddoPaint.Display.context.lineWidth = tool.size;
		KiddoPaint.Display.context.beginPath();
		KiddoPaint.Display.context.save();
		KiddoPaint.Display.context.translate(ev._x, ev._y);
		KiddoPaint.Display.context.moveTo(0, 0);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			var x = tool.origin._x - ev._x;
			var y = tool.origin._y - ev._y;

			if(KiddoPaint.Current.modifiedAlt) {
				KiddoPaint.Display.context.moveTo(tool.previousEv.x, tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(x, y);
	
				KiddoPaint.Display.context.moveTo(tool.previousEv.y, tool.previousEv.x);
				KiddoPaint.Display.context.lineTo(y, x);

				KiddoPaint.Display.context.moveTo(-tool.previousEv.x, -tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(-x, -y);
	
				KiddoPaint.Display.context.moveTo(-tool.previousEv.y, -tool.previousEv.x);
				KiddoPaint.Display.context.lineTo(-y, -x);
			}
			else {
				KiddoPaint.Display.context.moveTo(tool.previousEv.x, tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(x, y);
	
				KiddoPaint.Display.context.moveTo(-tool.previousEv.x, tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(-x, y);
	
				KiddoPaint.Display.context.moveTo(tool.previousEv.x, -tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(x, -y);
	
				KiddoPaint.Display.context.moveTo(-tool.previousEv.x, -tool.previousEv.y);
				KiddoPaint.Display.context.lineTo(-x, -y);
			}

			KiddoPaint.Display.context.stroke();
			tool.previousEv = {x: x, y: y};
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.closePath();
			tool.previousEv = {x: 0, y: 0};
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
			KiddoPaint.Display.context.restore();
		}
	};
};
KiddoPaint.Tools.Kaleidoscope = new KiddoPaint.Tools.Toolbox.Kaleidoscope();
