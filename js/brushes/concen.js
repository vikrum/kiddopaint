KiddoPaint.Brushes.Concentric = function(color1, step) {
    color1 = color1 || 'black';

    var canvasBrush = document.createElement('canvas');
    var size = ((step % 7 * 5) + 5) * KiddoPaint.Current.scaling;
    canvasBrush.width = size * 2;
    canvasBrush.height = size * 2;
    var contextBrush = canvasBrush.getContext('2d');

    contextBrush.beginPath();
    contextBrush.arc(size, size, size, 0, Math.PI * 2);
    contextBrush.strokeStyle = color1;
    contextBrush.lineWidth = 1;
    contextBrush.stroke();
    contextBrush.closePath();

    return {
        brush: canvasBrush,
        offset: size
    };
}