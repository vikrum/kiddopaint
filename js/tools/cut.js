KiddoPaint.Tools.Toolbox.Cut = function() {
    var tool = this;
    this.isDown = false;
    this.size = function() {
        return 50 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
    }
    this.stomp = true;
    this.selectedData;

    this.texture = function() {
        return KiddoPaint.Textures.None();
    };


    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.x = ev._x;
        tool.y = ev._y;
        if (!KiddoPaint.Current.modifiedToggle) {
            // save previous capture to reuse; click and drag to reinstantiate
            tool.selectedData = KiddoPaint.Display.main_context.getImageData(ev._x - tool.size(), ev._y - tool.size(), 2 * tool.size(), 2 * tool.size());
        }
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        if (tool.stomp) {
            KiddoPaint.Display.clearTmp();
        }

        if (tool.isDown || (KiddoPaint.Current.modifiedToggle && tool.selectedData)) {
            if (!KiddoPaint.Current.modifiedMeta) { // preview what a cut will look like
                KiddoPaint.Display.previewContext.fillStyle = 'white';
                KiddoPaint.Display.previewContext.fillRect(tool.x - tool.size(), tool.y - tool.size(), 2 * tool.size(), 2 * tool.size());
            }
            KiddoPaint.Display.previewContext.putImageData(tool.selectedData, ev._x - tool.size(), ev._y - tool.size());
        } else {
            KiddoPaint.Display.previewContext.strokeStyle = 'grey';
            KiddoPaint.Display.previewContext.lineWidth = 0.5;
            KiddoPaint.Display.previewContext.setLineDash((KiddoPaint.Display.step % 2) ? [4] : [2]);
            KiddoPaint.Display.previewContext.strokeRect(ev._x - tool.size(), ev._y - tool.size(), 2 * tool.size(), 2 * tool.size());
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            KiddoPaint.Display.context.putImageData(tool.selectedData, ev._x - tool.size(), ev._y - tool.size());

            // Since we're manipulating main_context and we need to do it between undo() and cleartmp(), we dupe
            // and peek into abstraction here
            // KiddoPaint.Display.saveMain();
            KiddoPaint.Display.saveUndo();
            if (!KiddoPaint.Current.modifiedMeta) { // actually do the cut; and before placing the new pixels
                KiddoPaint.Display.main_context.clearRect(tool.x - tool.size(), tool.y - tool.size(), 2 * tool.size(), 2 * tool.size());
            }
            KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
            KiddoPaint.Display.clearTmp();
            KiddoPaint.Display.saveToLocalStorage();
        }
    };
};
KiddoPaint.Tools.Cut = new KiddoPaint.Tools.Toolbox.Cut();