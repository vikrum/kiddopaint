KiddoPaint.Tools.Toolbox.BezFollow = function() {
    var tool = this;
    this.isDown = false;
    this.previousEv = null;
    this.spacing = 25;
    this.ylimit = {
        min: 5000,
        max: -1
    };
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
        tool.mousemove(ev);
        tool.previousEv = ev;
    };

    this.mousemove = function(ev) {
        if (tool.isDown) {
            if (ev._y < tool.ylimit.min) {
                tool.ylimit.min = ev._y;
            }
            if (ev._y > tool.ylimit.max) {
                tool.ylimit.max = ev._y;
            }

            if (tool.previousEv == null || distanceBetween(tool.previousEv, ev) > tool.spacing) {
                tool.points.push([ev._x, ev._y]);
                tool.previousEv = ev;
            }
            tool.points.forEach(pt => {
                KiddoPaint.Display.previewContext.fillStyle = '#0f0';
                KiddoPaint.Display.previewContext.fillRect(pt[0], pt[1], 5, 5);
            })
        }
    };

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            tool.points.push([ev._x, ev._y]);
            KiddoPaint.Display.clearPreview();

            // calling synthetic tools have their own propagation to main, so pause undo state capture
            KiddoPaint.Display.pauseUndo();
            renderFitLine(KiddoPaint.Display.context);
            KiddoPaint.Display.resumeUndo();

            KiddoPaint.Display.saveMain();
            tool.ylimit = {
                min: 5000,
                max: -1
            };
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
        //return getSynMeanStreak();
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
        var fitted = fitCurve(tool.points, 25); // use multiplier keys 1-9 to have some spectrum of error values
        if (fitted) {
            var oldMultiplier = KiddoPaint.Current.scaling;
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
                    KiddoPaint.Current.scaling = remap(tool.ylimit.min, tool.ylimit.max, 1, 5, fakeEv._y);
                    if (!lastSegmentEv) {
                        synthtool.mousedown(fakeEv);
                    } else {
                        synthtool.mousemove(lastSegmentEv);
                    }
                    for (var n = 0; n <= 35; n++) {
                        fakeEv = getCubicBezierXYatPercent(startPt, ctrl1, ctrl2, stopPt, n / 35.0);
                        KiddoPaint.Current.scaling = remap(tool.ylimit.min, tool.ylimit.max, 1, 5, fakeEv._y);
                        synthtool.mousemove(fakeEv);
                        //KiddoPaint.Current.scaling *= 1.002;
                    }
                    fakeEv = getCubicBezierXYatPercent(startPt, ctrl1, ctrl2, stopPt, 1);
                    KiddoPaint.Current.scaling = remap(tool.ylimit.min, tool.ylimit.max, 1, 5, fakeEv._y);
                    synthtool.mousemove(fakeEv);
                    lastSegmentEv = fakeEv;
                }
            });
            KiddoPaint.Current.scaling = remap(tool.ylimit.min, tool.ylimit.max, 1, 5, lastSegmentEv._y);
            synthtool.mouseup(lastSegmentEv);
            KiddoPaint.Current.scaling = oldMultiplier;
        }
    }
};
KiddoPaint.Tools.BezFollow = new KiddoPaint.Tools.Toolbox.BezFollow();