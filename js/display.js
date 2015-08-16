KiddoPaint.Display.undoData = null;

KiddoPaint.Display.clearAll = function() {
  KiddoPaint.Display.saveUndo();
  KiddoPaint.Display.clearPreview();
  KiddoPaint.Display.clearTmp();
  KiddoPaint.Display.clearMain();
}

KiddoPaint.Display.clearMain = function() {
  KiddoPaint.Display.main_context.clearRect(0, 0, KiddoPaint.Display.main_canvas.width, KiddoPaint.Display.main_canvas.height);
}

KiddoPaint.Display.clearTmp = function() {
  KiddoPaint.Display.context.clearRect(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);
}

KiddoPaint.Display.clearPreview = function() {
  KiddoPaint.Display.previewContext.clearRect(0, 0, KiddoPaint.Display.canvas.width, KiddoPaint.Display.canvas.height);
}

KiddoPaint.Display.saveMain = function() {
  KiddoPaint.Display.saveUndo();
  KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
  KiddoPaint.Display.clearTmp();
}

KiddoPaint.Display.saveUndo = function() {
  KiddoPaint.Display.undoData = KiddoPaint.Display.main_canvas.toDataURL();
}

KiddoPaint.Display.undo = function() {
  if(KiddoPaint.Display.undoData) {
    var nextUndoData = KiddoPaint.Display.main_canvas.toDataURL();
    var img = new Image();
    img.src = KiddoPaint.Display.undoData;
    img.onload = function() { KiddoPaint.Display.clearMain(); KiddoPaint.Display.main_context.drawImage(img, 0, 0); }
    KiddoPaint.Display.undoData = nextUndoData;
  }
}
