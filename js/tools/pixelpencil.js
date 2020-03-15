KiddoPaint.Tools.Toolbox.PixelPencil = function() {
	var tool = this;
	this.isDown = false;
	this.size = 7;
	this.previousEv = null;
	this.spacing = 10;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		var ctx = tool.isDown ? KiddoPaint.Display.context : KiddoPaint.Display.previewContext;
		ctx.fillStyle = tool.texture();
		if(KiddoPaint.Current.modifiedToggle) {
			ev._x = ev._x - (ev._x % (tool.size * KiddoPaint.Current.scaling));
			ev._y = ev._y - (ev._y % (tool.size * KiddoPaint.Current.scaling));
		}
		if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) < tool.spacing) {
			ctx.fillRect(Math.round(ev._x), Math.round(ev._y), tool.size * KiddoPaint.Current.scaling, tool.size * KiddoPaint.Current.scaling);
		}
		else {
			bresenham(tool.previousEv._x, tool.previousEv._y, ev._x, ev._y, function(x, y) {
				ctx.fillRect(Math.round(ev._x), Math.round(ev._y), tool.size * KiddoPaint.Current.scaling, tool.size * KiddoPaint.Current.scaling);
			});
		}
		tool.previousEv = ev;
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

KiddoPaint.Tools.PixelPencil = KiddoPaint.Tools.Pencil;
//KiddoPaint.Tools.PixelPencil = new KiddoPaint.Tools.Toolbox.PixelPencil();
