KiddoPaint.Builders.Arrow = function(color1, angle) {
	color1 = color1 || 'black';
	angle = angle || 0;

	var canvasBrush = document.createElement('canvas');
	canvasBrush.width = 43;
	canvasBrush.height = 43;
	var contextBrush = canvasBrush.getContext('2d');

	contextBrush.beginPath();
//	contextBrush.rect(0, 0, 43, 43);

	contextBrush.translate(21, 21);
	contextBrush.rotate(angle);
	contextBrush.translate(-10.5, -15.5);

	contextBrush.strokeStyle = color1;

	contextBrush.moveTo(10,0);
	contextBrush.lineTo(10,30);
	contextBrush.moveTo(10,0);
	contextBrush.lineTo(0,7);
	contextBrush.moveTo(10,0);
	contextBrush.lineTo(20,7);

	contextBrush.stroke();
	
	return canvasBrush;
}
