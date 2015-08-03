KiddoPaint.Brushes.Arrow = function(color1) {
	color1 = color1 || 'black';

	var canvasBrush = document.createElement("canvas");
	canvasBrush.width = 43;
	canvasBrush.height = 43;
	var contextBrush = canvasBrush.getContext("2d");

	contextBrush.beginPath();
//	contextBrush.rect(0, 0, 43, 43);
//	contextBrush.translate(21, 21);
//	contextBrush.rotate(45*Math.PI/180);

	contextBrush.strokeStyle = color1;
	contextBrush.moveTo(10,0);
	contextBrush.lineTo(10,30);
	contextBrush.lineTo(13,30);
	contextBrush.lineTo(7,30);
	contextBrush.moveTo(10,0);
	contextBrush.lineTo(0,7);
	contextBrush.moveTo(10,0);
	contextBrush.lineTo(20,7);

	contextBrush.stroke();
	
	return canvasBrush;
}
