KiddoPaint.Colors.Bright = ['rgb(0,0,0)', 'rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(255,0,255)', 'rgb(255,255,255)'];

KiddoPaint.Colors.All = {
  black: 'rgb(0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  dgrey: 'rgb(128, 128, 128)',
  lgrey: 'rgb(192, 192, 192)',
  dred: 'rgb(128, 0, 0)',
  lred: 'rgb(255, 0, 0)',
  dyellow: 'rgb(128, 128, 0)',
  lyellow: 'rgb(255, 255, 0)',
  dgreen: 'rgb(0, 128, 0)',
  lgreen: 'rgb(0, 255, 0)',
  dcyan: 'rgb(0, 128, 128)',
  lcyan: 'rgb(0, 255, 255)',
  dblue: 'rgb(0, 0, 128)',
  lblue: 'rgb(0, 0, 255)',
  dpurple: 'rgb(128, 0, 128)',
  lpurple: 'rgb(255, 0, 255)'
}

KiddoPaint.Colors.nextColor = function() {
  return KiddoPaint.Colors.Bright[KiddoPaint.Display.step % KiddoPaint.Colors.Bright.length];
}

KiddoPaint.Colors.randomColor = function() {
  return KiddoPaint.Colors.Bright[Math.floor(Math.random()*KiddoPaint.Colors.Bright.length)];
}
