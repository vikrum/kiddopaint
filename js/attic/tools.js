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

KiddoPaint.Tools.Toolbox.xBrush = function() {
	var tool = this;
	this.isDown = false;
	this.previousEv = null;
	this.texture = function() { return KiddoPaint.Current.modified ? KiddoPaint.Brushes.RCircles() : KiddoPaint.Brushes.Circles(KiddoPaint.Current.color); };

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > 25) {
			  var angle = tool.previousEv == null ? 0 : angleBetween(tool.previousEv, ev) + 0.5 * Math.PI;
			  var brushFill = tool.texture();
			  KiddoPaint.Display.context.drawImage(brushFill, Math.round(ev._x) - 20, Math.round(ev._y) - 20 );
			  tool.previousEv = ev;
			}
		}
		else {
			  var angle = tool.previousEv == null ? 0 : angleBetween(tool.previousEv, ev) + 0.5 * Math.PI;
			  var brushFill = tool.texture();
			  KiddoPaint.Display.previewContext.drawImage(brushFill, Math.round(ev._x) - 20, Math.round(ev._y - 20));
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
KiddoPaint.Tools.xBrush = new KiddoPaint.Tools.Toolbox.xBrush();
