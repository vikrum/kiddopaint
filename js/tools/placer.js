KiddoPaint.Tools.Toolbox.Placer = function() {
    var tool = this;
    this.isDown = false;
    this.image = {};
    this.prevTool = {};
    this.size = {};

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        var ctx = tool.isDown ? KiddoPaint.Display.context : KiddoPaint.Display.previewContext;
        if (KiddoPaint.Current.modifiedRange != 0) {
            var scale = 1 + KiddoPaint.Current.modifiedRange / 100.0;
            var scaledImg = scaleImageDataCanvasAPI(tool.image, scale);
            ctx.drawImage(scaledImg, ev._x - scaledImg.width / 2, ev._y - scaledImg.height / 2);
        } else {
            ctx.drawImage(tool.image, ev._x - tool.size.width / 2, ev._y - tool.size.height / 2);
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            tool.image = {};
            KiddoPaint.Display.saveMain();
            KiddoPaint.Current.tool = tool.prevTool;
            reset_ranges();
            tool.prevTool = {};
            tool.size = {};
        }
    };
};
KiddoPaint.Tools.Placer = new KiddoPaint.Tools.Toolbox.Placer();