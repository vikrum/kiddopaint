KiddoPaint.Brushes.Circles = function(color1, color2, alwaysFill) {
	color1 = color1 || 'black';
	color2 = color2 || color1;
	alwaysFill = alwaysFill || false;

	var canvasBrush = document.createElement('canvas');
	canvasBrush.width = 40;
	canvasBrush.height = 40;
	var contextBrush = canvasBrush.getContext('2d');

	contextBrush.beginPath();
	contextBrush.arc(20, 20, 10, 0, 2 * Math.PI);
	if(alwaysFill || KiddoPaint.Display.step % 2 == 0) {
	  contextBrush.fillStyle = color1;
	  contextBrush.fill();
	}
	contextBrush.lineWidth = 2;
	contextBrush.strokeStyle = color2;
	contextBrush.stroke();
	contextBrush.closePath();
	
	return canvasBrush;
}

KiddoPaint.Brushes.RCircles = function() {
	var color1 = KiddoPaint.Colors.randomColor(); 
	var color2 = KiddoPaint.Colors.randomColor(); 
	return KiddoPaint.Brushes.Circles(color1, color2, true);
}
