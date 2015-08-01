KiddoPaint.Colors.Bright = ['rgb(0,0,0)', 'rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(255,0,255)', 'rgb(255,255,255)'];

KiddoPaint.Colors.nextColor = function() {
  return KiddoPaint.Colors.Bright[KiddoPaint.Display.step % KiddoPaint.Colors.Bright.length];
}

KiddoPaint.Colors.randomColor = function() {
  return KiddoPaint.Colors.Bright[Math.floor(Math.random()*KiddoPaint.Colors.Bright.length)];
}


