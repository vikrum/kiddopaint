KiddoPaint.Textures.Solid = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 1;
	canvasPattern.height = 1;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.strokeStyle = color1;
	contextPattern.rect(0, 0, 1, 1);
	contextPattern.stroke();
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Smiley = function(color1, color2, color3, color4) {
	color1 = color1 || 'black';
	color2 = color2 || color1 || 'black';
	color3 = color3 || color1 || 'black';
	color4 = color4 || color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 20;
	canvasPattern.height = 20;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();

	contextPattern.strokeStyle = color1;
	contextPattern.strokeRect(0.5, 0.5, 20, 20);

	contextPattern.strokeStyle = color2;
	contextPattern.arc(10.5, 10.5, 7, 0, Math.PI);

	contextPattern.strokeStyle = color3;
	contextPattern.rect(5, 5, 1, 1);

	contextPattern.strokeStyle = color4;
	contextPattern.rect(15, 5, 1, 1);
	contextPattern.stroke();
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.RSmiley = function() {
  color1 = KiddoPaint.Colors.randomColor();
  color2 = KiddoPaint.Colors.randomColor();
  color3 = KiddoPaint.Colors.randomColor();
  color4 = KiddoPaint.Colors.randomColor();
  return KiddoPaint.Textures.Smiley(color1, color2, color3, color4);
}

KiddoPaint.Textures.RSolid = function() {
  color1 = KiddoPaint.Colors.randomColor();
  return KiddoPaint.Textures.Solid(color1);
}

