KiddoPaint.Tools.Toolbox.Cut = function() {
    var tool = this;
    this.isDown = false;
    this.size = function() {
        return {
            x: 50 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier * ((KiddoPaint.Current.modifiedCtrlRange + 100) / 100),
            y: 50 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier * ((KiddoPaint.Current.modifiedAltRange + 100) / 100)
        }
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
        sizex = tool.size().x;
        sizey = tool.size().y;
        if (!KiddoPaint.Current.modifiedToggle) {
            // save previous capture to reuse; click and drag to reinstantiate
            tool.selectedData = KiddoPaint.Display.main_context.getImageData(ev._x - sizex, ev._y - sizey, 2 * sizex, 2 * sizey);
        }
        tool.mousemove(ev);
    };

    this.mousemove = function(ev) {
        sizex = tool.size().x;
        sizey = tool.size().y;

        if (tool.stomp) {
            KiddoPaint.Display.clearTmp();
        }

        if (tool.isDown || (KiddoPaint.Current.modifiedToggle && tool.selectedData)) {
            if (KiddoPaint.Current.modifiedMeta) { // preview what a cut will look like
                KiddoPaint.Display.previewContext.fillStyle = 'white';
                KiddoPaint.Display.previewContext.fillRect(tool.x - sizex, tool.y - sizey, 2 * sizex, 2 * sizey);
            }
            KiddoPaint.Display.previewContext.putImageData(tool.selectedData, ev._x - sizex, ev._y - sizey);
        } else {
            KiddoPaint.Display.previewContext.strokeStyle = 'white';
            KiddoPaint.Display.previewContext.lineWidth = 0.5;
            KiddoPaint.Display.previewContext.setLineDash((KiddoPaint.Display.step % 2) ? [4] : [2]);
            KiddoPaint.Display.previewContext.strokeRect(ev._x - sizex, ev._y - sizey, 2 * sizex, 2 * sizey);
            KiddoPaint.Display.previewContext.strokeStyle = 'black';
            KiddoPaint.Display.previewContext.strokeRect(ev._x - sizex, ev._y - sizey, 2 * sizex + 1, 2 * sizey + 1);

        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            sizex = tool.size().x;
            sizey = tool.size().y;
            tool.isDown = false;
            KiddoPaint.Display.context.putImageData(tool.selectedData, ev._x - sizex, ev._y - sizey);

            // Since we're manipulating main_context and we need to do it between undo() and cleartmp(), we dupe
            // and peek into abstraction here
            // KiddoPaint.Display.saveMain();
            KiddoPaint.Display.saveUndo();
            if (KiddoPaint.Current.modifiedMeta) { // actually do the cut; and before placing the new pixels
                KiddoPaint.Display.main_context.clearRect(tool.x - sizex, tool.y - sizey, 2 * sizex, 2 * sizey);
            }
            KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
            KiddoPaint.Display.clearTmp();
            KiddoPaint.Display.saveToLocalStorage();
        }
    };
};
KiddoPaint.Tools.Cut = new KiddoPaint.Tools.Toolbox.Cut();