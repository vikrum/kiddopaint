KiddoPaint.Tools.Toolbox.Flood = function() {

    this.mousedown = function(ev) {
        KiddoPaint.Sounds.flood();
        var x = ev._x;
        var y = ev._y;
        var pixel_stack = [{
            x: x,
            y: y
        }];
        // read from main_context for underlying pixels
        var pixels = KiddoPaint.Display.main_context.getImageData(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);

        var linear_cords = (y * KiddoPaint.Display.canvas.width + x) * 4;
        var original_color = {
            r: pixels.data[linear_cords],
            g: pixels.data[linear_cords + 1],
            b: pixels.data[linear_cords + 2],
            a: pixels.data[linear_cords + 3]
        };

        var color = color2json(KiddoPaint.Current.color);

        if (colorsEqual(color, original_color)) {
            return;
        }


        while (pixel_stack.length > 0) {
            var new_pixel = pixel_stack.shift();
            x = new_pixel.x;
            y = new_pixel.y;

            var linear_cords = (y * KiddoPaint.Display.canvas.width + x) * 4;
            while (y-- >= 0 &&
                (pixels.data[linear_cords] == original_color.r &&
                    pixels.data[linear_cords + 1] == original_color.g &&
                    pixels.data[linear_cords + 2] == original_color.b &&
                    pixels.data[linear_cords + 3] == original_color.a)) {
                linear_cords -= KiddoPaint.Display.canvas.width * 4;
            }
            linear_cords += KiddoPaint.Display.canvas.width * 4;
            y++;

            var reached_left = false;
            var reached_right = false;
            while (y++ < KiddoPaint.Display.canvas.height &&
                (pixels.data[linear_cords] == original_color.r &&
                    pixels.data[linear_cords + 1] == original_color.g &&
                    pixels.data[linear_cords + 2] == original_color.b &&
                    pixels.data[linear_cords + 3] == original_color.a)) {

                pixels.data[linear_cords] = color.r;
                pixels.data[linear_cords + 1] = color.g;
                pixels.data[linear_cords + 2] = color.b;
                pixels.data[linear_cords + 3] = color.a;

                if (x > 0) {
                    if (pixels.data[linear_cords - 4] == original_color.r &&
                        pixels.data[linear_cords - 4 + 1] == original_color.g &&
                        pixels.data[linear_cords - 4 + 2] == original_color.b &&
                        pixels.data[linear_cords - 4 + 3] == original_color.a) {
                        if (!reached_left) {
                            pixel_stack.push({
                                x: x - 1,
                                y: y
                            });
                            reached_left = true;
                        }
                    } else if (reached_left) {
                        reached_left = false;
                    }
                }

                if (x < KiddoPaint.Display.canvas.width - 1) {
                    if (pixels.data[linear_cords + 4] == original_color.r &&
                        pixels.data[linear_cords + 4 + 1] == original_color.g &&
                        pixels.data[linear_cords + 4 + 2] == original_color.b &&
                        pixels.data[linear_cords + 4 + 3] == original_color.a) {
                        if (!reached_right) {
                            pixel_stack.push({
                                x: x + 1,
                                y: y
                            });
                            reached_right = true;
                        }
                    } else if (reached_right) {
                        reached_right = false;
                    }
                }

                linear_cords += KiddoPaint.Display.canvas.width * 4;
            }
        }
        // since we are possibly rewriting a non-rectangular shape back, we put back all the pixels.
        // however, due to alpha (& premultiplication w/ get -> put), it mutates unchanged pixels underneath
        // so, add a new helper that clears main before writing the preview context. this also preserves
        // undoing the fill properly.
        KiddoPaint.Display.context.putImageData(pixels, 0, 0);
        KiddoPaint.Display.clearBeforeSaveMain();
    };

    this.mousemove = function(ev) {};
    this.mouseup = function(ev) {};
};
KiddoPaint.Tools.Flood = new KiddoPaint.Tools.Toolbox.Flood();