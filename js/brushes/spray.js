KiddoPaint.Brushes.Spray = function(color1) {
    color1 = color1 || 'black';

    var radius = 10 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
    var density = 128 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;

    var canvasBrush = document.createElement('canvas');
    canvasBrush.width = radius * 2;
    canvasBrush.height = radius * 2;
    var contextBrush = canvasBrush.getContext('2d');
    contextBrush.fillStyle = color1;

    function ring() {
        var theta = Math.random() * 2 * Math.PI;
        var r1 = radius;
        var r2 = radius * 0.75;
        var rp = Math.random() + 0.75;

        var dist = Math.sqrt(Math.random() * ((r1 * r1) - (r2 * r2)) + (r2 * r2))
        var xr = dist * Math.cos(theta);
        var yr = dist * Math.sin(theta);
        contextBrush.fillRect(radius + xr, radius + yr, rp, rp);

    }

    function disc() {
        // disc
        var rr = ziggurat() * radius * 1.5;
        var ra = Math.random() * 2 * Math.PI;
        var rp = Math.random() + 0.75;
        var x = Math.cos(ra) * rr;
        var y = Math.sin(ra) * rr;
        contextBrush.fillRect(radius + x, radius + y, rp, rp);

    }

    for (var i = 0; i < density; i++) {
        contextBrush.globalAlpha = Math.random() / 2;
        if (KiddoPaint.Current.modifiedToggle) {
            ring();
            if (KiddoPaint.Current.modifiedMeta) {
                disc();
            }
        } else {
            disc();
        }
    }
    return {
        brush: canvasBrush,
        offset: radius
    };
}