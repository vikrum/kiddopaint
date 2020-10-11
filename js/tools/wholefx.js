const JumbleFx = {
    PINCH: 'pinch',
    SWIRL: 'swirl',
    LENSBLUR: 'lensblur',
    TRIBLUR: 'triblur',
    ZOOM: 'zoom',
    HEXAGON: 'hexagon',
    INK: 'ink',
    EDGE: 'edge'
}

KiddoPaint.Tools.Toolbox.WholeCanvasEffect = function() {
    var tool = this;
    this.isDown = false;
    this.gfx = fx.canvas(); // expensive; create once
    this.textureGfx = {};
    this.initialClick = {};
    this.effect = JumbleFx.PINCH;

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.initialClick = ev;
        tool.textureGfx = tool.gfx.texture(KiddoPaint.Display.main_canvas);
        KiddoPaint.Display.saveUndo();
        KiddoPaint.Display.clearMain();
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        if (tool.isDown) {
            KiddoPaint.Display.clearTmp();
            var drawDistance = distanceBetween(ev, tool.initialClick);
            switch (tool.effect) {
                case JumbleFx.PINCH:
                    var strength = remap(0, 500, -1, 1, drawDistance);
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).bulgePinch(tool.initialClick._x, tool.initialClick._y, 200, strength).update();
                    break;
                case JumbleFx.SWIRL:
                    var horizDist = Math.abs(ev._x - tool.initialClick._x);
                    var vertDist = ev._y - tool.initialClick._y;
                    var swirlAngle = remap(-300, 300, -Math.PI * 2, Math.PI * 2, vertDist);
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).swirl(tool.initialClick._x, tool.initialClick._y, horizDist, swirlAngle).update();
                    break;
                case JumbleFx.LENSBLUR:
                    var strength = remap(0, 500, 0, 50, drawDistance);
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).lensBlur(strength, 0.88, 0.70841).update();
                    break;
                case JumbleFx.TRIBLUR:
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).triangleBlur(drawDistance / 5.0).update();
                    break;
                case JumbleFx.ZOOM:
                    var strength = remap(0, 250, 0, 1, drawDistance);
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).zoomBlur(tool.initialClick._x, tool.initialClick._y, strength).update();
                    break;
                case JumbleFx.HEXAGON:
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).hexagonalPixelate(tool.initialClick._x, tool.initialClick._y, drawDistance / 10.0).update();
                    break;
                case JumbleFx.INK:
                    var strength = remap(0, 250, -1, 1, drawDistance);
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).ink(strength).update();
                    break;
                case JumbleFx.EDGE:
                    var renderedGfx = tool.gfx.draw(tool.textureGfx).edgeWork(drawDistance / 10.0).update();
                    break;
            }
            KiddoPaint.Display.context.drawImage(renderedGfx, 0, 0);
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