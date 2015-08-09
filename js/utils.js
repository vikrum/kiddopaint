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
