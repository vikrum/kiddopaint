KiddoPaint.Tools.Toolbox.Flood = function() {
	var tool = this;
	this.isDown = false;
	this.connected = true;
	this.texture = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		flood_fill( ev._x, ev._y, rgb2json(KiddoPaint.Current.color), KiddoPaint.Display.main_context, KiddoPaint.Display.canvas );
	};

	this.mousemove = function (ev) { };
	this.mouseup = function (ev) { if (tool.isDown) { tool.isDown = false; KiddoPaint.Display.saveMain(); } };
};
KiddoPaint.Tools.Flood = new KiddoPaint.Tools.Toolbox.Flood();
