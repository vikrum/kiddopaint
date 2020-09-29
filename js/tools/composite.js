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
    };
};
KiddoPaint.Tools.Composite = new KiddoPaint.Tools.Toolbox.Composite();