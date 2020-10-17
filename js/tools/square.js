KiddoPaint.Tools.Toolbox.Square = function() {
    var tool = this;
    this.isDown = false;
    this.size = 1;
    this.startEv = null;
    this.texture = function() {
        return KiddoPaint.Textures.None();
    };
    this.stroke = function() {
        return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
    };

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.startEv = ev;
    };

    this.mousemove = function(ev) {
        if (tool.startEv) {
            var ctx = tool.isDown ? KiddoPaint.Display.previewContext : KiddoPaint.Display.context;
            if (!KiddoPaint.Current.modifiedCtrl) {
                ctx.strokeStyle = tool.stroke();
                ctx.lineWidth = 1.5;
                ctx.strokeRect(tool.startEv._x, tool.startEv._y, ev._x - tool.startEv._x, ev._y - tool.startEv._y);
            }
            ctx.fillStyle = tool.texture();
            ctx.fillRect(tool.startEv._x, tool.startEv._y, ev._x - tool.startEv._x, ev._y - tool.startEv._y);
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            tool.mousemove(ev);
            KiddoPaint.Display.saveMain();
            tool.startEv = null;
        }
    };
};
KiddoPaint.Tools.Square = new KiddoPaint.Tools.Toolbox.Square();