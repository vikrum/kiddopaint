KiddoPaint.Tools.Toolbox.Smudge = function() {
    //	 https://stackoverflow.com/a/61970857
    var tool = this;
    this.isDown = false;
    this.size = 36;

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        //var target = KiddoPaint.Display.main_context.getImageData(ev._x - tool.size, ev._y - tool.size, 2 * tool.size, 2 * tool.size);
        //var ctx = tool.isDown ? KiddoPaint.Display.context : KiddoPaint.Display.previewContext;
        //var dithered = ditherImageData(target);
        //ctx.putImageData(scaled, ev._x - (tool.scale * tool.size), ev._y - (tool.scale * tool.size));
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            KiddoPaint.Display.saveMain();
        }
    };
};
KiddoPaint.Tools.Smudge = new KiddoPaint.Tools.Toolbox.Smudge();