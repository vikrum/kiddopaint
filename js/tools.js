KiddoPaint.Tools.Toolbox = {};

KiddoPaint.Tools.Toolbox.PixelPencil = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
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

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Display.context.font = KiddoPaint.Current.modified ? "144px sans-serif" : "64px sans-serif"
		KiddoPaint.Display.context.fillStyle = 'transparent';
		KiddoPaint.Sounds.stamp();
		if(KiddoPaint.Current.modifiedAlt) {
			KiddoPaint.Display.context.save();
			KiddoPaint.Display.context.translate(ev._x, ev._y);
			KiddoPaint.Display.context.scale(-1, 1);
			KiddoPaint.Display.context.fillText(tool.stamp, 0, 0);
			KiddoPaint.Display.context.restore();
		}
		else {
			KiddoPaint.Display.context.fillText(tool.stamp, ev._x, ev._y);
		}
	};

	this.mousemove = function (ev) {
		if( ! tool.isDown) {
			KiddoPaint.Display.previewContext.font = KiddoPaint.Current.modified ? "144px sans-serif" : "64px sans-serif"
			KiddoPaint.Display.previewContext.fillStyle = 'transparent';
			if(KiddoPaint.Current.modifiedAlt) {
				KiddoPaint.Display.previewContext.save();
				KiddoPaint.Display.previewContext.translate(ev._x, ev._y);
				KiddoPaint.Display.previewContext.scale(-1, 1);
				KiddoPaint.Display.previewContext.fillText(tool.stamp, 0, 0);
				KiddoPaint.Display.previewContext.restore();
			}
			else {
				KiddoPaint.Display.previewContext.fillText(tool.stamp, ev._x, ev._y);
			}
		}
	};

	this.mouseup = function (ev) {
		tool.isDown = false;
		KiddoPaint.Display.saveMain();
	};
};
KiddoPaint.Tools.Stamp = new KiddoPaint.Tools.Toolbox.Stamp();

