KiddoPaint.Tools.Pencil = function() {
	var tool = this;
	this.isDown = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		KiddoPaint.Display.context.beginPath();
		KiddoPaint.Display.context.moveTo(ev._x, ev._y);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.lineTo(ev._x, ev._y);
			KiddoPaint.Display.context.stroke();
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			KiddoPaint.Display.context.closePath();
			tool.isDown = false;
		}
	};
};

KiddoPaint.Tools.PixelPencil = function() {
	var tool = this;
	this.isDown = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.RSmiley();
			KiddoPaint.Display.context.fillRect(Math.round(ev._x), Math.round(ev._y), 25, 25);
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
		}
	};
};


//KiddoPaint.currentTool = new KiddoPaint.Tools.Pencil();
KiddoPaint.currentTool = new KiddoPaint.Tools.PixelPencil();
