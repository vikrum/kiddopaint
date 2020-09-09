KiddoPaint.Tools.Toolbox.Flood = function() {
	var tool = this;
	this.isDown = false;
	this.connected = true;
	this.texture = false;

	this.mousedown = function (ev) {
		tool.isDown = true;
		var x = ev._x;
		var y = ev._y;
		var pixel_stack = [{x:x, y:y}] ;
		var pixels = KiddoPaint.Display.main_context.getImageData( 0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height ) ;
		var linear_cords = ( y * KiddoPaint.Display.canvas.width + x ) * 4 ;
		var original_color = {r:pixels.data[linear_cords], g:pixels.data[linear_cords+1], b:pixels.data[linear_cords+2], a:pixels.data[linear_cords+3]} ;
		var color = rgb2json(KiddoPaint.Current.color);

		if(colorsEqual(color, original_color)) {
			return;
		}


		while( pixel_stack.length>0 ) {
			var new_pixel = pixel_stack.shift() ;
			x = new_pixel.x ;
			y = new_pixel.y ;

			var linear_cords = ( y * KiddoPaint.Display.canvas.width + x ) * 4 ;
			while( y-->=0 &&
					(pixels.data[linear_cords]==original_color.r &&
					 pixels.data[linear_cords+1]==original_color.g &&
					 pixels.data[linear_cords+2]==original_color.b &&
					 pixels.data[linear_cords+3]==original_color.a) ) {
				linear_cords -= KiddoPaint.Display.canvas.width * 4 ;
			}
			linear_cords += KiddoPaint.Display.canvas.width * 4 ;
			y++ ;

			var reached_left = false ;
			var reached_right = false ;
			while( y++<KiddoPaint.Display.canvas.height &&
					(pixels.data[linear_cords]==original_color.r &&
					 pixels.data[linear_cords+1]==original_color.g &&
					 pixels.data[linear_cords+2]==original_color.b &&
					 pixels.data[linear_cords+3]==original_color.a) ) {
				pixels.data[linear_cords]   = color.r ;
				pixels.data[linear_cords+1] = color.g ;
				pixels.data[linear_cords+2] = color.b ;
				pixels.data[linear_cords+3] = color.a ;

				if( x>0 ) {
					if( pixels.data[linear_cords-4]==original_color.r &&
							pixels.data[linear_cords-4+1]==original_color.g &&
							pixels.data[linear_cords-4+2]==original_color.b &&
							pixels.data[linear_cords-4+3]==original_color.a ) {
						if( !reached_left ) {
							pixel_stack.push( {x:x-1, y:y} ) ;
							reached_left = true ;
						}
					} else if( reached_left ) {
						reached_left = false ;
					}
				}

				if( x<KiddoPaint.Display.canvas.width-1 ) {
					if( pixels.data[linear_cords+4]==original_color.r &&
							pixels.data[linear_cords+4+1]==original_color.g &&
							pixels.data[linear_cords+4+2]==original_color.b &&
							pixels.data[linear_cords+4+3]==original_color.a ) {
						if( !reached_right ) {
							pixel_stack.push( {x:x+1,y:y} ) ;
							reached_right = true ;
						}
					} else if( reached_right ) {
						reached_right = false ;
					}
				}

				linear_cords += KiddoPaint.Display.canvas.width * 4 ;
			}
		}
		KiddoPaint.Display.context.putImageData( pixels, 0, 0 ) ;
	};

	this.mousemove = function (ev) { };
	this.mouseup = function (ev) { if (tool.isDown) { tool.isDown = false; KiddoPaint.Display.saveMain(); } };
};
KiddoPaint.Tools.Flood = new KiddoPaint.Tools.Toolbox.Flood();

