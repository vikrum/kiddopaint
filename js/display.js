KiddoPaint.Display.clearTmp = function() {
  KiddoPaint.Display.context.clearRect(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);
}

KiddoPaint.Display.saveMain = function() {
  KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
  KiddoPaint.Display.clearTmp();
}
