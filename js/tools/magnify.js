KiddoPaint.Tools.Toolbox.Magnify = function() {
    var tool = this;
    this.isDown = false;
    this.size = function() {
        return 36 * KiddoPaint.Current.scaling
    };
    this.scale = 2;

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        var target = KiddoPaint.Display.main_context.getImageData(ev._x - tool.size(), ev._y - tool.size(), 2 * tool.size(), 2 * tool.size());
        var ctx = tool.isDown ? KiddoPaint.Display.context : KiddoPaint.Display.previewContext;
        if (KiddoPaint.Current.modifiedAlt) {
            var dithered = ditherImageData(target);
            ctx.putImageData(dithered, ev._x - tool.size(), ev._y - tool.size());
        } else if (KiddoPaint.Current.modifiedCtrl) {
            var grey = greyscaleImageData(target);
            ctx.putImageData(grey, ev._x - tool.size(), ev._y - tool.size());
        } else {
            var scaled = KiddoPaint.Current.modifiedAlt ? ditherImageData(target) : scaleImageData(target, tool.scale);
            ctx.putImageData(scaled, ev._x - (tool.scale * tool.size()), ev._y - (tool.scale * tool.size()));
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            KiddoPaint.Display.saveMain();
        }
    };
};
KiddoPaint.Tools.Magnify = new KiddoPaint.Tools.Toolbox.Magnify();