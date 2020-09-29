KiddoPaint.Brushes.MeanStreak = function(step) {
    var canvasBrush = document.createElement('canvas');
    var size = 20 * KiddoPaint.Current.scaling;
    canvasBrush.width = size * 2;
    canvasBrush.height = size * 2;
    var contextBrush = canvasBrush.getContext('2d');


    var c = makeComposite('source-out');
    contextBrush.translate(size / 2, size / 2);
    contextBrush.rotate(((step % 360)) * (Math.PI / 180));
    contextBrush.translate(-size / 2, -size / 2);
    contextBrush.drawImage(c, 0, 0, c.width, c.height, 0, 0, size, size);

    //    contextBrush.fillStyle = createFeatherGradient(size, 0.5);
    //  contextBrush.globalCompositeOperation = 'destination-out';
    //  contextBrush.translate(size / 2, size / 2);
    //  contextBrush.fillRect(-size / 2, -size / 2, size, size);

    return {
        brush: canvasBrush,
        offset: size
    };
}