KiddoPaint.Brushes.Circles = function() {
	var flip = 0;
	return function(color1, color2, alwaysFill) {
		color1 = color1 || 'black';
		color2 = color2 || color1;
		alwaysFill = alwaysFill || false;
		var size = 20;
	
		var canvasBrush = document.createElement('canvas');
		canvasBrush.width = size * 2;
		canvasBrush.height = size * 2;
		var contextBrush = canvasBrush.getContext('2d');
	
		contextBrush.beginPath();
		contextBrush.arc(size, size, 10, 0, 2 * Math.PI);
		if(alwaysFill || flip % 2 == 0) {
		  contextBrush.fillStyle = color1;
		  contextBrush.fill();
		}
		contextBrush.lineWidth = 2;
		contextBrush.strokeStyle = color2;
		contextBrush.stroke();
		contextBrush.closePath();
		flip++;
		
		return {brush: canvasBrush, offset: size};
}}();

KiddoPaint.Brushes.RCircles = function() {
	var color1 = KiddoPaint.Colors.randomColor(); 
	var color2 = KiddoPaint.Colors.randomColor(); 
	return KiddoPaint.Brushes.Circles(color1, color2, true);
}

KiddoPaint.Brushes.Spray = function(color1) {
	color1 = color1 || 'black';

	var radius = 25 * KiddoPaint.Current.scaling;
	var density = 256;

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

KiddoPaint.Brushes.Pies = function(color1) {
	color1 = color1 || 'black';

	var canvasBrush = document.createElement('canvas');
	var size = 20;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');

	contextBrush.beginPath();
	contextBrush.arc(size, size, size, 0, Math.PI * 2);
	contextBrush.fillStyle = color1;
	contextBrush.fill();
	contextBrush.closePath();

	contextBrush.globalCompositeOperation = 'destination-out';
	contextBrush.beginPath();
	contextBrush.fillStyle = color1;
	offset = Math.random() * 2 * Math.PI;
	contextBrush.arc(size, size, size + 2, 0 + offset, ((0.5 + Math.random() - 0.5) * Math.PI) + offset);
	contextBrush.lineTo(size, size);
	contextBrush.fill();
	return {brush: canvasBrush, offset: size};
}

KiddoPaint.Brushes.Concentric = function(color1, step) {
	color1 = color1 || 'black';

	var canvasBrush = document.createElement('canvas');
	var size = (step % 7 * 5) + 5;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');

	contextBrush.beginPath();
	contextBrush.arc(size, size, size, 0, Math.PI * 2);
	contextBrush.strokeStyle = color1;
	contextBrush.lineWidth = 1;
	contextBrush.stroke();
	contextBrush.closePath();

	return {brush: canvasBrush, offset: size};
}

KiddoPaint.Brushes.Twirly = function(color1, step) {
	color1 = color1 || 'black';
	step = step % 24 / 24;

	var canvasBrush = document.createElement('canvas');
	var size = 25;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');

	contextBrush.beginPath();
	contextBrush.moveTo(size, size);
	x = size + (size * Math.cos(2 * Math.PI * step));
	y = size + (size * Math.sin(2 * Math.PI * step));
	contextBrush.lineTo(x, y);
	contextBrush.strokeStyle = color1;
	contextBrush.lineWidth = 1;
	contextBrush.stroke();
	contextBrush.closePath();

	return {brush: canvasBrush, offset: size, inplace: true};
}

KiddoPaint.Brushes.FollowingSine = function(color1, step) {
	color1 = color1 || 'black';
	var interval = 50;
	step = step % interval / interval;

	var canvasBrush = document.createElement('canvas');
	var size = 33;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.fillStyle = color1;

	for(var i = 0, s = step; i < 6; i++, s += 10 / interval) {
		x = size + (size * Math.cos(2 * Math.PI * s));
		y = size + (size * Math.sin(2 * Math.PI * s));
		contextBrush.fillRect(Math.round(x), Math.round(y), 3, 3);
	}

	return {brush: canvasBrush, offset: size, inplace: true};
}

KiddoPaint.Brushes.RotatingPentagon = function(color1, step) {
	color1 = color1 || 'black';
	var interval = 50;
	step = step % interval / interval;

	var canvasBrush = document.createElement('canvas');
	var size = 33;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.fillStyle = color1;
	contextBrush.strokeStyle = color1;
	contextBrush.lineWidth = 1;

	for(var i = 0, s = step; i < 6; i++, s += 10 / interval) {
		x = size + (size * Math.cos(2 * Math.PI * s));
		y = size + (size * Math.sin(2 * Math.PI * s));
		contextBrush.lineTo(x, y);
	}

	contextBrush.stroke();
	return {brush: canvasBrush, offset: size, inplace: true};
}

KiddoPaint.Brushes.Rose = function(color1, step) {
	color1 = color1 || 'black';
	var interval = 257;
	var fraction = interval / 7;
	var k = 5;
	step = step % interval / interval;

	var canvasBrush = document.createElement('canvas');
	var size = 50;
	canvasBrush.width = size * 2;
	canvasBrush.height = size * 2;
	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.fillStyle = color1;
	contextBrush.strokeStyle = color1;

	for(var i = 0, s = step; i < 6; i++, s += fraction / interval) {
		x = size + (size * Math.cos(k * 2 * Math.PI * s) * Math.cos(2 * Math.PI * s));
		y = size + (size * Math.cos(k * 2 * Math.PI * s) * Math.sin(2 * Math.PI * s));
//		contextBrush.fillRect(Math.round(x), Math.round(y), 3, 3);
		contextBrush.lineTo(x, y);
	}
	contextBrush.stroke();

	return {brush: canvasBrush, offset: size, inplace: true};
}

