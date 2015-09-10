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
		if(KiddoPaint.Current.modifiedToggle) {
			ev._x = ev._x - (ev._x % (tool.size * KiddoPaint.Current.scaling));
			ev._y = ev._y - (ev._y % (tool.size * KiddoPaint.Current.scaling));
		}
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
