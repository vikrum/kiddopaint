KiddoPaint.Tools.Toolbox.Pencil = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Display.context.beginPath();
		KiddoPaint.Display.context.moveTo(ev._x, ev._y);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.lineTo(ev._x, ev._y);
			KiddoPaint.Display.context.strokeStyle = tool.texture();
			KiddoPaint.Display.context.lineWidth = tool.size;
			KiddoPaint.Display.context.stroke();
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			KiddoPaint.Display.context.closePath();
			tool.isDown = false;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.Pencil = new KiddoPaint.Tools.Toolbox.Pencil();
