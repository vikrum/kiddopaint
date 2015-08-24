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
	this.offset = 25;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.spacing) {
			  var brushFill = tool.texture(tool.step);
			  KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x - tool.offset), Math.round(ev._y - tool.offset));
			  tool.previousEv = ev;
			  tool.step += 1;
			}
		}
		else {
			  var brushFill = tool.texture(0);
			  KiddoPaint.Display.previewContext.drawImage(brushFill, Math.round(ev._x - tool.offset), Math.round(ev._y - tool.offset));
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			tool.previousEv = null;
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

			return KiddoPaint.Stamps.stamp(tool.stamp, KiddoPaint.Current.modifiedAlt, tool.size, hueShift, tool.useColor ? KiddoPaint.Current.color : 'transparent' );
	};

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Sounds.stamp();

		KiddoPaint.Display.context.fillStyle = tool.useColor ? KiddoPaint.Current.color : 'transparent';
		var brushFill = tool.texture();
		KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y - tool.size));
	};

	this.mousemove = function (ev) {
		if( ! tool.isDown) {
			KiddoPaint.Display.previewContext.fillStyle = tool.useColor ? KiddoPaint.Current.color : 'transparent';
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
