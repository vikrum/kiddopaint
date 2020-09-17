KiddoPaint.Builders.Rail = function(color1, angle) {
    color1 = color1 || 'black';
    angle = angle || 0;

    var canvasBrush = document.createElement('canvas');
    canvasBrush.width = 43;
    canvasBrush.height = 43;
    var contextBrush = canvasBrush.getContext('2d');

    contextBrush.beginPath();

    contextBrush.translate(21, 21);
    contextBrush.rotate(angle);
    contextBrush.translate(-15.5, -15.5);

    // left rail
    contextBrush.fillStyle = KiddoPaint.Colors.All.colorlgrey;
    contextBrush.fillRect(0.5, 0, 3, 40);
    contextBrush.fillRect(30.5, 0, 2.5, 40);

    // right rail
    contextBrush.fillStyle = KiddoPaint.Colors.All.colordgrey;
    contextBrush.fillRect(3.5, 0, 2.5, 40);
    contextBrush.fillRect(27.5, 0, 2.5, 40);

    // ties
    for (var i = 0; i < 4; i++) {
        var offset = 8 * i;
        contextBrush.fillStyle = KiddoPaint.Colors.All.colorlbrown;
        contextBrush.fillRect(0, 5.5 + offset, 35, 2);
        contextBrush.fillStyle = KiddoPaint.Colors.All.colordbrown;
        contextBrush.fillRect(0, 7 + offset, 35, 1.5);
    }
    return canvasBrush;
}