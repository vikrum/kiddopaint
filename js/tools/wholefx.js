KiddoPaint.Tools.Toolbox.WholeCanvasEffect = function() {
    var tool = this;
    this.isDown = false;
    this.gfx = fx.canvas();
    this.textureGfx = {};
    this.initialClick = {};

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.initialClick = ev;
        tool.textureGfx = tool.gfx.texture(KiddoPaint.Display.main_canvas);
        KiddoPaint.Display.saveUndo();
        KiddoPaint.Display.clearMain();
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        //var target = KiddoPaint.Display.main_context.getImageData(ev._x - tool.size, ev._y - tool.size, 2 * tool.size, 2 * tool.size);
        if (tool.isDown) {
            KiddoPaint.Display.clearTmp();

            var drawDistance = distanceBetween(ev, tool.initialClick);
            var ctx = KiddoPaint.Display.context;



            // good
            //var strength = remap(0, 250, 0, 1, drawDistance);
            //var moo = tool.gfx.draw(tool.textureGfx).zoomBlur(tool.initialClick._x, tool.initialClick._y, strength).update();

            // good
            var moo = tool.gfx.draw(tool.textureGfx).hexagonalPixelate(tool.initialClick._x, tool.initialClick._y, drawDistance).update();

            // good:
            //var strength = remap(0, 250, -1, 1, drawDistance);
            //var moo = tool.gfx.draw(tool.textureGfx).ink(strength).update();

            // good:
            // var moo = tool.gfx.draw(tool.textureGfx).edgeWork(drawDistance / 2.0).update();


            ctx.drawImage(moo, 0, 0);

        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            tool.textureGfx.destroy();
            tool.textureGfx = {};
            KiddoPaint.Display.saveMainSkipUndo();
        }
    };
};
KiddoPaint.Tools.WholeCanvasEffect = new KiddoPaint.Tools.Toolbox.WholeCanvasEffect();