KiddoPaint.Display.undoData = null;
KiddoPaint.Display.undoOn = true;

KiddoPaint.Display.clearAll = function() {
    KiddoPaint.Display.saveUndo();
    KiddoPaint.Display.clearPreview();
    KiddoPaint.Display.clearTmp();
    KiddoPaint.Display.clearMain();
    KiddoPaint.Display.clearLocalStorage();
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

KiddoPaint.Display.clearBeforeSaveMain = function() {
    if (KiddoPaint.Display.saveUndo()) {
        KiddoPaint.Display.clearMain();
        KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
        KiddoPaint.Display.clearTmp();
        KiddoPaint.Display.saveToLocalStorage();
    }
}

KiddoPaint.Display.saveMain = function() {
    if (KiddoPaint.Display.saveUndo()) {
        KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
        KiddoPaint.Display.clearTmp();
        KiddoPaint.Display.saveToLocalStorage();
    }
}

KiddoPaint.Display.saveMainSkipUndo = function() {
    KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
    KiddoPaint.Display.clearTmp();
    KiddoPaint.Display.saveToLocalStorage();
}


KiddoPaint.Display.pauseUndo = function() {
    KiddoPaint.Display.undoOn = false;
}

KiddoPaint.Display.resumeUndo = function() {
    KiddoPaint.Display.undoOn = true;
}

KiddoPaint.Display.saveUndo = function() {
    if (KiddoPaint.Display.undoOn) {
        KiddoPaint.Display.undoData = KiddoPaint.Display.main_canvas.toDataURL();
    }
    return KiddoPaint.Display.undoOn;
}

KiddoPaint.Display.undo = function(doClearMain) {
    if (KiddoPaint.Display.undoData) {
        var nextUndoData = KiddoPaint.Display.main_canvas.toDataURL();
        var img = new Image();
        img.src = KiddoPaint.Display.undoData;
        img.onload = function() {
            if (doClearMain) {
                KiddoPaint.Display.clearMain();
            }
            KiddoPaint.Display.main_context.drawImage(img, 0, 0);
        }
        KiddoPaint.Display.undoData = nextUndoData;
    }
}

KiddoPaint.Display.clearLocalStorage = function() {
    if (typeof(Storage) != "undefined") {
        localStorage.removeItem("kiddopaint");
    }
}

KiddoPaint.Display.saveToLocalStorage = function() {
    if (typeof(Storage) != "undefined") {
        try {
            localStorage.setItem("kiddopaint", KiddoPaint.Display.main_canvas.toDataURL());
        } catch (e) {
            try {
                localStorage.setItem("kiddopaint", KiddoPaint.Display.main_canvas.toDataURL('image/jpeg', 0.87));
            } catch (e2) {
                console.log(e2);
            }
        }
    }
}

KiddoPaint.Display.loadFromLocalStorage = function() {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        KiddoPaint.Display.clearMain();
        KiddoPaint.Display.main_context.drawImage(img, 0, 0);
    }
    if (typeof(Storage) != "undefined" && localStorage.getItem("kiddopaint")) {
        img.src = localStorage.getItem("kiddopaint");
    } else {
        img.src = "static/kiddopaint.jpg";
    }
}