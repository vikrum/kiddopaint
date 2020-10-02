KiddoPaint.Tools.Toolbox.BezFollow = function() {
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
            /*
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
            */

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

    function getSynthesizedTool() {
        return getSynSprayBrush();
    }

    function getSynSprayBrush() {
        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function() {
            return KiddoPaint.Brushes.Spray(KiddoPaint.Current.color, KiddoPaint.Current.terColor)
        };
        KiddoPaint.Tools.PlainBrush.preprocess = function() {
            KiddoPaint.Display.context.shadowBlur = 16;
            KiddoPaint.Display.context.shadowColor = KiddoPaint.Current.altColor;
        };
        KiddoPaint.Tools.PlainBrush.postprocess = function() {
            KiddoPaint.Display.context.shadowBlur = 0;
            KiddoPaint.Display.context.shadowColor = null;
        };
        return KiddoPaint.Tools.PlainBrush;
    }

    function getSynMeanStreak() {
        KiddoPaint.Tools.Composite.clearComposed();

        KiddoPaint.Tools.PlainBrush.reset();
        KiddoPaint.Tools.PlainBrush.spacing = 0;
        KiddoPaint.Tools.PlainBrush.texture = function(step) {
            return KiddoPaint.Brushes.MeanStreak(step)
        };

        KiddoPaint.Tools.Composite.compose(KiddoPaint.Tools.PlainBrush);

        KiddoPaint.Tools.Smudge.size = 15;
        KiddoPaint.Tools.Composite.compose(KiddoPaint.Tools.Smudge);

        return KiddoPaint.Tools.Composite;
    }

    function renderFitLine(ctx) {
        var fitted = fitCurve(tool.points, 50); // use multiplier keys 1-9 to have some spectrum of error values
        if (fitted) {
            var synthtool = getSynthesizedTool();
            var lastSegmentEv = null;
            fitted.forEach(element => {
                for (var i = 0; i < 1; i++) {
                    var offsetElement = offsetPoints(element, 11 * i);

                    var startPt = offsetElement[0];
                    var ctrl1 = offsetElement[1];
                    var ctrl2 = offsetElement[2];
                    var stopPt = offsetElement[3];

                    var fakeEv = getCubicBezierXYatPercent(startPt, ctrl1, ctrl2, stopPt, 0);
                    if (!lastSegmentEv) {
                        synthtool.mousedown(fakeEv);
                    } else {
                        synthtool.mousemove(lastSegmentEv);
                    }
                    for (var n = 0; n < 33; n++) {
                        fakeEv = getCubicBezierXYatPercent(startPt, ctrl1, ctrl2, stopPt, n / 32.0);
                        synthtool.mousemove(fakeEv);
                    }
                    fakeEv = getCubicBezierXYatPercent(startPt, ctrl1, ctrl2, stopPt, 1);
                    synthtool.mousemove(fakeEv);
                    lastSegmentEv = fakeEv;
                }
            });
            synthtool.mouseup(lastSegmentEv);
        }
    }
};
KiddoPaint.Tools.BezFollow = new KiddoPaint.Tools.Toolbox.BezFollow();