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
            if (tool.points.length > 20) {
                //tool.points = simplifyDouglasPeucker(tool.points, 10);
                KiddoPaint.Display.clearPreview();
                renderFitLine(KiddoPaint.Display.context);
                KiddoPaint.Display.saveMain();

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
            KiddoPaint.Display.saveMain();
        }
    };

    function offsetPoints(bezPoints, offsetAmount) {
        var startPt = bezPoints[0];
        var ctrl1 = bezPoints[1];
        var ctrl2 = bezPoints[2];
        var stopPt = bezPoints[3];

        return [
            [startPt[0] + offsetAmount, startPt[1] + offsetAmount],
            [ctrl1[0] + offsetAmount, ctrl1[1] + offsetAmount],
            [ctrl2[0] + offsetAmount, ctrl2[1] + offsetAmount],
            [stopPt[0] + offsetAmount, stopPt[1] + offsetAmount],
        ];
    }

    function renderFitLine(ctx) {
        var fitted = fitCurve(tool.points, 75); // use multiplier keys 1-9 to have some spectrum of error values
        if (fitted) {
            ctx.strokeStyle = tool.texture();
            ctx.lineWidth = tool.size();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            fitted.forEach(element => {
                for (var i = 0; i < 1; i++) {
                    var offsetElement = offsetPoints(element, 11 * i);

                    var startPt = offsetElement[0];
                    var ctrl1 = offsetElement[1];
                    var ctrl2 = offsetElement[2];
                    var stopPt = offsetElement[3];

                    ctx.beginPath();
                    ctx.moveTo(startPt[0], startPt[1]);
                    ctx.bezierCurveTo(ctrl1[0], ctrl1[1], ctrl2[0], ctrl2[1], stopPt[0], stopPt[1]);
                    ctx.stroke();
                    ctx.closePath();

                }

            });
        }
    }
};
KiddoPaint.Tools.SmoothPen = new KiddoPaint.Tools.Toolbox.SmoothPen();