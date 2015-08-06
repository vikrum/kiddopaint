KiddoPaint.Tools.Toolbox = {};
KiddoPaint.Tools.Toolbox.Pencil = function() {
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
KiddoPaint.Tools.Pencil = new KiddoPaint.Tools.Toolbox.Pencil();

KiddoPaint.Tools.Toolbox.PixelPencil = function() {
	var tool = this;
	this.isDown = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
//			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.RSmiley();
//			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.Smiley(KiddoPaint.Current.color);
//			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.Partial1(KiddoPaint.Current.color);
//			KiddoPaint.Display.context.fillStyle = KiddoPaint.Textures.RSolid();
//			KiddoPaint.Display.context.fillStyle = KiddoPaint.Current.color;
			KiddoPaint.Display.context.fillRect(Math.round(ev._x), Math.round(ev._y), 5 * KiddoPaint.Current.Scaling, 5 * KiddoPaint.Current.Scaling);
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
		}
	};
};
KiddoPaint.Tools.PixelPencil = new KiddoPaint.Tools.Toolbox.PixelPencil();

KiddoPaint.Tools.Toolbox.Brush = function() {
	var tool = this;
	this.isDown = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			var brushFill = KiddoPaint.Brushes.Arrow(KiddoPaint.Current.color);
//			var brushFill = KiddoPaint.Brushes.Arrow(KiddoPaint.Colors.randomColor());
			KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y));

		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
		}
	};
};
KiddoPaint.Tools.Brush = new KiddoPaint.Tools.Toolbox.Brush();
