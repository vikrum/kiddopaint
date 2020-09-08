KiddoPaint.Brushes.Spray = function(color1) {
	color1 = color1 || 'black';

	var radius = 25 * KiddoPaint.Current.scaling;
	var density = 256 * KiddoPaint.Current.scaling;

	var canvasBrush = document.createElement('canvas');
	canvasBrush.width = radius * 2;
	canvasBrush.height = radius * 2;
	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.fillStyle = color1;

	for(var i = 0; i < density; i++) {
		contextBrush.globalAlpha = Math.random() / 2;
		var rr = ziggurat() * radius * 1.5;
		var ra = Math.random() * 2 * Math.PI;
		var rp = Math.random() + 0.75;
		x = Math.cos(ra) * rr;
		y = Math.sin(ra) * rr;
		contextBrush.fillRect(radius + x, radius + y, rp, rp);
	}
	return {brush: canvasBrush, offset: radius};
}
