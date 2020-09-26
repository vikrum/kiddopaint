KiddoPaint.Colors.Palette = {};
KiddoPaint.Colors.Current = {};

KiddoPaint.Colors.Palette.Blank = ['rgba(0, 0, 0, 0)'];
KiddoPaint.Colors.Palette.Bright = ['rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(255,0,255)'];

// these are len(pal)=32
KiddoPaint.Colors.Palette.Basic = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(128, 128, 128)', 'rgb(192, 192, 192)', 'rgb(0, 0, 128)', 'rgb(0, 0, 255)', 'rgb(0, 128, 0)', 'rgb(0, 128, 128)', 'rgb(0, 128, 255)', 'rgb(0, 255, 0)', 'rgb(0, 255, 128)', 'rgb(0, 255, 255)', 'rgb(0, 64, 128)', 'rgb(0, 64, 64)', 'rgb(128, 0, 0)', 'rgb(128, 0, 128)', 'rgb(128, 0, 255)', 'rgb(128, 128, 0)', 'rgb(128, 128, 255)', 'rgb(128, 128, 64)', 'rgb(128, 255, 255)', 'rgb(128, 64, 0)', 'rgb(136, 104, 67)', 'rgb(225, 135, 0)', 'rgb(255, 0, 0)', 'rgb(255, 0, 128)', 'rgb(255, 0, 255)', 'rgb(255, 128, 64)', 'rgb(255, 195, 30)', 'rgb(255, 255, 0)', 'rgb(255, 255, 128)', 'rgb(73, 61, 38)'];
KiddoPaint.Colors.Palette.DawnBringer = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb( 34 , 32 ,52 )', 'rgb( 69 , 40 ,60 )', 'rgb( 102 , 57 ,49 )', 'rgb( 143 , 86 ,59 )', 'rgb( 223 , 113 ,38 )', 'rgb( 217 , 160 ,102 )', 'rgb( 238 , 195 ,154 )', 'rgb( 251 , 242 ,54 )', 'rgb( 153 , 229 ,80 )', 'rgb( 106 , 190 ,48 )', 'rgb( 55 , 148 ,110 )', 'rgb( 75 , 105 ,47 )', 'rgb( 82 , 75 ,36 )', 'rgb( 50 , 60 ,57 )', 'rgb( 63 , 63 ,116 )', 'rgb( 48 , 96 ,130 )', 'rgb( 91 , 110 ,225 )', 'rgb( 99 , 155 ,255 )', 'rgb( 95 , 205 ,228 )', 'rgb( 203 , 219 ,252 )', 'rgb( 155 , 173 ,183 )', 'rgb( 132 , 126 ,135 )', 'rgb( 105 , 106 ,106 )', 'rgb( 89 , 86 ,82 )', 'rgb( 118 , 66 ,138 )', 'rgb( 172 , 50 ,50 )', 'rgb( 217 , 87 ,99 )', 'rgb( 215 , 123 ,186 )', 'rgb( 143 , 151 ,74 )', 'rgb( 138 , 111 ,48 )'];

KiddoPaint.Colors.All = [KiddoPaint.Colors.Palette.Basic, KiddoPaint.Colors.Palette.DawnBringer]
KiddoPaint.Colors.Current.PaletteNumber = 1;
KiddoPaint.Colors.Current.Palette = KiddoPaint.Colors.All[KiddoPaint.Colors.Current.PaletteNumber];

KiddoPaint.Colors.currentPalette = function() {
    return KiddoPaint.Colors.All[KiddoPaint.Colors.Current.PaletteNumber];
}

KiddoPaint.Colors.nextPalette = function() {
    KiddoPaint.Colors.Current.PaletteNumber += 1;
    if (KiddoPaint.Colors.Current.PaletteNumber > KiddoPaint.Colors.All.length) {
        KiddoPaint.Colors.Current.PaletteNumber = 0;
    }
    KiddoPaint.Colors.Current.Palette = KiddoPaint.Colors.All[KiddoPaint.Colors.Current.PaletteNumber];
    return KiddoPaint.Colors.Current.Palette;
}

KiddoPaint.Colors.nextColor = function() {
    return KiddoPaint.Colors.Palette.Bright[KiddoPaint.Display.step % KiddoPaint.Colors.Palette.Bright.length];
}

KiddoPaint.Colors.randomColor = function() {
    return KiddoPaint.Colors.Palette.Bright[Math.floor(Math.random() * KiddoPaint.Colors.Palette.Bright.length)];
}

KiddoPaint.Colors.nextAllColor = function() {
    var pal = KiddoPaint.Colors.currentPalette();
    return pal[KiddoPaint.Display.step % pal.length];
}

KiddoPaint.Colors.randomAllColor = function() {
    var pal = KiddoPaint.Colors.currentPalette();
    return pal[Math.floor(Math.random() * pal.length)];
}