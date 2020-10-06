KiddoPaint.Tools.Toolbox.Circle = function() {
    var tool = this;
    this.isDown = false;
    this.size = 1;
    this.stomp = true;
    this.texture = function() {
        return KiddoPaint.Textures.None();
    };
    this.stroke = function() {
        return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
    };

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.x = ev._x;
        tool.y = ev._y;
    };

    this.mousemove = function(ev) {
        if (tool.isDown) {
            if (tool.stomp) {
                KiddoPaint.Display.clearTmp();
            }
            KiddoPaint.Display.context.beginPath();
            KiddoPaint.Display.context.fillStyle = tool.texture();
            KiddoPaint.Display.context.strokeStyle = tool.stroke();
            KiddoPaint.Display.context.lineWidth = 1.5;
            if (KiddoPaint.Current.modifiedMeta) {
                KiddoPaint.Display.context.arc((ev._x + tool.x) / 2.0, (ev._y + tool.y) / 2.0, 0.5 * distanceBetween(ev, {
                    _x: tool.x,
                    _y: tool.y
                }), 0, 2 * Math.PI);
            } else {
                KiddoPaint.Display.context.arc(tool.x, tool.y, distanceBetween(ev, {
                    _x: tool.x,
                    _y: tool.y
                }), 0, 2 * Math.PI);
            }
            KiddoPaint.Display.context.fill();
            if (!KiddoPaint.Current.modifiedCtrl) {
                KiddoPaint.Display.context.stroke();
            }
            KiddoPaint.Display.context.closePath();
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.mousemove(ev);
            tool.isDown = false;
            KiddoPaint.Display.saveMain();
        }
    };
};
KiddoPaint.Tools.Circle = new KiddoPaint.Tools.Toolbox.Circle();