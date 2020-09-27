KiddoPaint.Tools.Toolbox.SmoothPen = function() {
    var tool = this;
    this.isDown = false;
    this.points = [];

    this.size = function() {
        return KiddoPaint.Tools.Pencil.size;
    }

    this.texture = function() {
        return KiddoPaint.Tools.Pencil.texture();
    };

    this.mousedown = function(ev) {
        tool.isDown = true;
        tool.points = [];
    };

    this.mousemove = function(ev) {
        if (tool.isDown) {
            tool.points.push([ev._x, ev._y]);
            if (tool.points.length > 15) {
                //tool.points = simplifyDouglasPeucker(tool.points, 10);
                KiddoPaint.Display.clearPreview();
                renderFitLine(KiddoPaint.Display.context);
                tool.points = [];
                tool.points.push([ev._x, ev._y]);
            } else {
                renderFitLine(KiddoPaint.Display.previewContext);
            }

        }
    };



    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            KiddoPaint.Display.clearPreview();
            renderFitLine(KiddoPaint.Display.context);
        }
    };

    function renderFitLine(ctx) {
        var fitted = fitCurve(tool.points, 75); // use multiplier keys 1-9 to have some spectrum of error values
        if (fitted) {
            ctx.strokeStyle = tool.texture();
            ctx.lineWidth = tool.size();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            fitted.forEach(element => {
                var startPt = element[0];
                var ctrl1 = element[1];
                var ctrl2 = element[2];
                var stopPt = element[3];

                ctx.beginPath();
                ctx.moveTo(startPt[0], startPt[1]);
                ctx.bezierCurveTo(ctrl1[0], ctrl1[1], ctrl2[0], ctrl2[1], stopPt[0], stopPt[1]);
                ctx.stroke();
                ctx.closePath();

                KiddoPaint.Display.saveMain();

            });
        }
    }
};
KiddoPaint.Tools.SmoothPen = new KiddoPaint.Tools.Toolbox.SmoothPen();