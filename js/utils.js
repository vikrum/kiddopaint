function distanceBetween(ev1, ev2) {
  var deltaxsq = (ev2._x - ev1._x) * (ev2._x - ev1._x);
  var deltaysq = (ev2._y - ev1._y) * (ev2._y - ev1._y);
  return Math.sqrt(deltaxsq + deltaysq);
}

function angleBetween(ev1, ev2) {
  var y = ev2._y - ev1._y;
  var x = ev2._x - ev1._x;
  var angle = Math.atan( y / ( x == 0 ? 0.001 : x) ) + (x < 0 ? Math.PI : 0);
  return angle;
}

// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// http://stackoverflow.com/questions/29156849/html5-canvas-changing-image-color
function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if(max == min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return({ h:h, s:s, l:l });
}

function hslToRgb(h, s, l){
  var r, g, b;
  if(s == 0){
    r = g = b = l; // achromatic
  }else{
    function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return({
    r:Math.round(r * 255),
    g:Math.round(g * 255),
    b:Math.round(b * 255),
  });
}

function hueShift(canvas, context, shift) {
  if(shift === 0) return;
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var rawData = imageData.data;
  for(var i = 0; i < rawData.length; i += 4) {
    var red = rawData[i + 0];
    var green = rawData[i + 1];
    var blue = rawData[i + 2];
    var alpha = rawData[i + 3];
    if(red === 0 && green === 0 && blue === 0 && alpha === 0) continue;

    var hsl = rgbToHsl(red, green, blue);

    var shiftedRgb = hslToRgb(hsl.h + shift, hsl.s, hsl.l);
    rawData[i + 0] = shiftedRgb.r;
    rawData[i + 1] = shiftedRgb.g;
    rawData[i + 2] = shiftedRgb.b;
    rawData[i + 3] = alpha;
  }
  context.putImageData(imageData, 0, 0);
}

function ziggurat() {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function makeIcon(texture) {
	var canvasIcon = document.createElement('canvas');
	canvasIcon.width = 50;
	canvasIcon.height = 50;
	var contextIcon = canvasIcon.getContext('2d');
	
	contextIcon.beginPath();
	contextIcon.lineWidth = 1;
	contextIcon.strokeRect(10, 10, 30, 30);
	contextIcon.fillStyle = texture();
	contextIcon.fillRect(10, 10, 30, 30);
	contextIcon.closePath();

	return canvasIcon.toDataURL();
}

function makeCircleIcon(texture) {
	var canvasIcon = document.createElement('canvas');
	canvasIcon.width = 50;
	canvasIcon.height = 50;
	var contextIcon = canvasIcon.getContext('2d');
	
	contextIcon.beginPath();
	contextIcon.lineWidth = 1;
	contextIcon.fillStyle = texture();
	contextIcon.arc(25, 25, 15, 0, 2*Math.PI);
	contextIcon.fill();
	contextIcon.stroke();
	contextIcon.closePath();

	return canvasIcon.toDataURL();
}

function guil(R, r, m, theta, p, Q, m, n) {
  var x = (R + r) * Math.cos(m * theta) + (r + p) * Math.cos( ( (R + r) / r )  * m * theta  ) + Q * Math.cos(n * theta);
  var y = (R + r) * Math.sin(m * theta) - (r + p) * Math.sin( ( (R + r) / r )  * m * theta  ) + Q * Math.sin(n * theta);
  return {x: x, y: y};
}

// http://stackoverflow.com/a/9138593
function scaleImageData(imageData, scale) {
	var scaled = KiddoPaint.Display.main_context.createImageData(imageData.width * scale, imageData.height * scale);
	for(var row = 0; row < imageData.height; row++) {
		for(var col = 0; col < imageData.width; col++) {
			var sourcePixel = (imageData.data[(row * imageData.width + col) * 4 + 0] == 0 && imageData.data[(row * imageData.width + col) * 4 + 1] == 0 && imageData.data[(row * imageData.width + col) * 4 + 2] == 0 && imageData.data[(row * imageData.width + col) * 4 + 3] == 0) ? [255, 255, 255, 255] : [ imageData.data[(row * imageData.width + col) * 4 + 0], imageData.data[(row * imageData.width + col) * 4 + 1], imageData.data[(row * imageData.width + col) * 4 + 2], imageData.data[(row * imageData.width + col) * 4 + 3] ];
			for(var y = 0; y < scale; y++) {
				var destRow = row * scale + y;
				for(var x = 0; x < scale; x++) {
					var destCol = col * scale + x;
					for(var i = 0; i < 4; i++) {
						if(sourcePixel[i] == 0 ) {
							scaled.data[(destRow * scaled.width + destCol) * 4 + i] = [255, 255, 255, 255];
						}
						else {
							scaled.data[(destRow * scaled.width + destCol) * 4 + i] = sourcePixel[i];
						}
					}
				}
			}
		}
	}
	return scaled;
}
