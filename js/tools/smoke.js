KiddoPaint.Tools.Toolbox.Smoke = function() {
    var tool = this;
    this.isDown = false;
    this.party = {};

    this.mousedown = function(ev) {
        var smokeColor = color2json(KiddoPaint.Current.color);
        tool.isDown = true;
        tool.party = SmokeMachine(KiddoPaint.Display.context, [smokeColor.r, smokeColor.g, smokeColor.b]); // ;
        tool.party.start();
        setTimeout(function() {
            tool.party.addSmoke(ev._x, ev._y, 128);
            tool.party.step(10);
        }, 100);
    };

    this.mousemove = function(ev) {};

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            setTimeout(function() {
                tool.party.stop();
                KiddoPaint.Display.saveMain();
                tool.party = {};
            }, 100);
        }
    };
};
KiddoPaint.Tools.Smoke = new KiddoPaint.Tools.Toolbox.Smoke();