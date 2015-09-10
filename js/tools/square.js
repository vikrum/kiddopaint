KiddoPaint.Tools.Toolbox.Square = function() {
	var tool = this;
	this.isDown = false;
	this.size = 1;
	this.stomp = true;
	this.texture = function() { return KiddoPaint.Textures.None(); };
	this.stroke = function() { return KiddoPaint.Textures.Solid(KiddoPaint.Current.color); };

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
			if(!KiddoPaint.Current.modifiedCtrl) {
				KiddoPaint.Display.context.strokeStyle = tool.stroke();
				KiddoPaint.Display.context.lineWidth = 1.5;
				KiddoPaint.Display.context.strokeRect(tool.x, tool.y, ev._x - tool.x, ev._y - tool.y);
			}

			KiddoPaint.Display.context.fillStyle = tool.texture();
			KiddoPaint.Display.context.fillRect(tool.x, tool.y, ev._x - tool.x, ev._y - tool.y);
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
KiddoPaint.Tools.Square = new KiddoPaint.Tools.Toolbox.Square();
