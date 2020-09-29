function distanceBetween(ev1, ev2) {
    var deltaxsq = (ev2._x - ev1._x) * (ev2._x - ev1._x);
    var deltaysq = (ev2._y - ev1._y) * (ev2._y - ev1._y);
    return Math.sqrt(deltaxsq + deltaysq);
}

function angleBetween(ev1, ev2) {
    var y = ev2._y - ev1._y;
    var x = ev2._x - ev1._x;
    var angle = Math.atan(y / (x == 0 ? 0.001 : x)) + (x < 0 ? Math.PI : 0);
    return angle;
}

function angleBetweenRad(ev1, ev2) {
    return Math.atan2(ev2._x - ev1._x, ev2._y - ev1._y);
}


// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// http://stackoverflow.com/questions/29156849/html5-canvas-changing-image-color
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return ({
        h: h,
        s: s,
        l: l
    });
}

function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return ({
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    });
}

function hueShift(canvas, context, shift) {
    if (shift === 0) return;
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var rawData = imageData.data;
    for (var i = 0; i < rawData.length; i += 4) {
        var red = rawData[i + 0];
        var green = rawData[i + 1];
        var blue = rawData[i + 2];
        var alpha = rawData[i + 3];
        if (red === 0 && green === 0 && blue === 0 && alpha === 0) continue;

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
    contextIcon.arc(25, 25, 15, 0, 2 * Math.PI);
    contextIcon.fill();
    contextIcon.stroke();
    contextIcon.closePath();

    return canvasIcon.toDataURL();
}

function guil(R, r, m, theta, p, Q, m, n) {
    var x = (R + r) * Math.cos(m * theta) + (r + p) * Math.cos(((R + r) / r) * m * theta) + Q * Math.cos(n * theta);
    var y = (R + r) * Math.sin(m * theta) - (r + p) * Math.sin(((R + r) / r) * m * theta) + Q * Math.sin(n * theta);
    return {
        x: x,
        y: y
    };
}

function scaleImageData(imageData, scale) {
    return scaleImageDataPixelwise(imageData, scale);
    //return scaleImageDataCanvasAPI(imageData, scale);
}

// https://stackoverflow.com/a/40772881 doesn't handle alpha well wrt to emojis etc
function scaleImageDataCanvasAPI(imageData, scale) {
    var canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext("2d").putImageData(imageData, 0, 0);

    var scaleCanvas = document.createElement('canvas');
    scaleCanvas.width = imageData.width * scale;
    scaleCanvas.height = imageData.height * scale;
    var scaleCtx = scaleCanvas.getContext("2d");
    scaleCtx.scale(scale, scale);
    scaleCtx.drawImage(canvas, 0, 0);

    var scaledImageData = scaleCtx.getImageData(0, 0, scaleCanvas.width * scale, scaleCanvas.height * scale);
    return scaledImageData;
}

// http://stackoverflow.com/a/9138593 w/ alpha bg flattening
function scaleImageDataPixelwise(imageData, scale) {
    var scaled = KiddoPaint.Display.main_context.createImageData(imageData.width * scale, imageData.height * scale);
    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = (imageData.data[(row * imageData.width + col) * 4 + 0] == 0 && imageData.data[(row * imageData.width + col) * 4 + 1] == 0 && imageData.data[(row * imageData.width + col) * 4 + 2] == 0 && imageData.data[(row * imageData.width + col) * 4 + 3] == 0) ? [255, 255, 255, 255] : [imageData.data[(row * imageData.width + col) * 4 + 0], imageData.data[(row * imageData.width + col) * 4 + 1], imageData.data[(row * imageData.width + col) * 4 + 2], imageData.data[(row * imageData.width + col) * 4 + 3]];
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                for (var x = 0; x < scale; x++) {
                    var destCol = col * scale + x;
                    for (var i = 0; i < 4; i++) {
                        if (sourcePixel[i] == 0) {
                            scaled.data[(destRow * scaled.width + destCol) * 4 + i] = [255, 255, 255, 255];
                        } else {
                            scaled.data[(destRow * scaled.width + destCol) * 4 + i] = sourcePixel[i];
                        }
                    }
                }
            }
        }
    }
    return scaled;
}

function greyscaleImageData(imageData) {
    var grey = KiddoPaint.Display.main_context.createImageData(imageData.width, imageData.height);
    var imageDataLength = imageData.data.length;
    for (var pixel = 0; pixel <= imageDataLength; pixel += 4) {
        if (imageData.data[pixel] == 0 && imageData.data[pixel + 1] == 0 && imageData.data[pixel + 2] == 0 && imageData.data[pixel + 3] == 0) continue;

        // simple
        //    var avg = (imageData.data[pixel] + imageData.data[pixel + 1] + imageData.data[pixel + 2]) / 3.0;
        //    grey.data[pixel] = grey.data[pixel + 1] = grey.data[pixel + 2] = avg;


        var hsl = rgbToHsl(imageData.data[pixel], imageData.data[pixel + 1], imageData.data[pixel + 2]);
        var desat = hslToRgb(hsl.h, 0, hsl.l);

        grey.data[pixel + 0] = desat.r;
        grey.data[pixel + 1] = desat.g;
        grey.data[pixel + 2] = desat.b;
        grey.data[pixel + 3] = imageData.data[pixel + 3]; // keep same alpha
    }
    return grey;

}

// https://github.com/meemoo/iframework/blob/gh-pages/src/nodes/image-monochrome-worker.js
function ditherImageData(imageData) {
    var threshold = 128;
    var bayerThresholdMap = [
        [15, 135, 45, 165],
        [195, 75, 225, 105],
        [60, 180, 30, 150],
        [240, 120, 210, 90]
    ];
    var lumR = [],
        lumG = [],
        lumB = [];
    for (var i = 0; i < 256; i++) {
        lumR[i] = i * 0.299;
        lumG[i] = i * 0.587;
        lumB[i] = i * 0.114;
    }

    var dithered = KiddoPaint.Display.main_context.createImageData(imageData.width, imageData.height);

    var imageDataLength = imageData.data.length;
    for (var i = 0; i <= imageDataLength; i += 4) {
        dithered.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i + 1]] + lumB[imageData.data[i + 2]]);
    }

    for (var pixel = 0; pixel <= imageDataLength; pixel += 4) {
        if (imageData.data[pixel] == 0 && imageData.data[pixel + 1] == 0 && imageData.data[pixel + 2] == 0 && imageData.data[pixel + 3] == 0) continue;
        var x = pixel / 4 % imageData.width;
        var y = Math.floor(pixel / 4 / imageData.width);
        var map = Math.floor((imageData.data[pixel] + bayerThresholdMap[x % 4][y % 4]) / 2);
        dithered.data[pixel] = dithered.data[pixel + 1] = dithered.data[pixel + 2] = (map < threshold) ? 0 : 255;
        dithered.data[pixel + 3] = 255;
    }
    return dithered;
}

// http://michalbe.blogspot.com/2011/02/javascript-random-numbers-with-custom_23.html
function srng(seed) {
    seed = seed || 7;
    var constant = Math.pow(2, 11) + 1;
    var prime = 4241;
    var maximum = 4243;
    return {
        next: function() {
            seed *= constant;
            seed += prime;
            return seed % maximum / maximum;
        }
    }
}

// https://stackoverflow.com/questions/17924214/canvas-how-would-you-properly-interpolate-between-two-points-using-bresenhams
function bresenham(x1, y1, x2, y2, callback) {
    var dx = x2 - x1;
    var sx = 1;
    var dy = y2 - y1;
    var sy = 1;
    var space = 0;
    var spacing = 17;

    if (dx < 0) {
        sx = -1;
        dx = -dx;
    }

    if (dy < 0) {
        sy = -1;
        dy = -dy;
    }

    dx = dx << 1;
    dy = dy << 1;

    if (dy < dx) {
        var fraction = dy - (dx >> 1);

        while (x1 != x2) {
            if (fraction >= 0) {
                y1 += sy;
                fraction -= dx;
            }

            fraction += dy;
            x1 += sx;

            if (space == spacing) {
                callback(x1, y1);
                space = 0;
            } else {
                space += 1;
            }
        }
    } else {
        var fraction = dx - (dy >> 1);

        while (y1 != y2) {
            if (fraction >= 0) {
                x1 += sx;
                fraction -= dy;
            }

            fraction += dx;
            y1 += sy;

            if (space == spacing) {
                callback(x1, y1);
                space = 0;
            } else {
                space += 1;
            }
        }
    }

    callback(x1, y1);
}


function color2json(color) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var imageData = ctx.getImageData(0, 0, 1, 1);

    return {
        r: imageData.data[0],
        g: imageData.data[1],
        b: imageData.data[2],
        a: imageData.data[3]
    };
}

function colorsEqual(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function createFeatherGradient(radius, hardness) {
    const innerRadius = Math.min(radius * hardness, radius - 1);
    const gradient = KiddoPaint.Display.context.createRadialGradient(
        0, 0, innerRadius,
        0, 0, radius);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 255, 1)');
    return gradient;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}