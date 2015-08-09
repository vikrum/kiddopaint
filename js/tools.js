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
	this.size = 1;
	this.texture = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			KiddoPaint.Display.context.fillStyle = tool.texture();
			KiddoPaint.Display.context.fillRect(Math.round(ev._x), Math.round(ev._y), tool.size * KiddoPaint.Current.scaling, tool.size * KiddoPaint.Current.scaling);
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
	this.previousEv = null;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > 25) {
			  var angle = tool.previousEv == null ? 0 : angleBetween(tool.previousEv, ev) + 0.5 * Math.PI;
//			  var brushFill = KiddoPaint.Brushes.Arrow(KiddoPaint.Current.color, angle);
			  var brushFill = KiddoPaint.Brushes.Arrow(KiddoPaint.Colors.randomColor(), angle);
			  KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x), Math.round(ev._y));
			  tool.previousEv = ev;
			}
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			tool.previousEv = null;
		}
	};
};
KiddoPaint.Tools.Brush = new KiddoPaint.Tools.Toolbox.Brush();
