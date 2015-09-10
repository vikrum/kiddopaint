KiddoPaint.Sounds.Library = {}
KiddoPaint.Sounds.Library.enabled = true;

KiddoPaint.Sounds.Library.explosion = [ new Audio('snd/explosion0.wav'), new Audio('snd/explosion1.wav'), new Audio('snd/explosion2.wav') ];
KiddoPaint.Sounds.Library.oops = [ new Audio('snd/oops0.wav'), new Audio('snd/oops1.wav') ];
KiddoPaint.Sounds.Library.pencil = [ new Audio('snd/pencil0.wav') ];
KiddoPaint.Sounds.Library.stamp = [ new Audio('snd/stamp0.wav'), new Audio('snd/stamp1.wav') ];

KiddoPaint.Sounds.Library.play = function(sound) {
  if(KiddoPaint.Sounds.Library.enabled && KiddoPaint.Sounds.Library[sound]) {
    var idx = Math.floor(Math.random()*KiddoPaint.Sounds.Library[sound].length);
    var s = KiddoPaint.Sounds.Library[sound][idx];
    s.play();
  }
};

KiddoPaint.Sounds.explosion = function() { KiddoPaint.Sounds.Library.play('explosion'); }
KiddoPaint.Sounds.oops = function() { KiddoPaint.Sounds.Library.play('oops'); }
KiddoPaint.Sounds.pencil = function() { KiddoPaint.Sounds.Library.play('pencil'); }
KiddoPaint.Sounds.stamp = function() { KiddoPaint.Sounds.Library.play('stamp'); }
