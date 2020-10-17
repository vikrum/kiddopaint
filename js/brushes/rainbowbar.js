KiddoPaint.Brushes.RainbowBar = function(step) { // https://stackoverflow.com/questions/22223950/angle-gradient-in-canvas
    var canvas = document.createElement('canvas');
    var size = 50 * KiddoPaint.Current.scaling;
    canvas.width = size * 2;
    canvas.height = size * 2;
    var ctx = canvas.getContext('2d');

    var gradient = ctx.createLinearGradient(10, 0, 100, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1 / 6, 'orange');
    gradient.addColorStop(2 / 6, 'yellow');
    gradient.addColorStop(3 / 6, 'green');
    gradient.addColorStop(4 / 6, 'blue');
    gradient.addColorStop(5 / 6, 'indigo');
    gradient.addColorStop(1, 'violet');
    ctx.fillStyle = gradient;
    ctx.rotate(20 * Math.PI / 180);
    ctx.fillRect(0, 0, 100, 16);

    return {
        brush: canvas,
        offset: size / 2.0
    };
}