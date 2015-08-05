KiddoPaint.Colors.Bright = ['rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(255,0,255)'];

KiddoPaint.Colors.All = {
  colorblack: 'rgb(0, 0, 0)',
  colorwhite: 'rgb(255, 255, 255)',
  colordgrey: 'rgb(128, 128, 128)',
  colorlgrey: 'rgb(192, 192, 192)',
  colordred: 'rgb(128, 0, 0)',
  colorlred: 'rgb(255, 0, 0)',
  colordyellow: 'rgb(128, 128, 0)',
  colorlyellow: 'rgb(255, 255, 0)',
  colordgreen: 'rgb(0, 128, 0)',
  colorlgreen: 'rgb(0, 255, 0)',
  colordcyan: 'rgb(0, 128, 128)',
  colorlcyan: 'rgb(0, 255, 255)',
  colordblue: 'rgb(0, 0, 128)',
  colorlblue: 'rgb(0, 0, 255)',
  colordpurple: 'rgb(128, 0, 128)',
  colorlpurple: 'rgb(255, 0, 255)'
}

KiddoPaint.Colors.nextColor = function() {
  return KiddoPaint.Colors.Bright[KiddoPaint.Display.step % KiddoPaint.Colors.Bright.length];
}

KiddoPaint.Colors.randomColor = function() {
  return KiddoPaint.Colors.Bright[Math.floor(Math.random()*KiddoPaint.Colors.Bright.length)];
}
