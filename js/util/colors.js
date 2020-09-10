KiddoPaint.Colors.Bright = ['rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(255,0,255)'];

KiddoPaint.Colors.All = {
'colorblack': 'rgb(0, 0, 0)',
'colorwhite': 'rgb(255, 255, 255)',
'colordgrey': 'rgb(128, 128, 128)',
'colorlgrey': 'rgb(192, 192, 192)',
'colordred': 'rgb(128, 0, 0)',
'colorlred': 'rgb(255, 0, 0)',
'colordyellow': 'rgb(128, 128, 0)',
'colorlyellow': 'rgb(255, 255, 0)',
'colordgreen': 'rgb(0, 128, 0)',
'colorlgreen': 'rgb(0, 255, 0)',
'colordcyan': 'rgb(0, 128, 128)',
'colorlcyan': 'rgb(0, 255, 255)',
'colordblue': 'rgb(0, 0, 128)',
'colorlblue': 'rgb(0, 0, 255)',
'colordpurple': 'rgb(128, 0, 128)',
'colorlpurple': 'rgb(255, 0, 255)',
'colorlbrown': 'rgb(136, 104, 67)',
'colordbrown': 'rgb(73, 61, 38)',
'colordorange': 'rgb(225, 135, 0)',
'colorlorange': 'rgb(255, 195, 30)',
'db222034': 'rgb( 34 , 32 ,52 )',
'db45283c': 'rgb( 69 , 40 ,60 )',
'db663931': 'rgb( 102 , 57 ,49 )',
'db8f563b': 'rgb( 143 , 86 ,59 )',
'dbdf7126': 'rgb( 223 , 113 ,38 )',
'dbd9a066': 'rgb( 217 , 160 ,102 )',
'dbeec39a': 'rgb( 238 , 195 ,154 )',
'dbfbf236': 'rgb( 251 , 242 ,54 )',
'db99e550': 'rgb( 153 , 229 ,80 )',
'db6abe30': 'rgb( 106 , 190 ,48 )',
'db37946e': 'rgb( 55 , 148 ,110 )',
'db4b692f': 'rgb( 75 , 105 ,47 )',
'db524b24': 'rgb( 82 , 75 ,36 )',
'db323c39': 'rgb( 50 , 60 ,57 )',
'db3f3f74': 'rgb( 63 , 63 ,116 )',
'db306082': 'rgb( 48 , 96 ,130 )',
'db5b6ee1': 'rgb( 91 , 110 ,225 )',
'db639bff': 'rgb( 99 , 155 ,255 )',
'db5fcde4': 'rgb( 95 , 205 ,228 )',
'dbcbdbfc': 'rgb( 203 , 219 ,252 )',
'db9badb7': 'rgb( 155 , 173 ,183 )',
'db847e87': 'rgb( 132 , 126 ,135 )',
'db696a6a': 'rgb( 105 , 106 ,106 )',
'db595652': 'rgb( 89 , 86 ,82 )',
'db76428a': 'rgb( 118 , 66 ,138 )',
'dbac3232': 'rgb( 172 , 50 ,50 )',
'dbd95763': 'rgb( 217 , 87 ,99 )',
'dbd77bba': 'rgb( 215 , 123 ,186 )',
'db8f974a': 'rgb( 143 , 151 ,74 )',
'db8a6f30': 'rgb( 138 , 111 ,48 )'
}

KiddoPaint.Colors.nextColor = function() {
  return KiddoPaint.Colors.Bright[KiddoPaint.Display.step % KiddoPaint.Colors.Bright.length];
}

KiddoPaint.Colors.randomColor = function() {
  return KiddoPaint.Colors.Bright[Math.floor(Math.random()*KiddoPaint.Colors.Bright.length)];
}
