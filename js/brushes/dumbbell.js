KiddoPaint.Brushes.Dumbbell = function(color1, color2) {
    color1 = color1 || 'black';
    color2 = color2 || 'black';

    var radius = 25 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
    var density = 128 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;

    var canvasBrush = document.createElement('canvas');
    canvasBrush.width = radius * 2;
    canvasBrush.height = radius * 2;
    var contextBrush = canvasBrush.getContext('2d');
    contextBrush.fillStyle = color1;

    function bar() {
        var rr = ziggurat() * radius;
        var ra = Math.random() * 2 * Math.PI;
        var rp = Math.random() + 0.75;
        var x = Math.cos(ra) * rr;
        var y = Math.sin(ra) * rr / 9;
        contextBrush.fillRect(radius + x, radius + y, rp, rp);
    }

    for (var i = 0; i < density; i++) {
        contextBrush.globalAlpha = Math.random() / 2;
        bar();
    }
    return {
        brush: canvasBrush,
        offset: radius
    };
}