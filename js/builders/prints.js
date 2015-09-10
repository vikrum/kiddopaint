KiddoPaint.Builders.Prints = function(color1, print, angle) {
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

	contextBrush.font = '36px sans-serif';
	contextBrush.fillStyle = KiddoPaint.Textures.Solid(color1); 
	contextBrush.fillText(print, 3, 30);

	return canvasBrush;
}
