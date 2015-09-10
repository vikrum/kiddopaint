KiddoPaint.Tools.Toolbox.PlainBrush = function() {
	var tool = this;
	this.isDown = false;
	this.previousEv = null;
	this.texture = function() { };
	this.spacing = 5;
	this.step = 0;

	this.mousedown = function (ev) {
		tool.isDown = true;
		tool.mousemove(ev);
		tool.previousEv = ev;
	};

	this.mousemove = function (ev) {
		if (tool.isDown) {
			if(tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.spacing) {
			  var brushFill = tool.texture(tool.step);
			  KiddoPaint.Display.context.drawImage(brushFill.brush, Math.round(ev._x - brushFill.offset), Math.round(ev._y - brushFill.offset));
			  tool.previousEv = ev;
			  tool.step += 1;
			}
		}
		else {
			  var brushFill = tool.texture(0);
			  KiddoPaint.Display.previewContext.drawImage(brushFill.brush, Math.round(ev._x - brushFill.offset), Math.round(ev._y - brushFill.offset));
		}
	};

	this.mouseup = function (ev) {
		if (tool.isDown) {
			tool.mousemove(ev);
			tool.isDown = false;
			tool.previousEv = null;
			tool.step = 0;
			KiddoPaint.Display.saveMain();
		}
	};
};
KiddoPaint.Tools.PlainBrush = new KiddoPaint.Tools.Toolbox.PlainBrush();
