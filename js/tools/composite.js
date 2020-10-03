KiddoPaint.Tools.Toolbox.Composite = function() {
    var tool = this;
    this.composed = [];

    this.compose = function(t) {
        tool.composed.push(t);
    }

    this.clearComposed = function() {
        tool.composed.length = 0;
    }

    this.mousedown = function(ev) {
        // composites will be doing many saveMains, so keep state here including
        // undo state, then pause undo state saving for all subsequent steps.
        KiddoPaint.Display.saveMain();
        KiddoPaint.Display.pauseUndo();
        for (const ctool of tool.composed) {
            ctool.mousedown(ev);
        }
    };

    this.mousemove = function(ev) {
        for (const ctool of tool.composed) {
            ctool.mousemove(ev);
        }
    };

    this.mouseup = function(ev) {
        for (const ctool of tool.composed) {
            ctool.mouseup(ev);
        }
        // ... everything in between should have done saveMains, so all the composite's
        // intermediate preview, tmp contexts, etc are already on main. and we've ignored
        // all the undo states inbetween. turn it back on now
        KiddoPaint.Display.resumeUndo();
    };
};
KiddoPaint.Tools.Composite = new KiddoPaint.Tools.Toolbox.Composite();