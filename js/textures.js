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

KiddoPaint.Textures.Partial1 = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 4;
	canvasPattern.height = 2;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.fillRect(0, 0, 2, 1);
	contextPattern.fillRect(1, 1, 3, 1);
	contextPattern.fillRect(3, 0, 1, 1);
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Partial2 = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 2;
	canvasPattern.height = 2;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.fillRect(0, 0, 1, 1);
	contextPattern.fillRect(1, 1, 1, 1);
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Partial3 = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 2;
	canvasPattern.height = 2;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.fillRect(0, 0, 1, 1);
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}


KiddoPaint.Textures.PartialSquares = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 16;
	canvasPattern.height = 16;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.strokeStyle = color1;
	contextPattern.rect(0, 0, 12.5, 12.5);
	contextPattern.stroke();
	
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.PartialArtifactAlias = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 4;
	canvasPattern.height = 2;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.strokeStyle = color1;
	contextPattern.rect(0, 0, 4.5, 2.5);
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

KiddoPaint.Textures.None = function() {
	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 1;
	canvasPattern.height = 1;
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Stripes = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 4;
	canvasPattern.height = 4;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	if(KiddoPaint.Current.modifiedAlt) {
		contextPattern.fillRect(1, 0, 1, 1);
		contextPattern.fillRect(2, 1, 1, 1);
		contextPattern.fillRect(3, 2, 1, 1);
		contextPattern.fillRect(0, 3, 1, 1);
	}
	else {
		contextPattern.fillRect(0, 2, 1, 1);
		contextPattern.fillRect(1, 1, 1, 1);
		contextPattern.fillRect(2, 0, 1, 1);
		contextPattern.fillRect(3, 3, 1, 1);
	}
	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Speckles = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.fillRect(1, 0, 2, 2);
	contextPattern.fillRect(4, 0, 2, 1);
	contextPattern.fillRect(6, 1, 2, 2);
	contextPattern.fillRect(2, 3, 2, 2);
	contextPattern.fillRect(5, 4, 2, 2);
	contextPattern.fillRect(0, 5, 2, 2);
	contextPattern.fillRect(4, 7, 2, 1);

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Bubbles = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.rect(2, 0, 5, 1);
	contextPattern.rect(0, 1, 2, 1);
	contextPattern.rect(3, 1, 3, 1);
	contextPattern.rect(7, 1, 1, 1);
	contextPattern.rect(1, 2, 2, 3);
	contextPattern.rect(0, 3, 2, 3);
	contextPattern.rect(6, 2, 1, 3);
	contextPattern.rect(7, 3, 1, 3);
	contextPattern.rect(3, 5, 3, 1);
	contextPattern.rect(2, 6, 1, 2);
	contextPattern.rect(3, 7, 4, 1);
	contextPattern.rect(5, 6, 2, 1);
	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Thatch = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.rect(2, 1, 5, 1);
	contextPattern.rect(4, 0, 1, 4);
	contextPattern.rect(3, 0, 3, 3);
	contextPattern.rect(7, 0, 1, 1);
	contextPattern.rect(7, 0, 1, 1);
	contextPattern.rect(1, 2, 1, 1);
	contextPattern.rect(0, 3, 1, 5);
	contextPattern.rect(1, 4, 1, 3);
	contextPattern.rect(1, 4, 1, 3);
	contextPattern.rect(2, 5, 1, 1);
	contextPattern.rect(3, 6, 1, 1);
	contextPattern.rect(4, 7, 1, 1);
	contextPattern.rect(5, 4, 1, 1);
	contextPattern.rect(6, 5, 1, 1);
	contextPattern.rect(7, 6, 1, 1);
	contextPattern.rect(7, 4, 1, 2);
	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Shingles = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	contextPattern.rect(0, 0, 5, 1);
	contextPattern.rect(2, 1, 1, 2);
	contextPattern.rect(1, 3, 1, 1);
	contextPattern.rect(0, 4, 1, 1);
	contextPattern.rect(3, 3, 1, 1);
	contextPattern.rect(4, 4, 4, 1);
	contextPattern.rect(6, 5, 1, 2);
	contextPattern.rect(5, 7, 1, 1);
	contextPattern.rect(7, 7, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Diamond = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;
	for(var startx = 3, starty = 0; starty < 4; startx -= 1, starty += 1) {
		for(var i = 0; i < 4; i++) {
			contextPattern.rect(startx + i, starty + i, 1, 1);
		}
	}
	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Ribbon = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(4, 1, 1, 1);
	contextPattern.rect(3, 2, 1, 1);
	contextPattern.rect(2, 3, 1, 1);
	contextPattern.rect(6, 5, 1, 1);
	contextPattern.rect(7, 6, 1, 1);
	contextPattern.rect(0, 7, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Sand = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 0, 1, 1);
	contextPattern.rect(5, 1, 1, 1);
	contextPattern.rect(2, 2, 1, 1);
	contextPattern.rect(7, 3, 1, 1);
	contextPattern.rect(3, 4, 1, 1);
	contextPattern.rect(6, 5, 1, 1);
	contextPattern.rect(1, 6, 1, 1);
	contextPattern.rect(4, 7, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Brick = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 0, 1, 3);
	contextPattern.rect(0, 3, 8, 1);
	contextPattern.rect(4, 4, 1, 3);
	contextPattern.rect(0, 7, 8, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Chevron = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 5;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 0, 1, 1);
	contextPattern.rect(1, 1, 1, 1);
	contextPattern.rect(2, 2, 1, 1);
	contextPattern.rect(3, 3, 1, 1);
	contextPattern.rect(4, 4, 1, 1);
	contextPattern.rect(5, 3, 1, 1);
	contextPattern.rect(6, 2, 1, 1);
	contextPattern.rect(7, 1, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Stairs = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 0, 5, 1);
	contextPattern.rect(4, 1, 1, 4);
	contextPattern.rect(5, 4, 3, 1);
	contextPattern.rect(0, 4, 1, 4);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Cross = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	for(var i = 0; i < 8; i++) {
		contextPattern.rect(i, i, 1, 1);
	}

	for(var i = 1; i < 8; i++) {
		contextPattern.rect(i, 8 - i, 1, 1);
	}

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.DiagBrick = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(2, 0, 1, 1);
	contextPattern.rect(1, 1, 1, 1);
	contextPattern.rect(0, 2, 1, 2);
	contextPattern.rect(1, 3, 1, 1);
	contextPattern.rect(2, 4, 1, 1);
	contextPattern.rect(3, 5, 3, 1);
	contextPattern.rect(4, 6, 1, 1);
	contextPattern.rect(3, 7, 1, 1);
	contextPattern.rect(6, 4, 1, 1);
	contextPattern.rect(7, 3, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.CornerStair = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 0, 6, 2);
	contextPattern.rect(0, 2, 4, 2);
	contextPattern.rect(0, 4, 2, 2);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.CornerStair = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 8;
	canvasPattern.height = 8;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	if(KiddoPaint.Current.modifiedAlt) {
		contextPattern.rect(0, 0, 6, 2);
		contextPattern.rect(0, 2, 4, 2);
		contextPattern.rect(0, 4, 2, 2);
	}
	else {
		contextPattern.rect(2, 6, 6, 2);
		contextPattern.rect(4, 4, 4, 2);
		contextPattern.rect(6, 2, 2, 2);
	}

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}

KiddoPaint.Textures.Houndstooth = function(color1) {
	color1 = color1 || 'black';

	var canvasPattern = document.createElement('canvas');
	canvasPattern.width = 9;
	canvasPattern.height = 11;
	var contextPattern = canvasPattern.getContext('2d');
	
	contextPattern.beginPath();
	contextPattern.fillStyle = color1;

	contextPattern.rect(0, 4, 1, 2);
	contextPattern.rect(1, 3, 1, 2);
	contextPattern.rect(6, 0, 1, 1);
	contextPattern.rect(5, 1, 2, 1);
	contextPattern.rect(2, 2, 7, 1);
	contextPattern.rect(2, 3, 6, 1);
	contextPattern.rect(2, 4, 5, 2);
	contextPattern.rect(2, 6, 7, 1);
	contextPattern.rect(8, 5, 1, 1);
	contextPattern.rect(4, 7, 2, 1);
	contextPattern.rect(3, 8, 2, 1);
	contextPattern.rect(2, 9, 2, 1);
	contextPattern.rect(2, 10, 1, 1);

	contextPattern.fill();
	contextPattern.closePath();

	return KiddoPaint.Display.context.createPattern(canvasPattern, 'repeat');
}
