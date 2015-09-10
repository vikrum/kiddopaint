KiddoPaint.Stamps.grouping = {
  face: 'Apple Color Emoji',
  pages: 6,
  stamp1: { stamps: [ '🚂', '🚃', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚛', '🚚', '🚒', '🚑', '🚐', '🚜', '⛵', '🚤', '🚀', '✈️', '🚁' ] },
  stamp2: { stamps: [ '🏠', '🎪', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏨', '🏬', '🏤', '🏭', '🛁', '🚽', '🚪', '🇺🇸', '🚏', '📭', '📦' ] },
  stamp3: { stamps: [ '🏃', '🚶', '💃', '🏇', '🏂', '🏊', '🏄', '🎃', '⛄', '🚧', '⛽', '📡', '🏁', '⚽', '🏀', '🍕', '🍦', '🍪', '🍣' ] },
  stamp4: { stamps: [ '🌲', '🌳', '🌴', '🎄', '⛳', '🌼', '🌷', '🍀', '🌻', '🌺', '🌿', '🌾', '🍄', '🌵', '🎍', '🌸', '🌱', '🍃', '🍁' ] },
  stamp5: { stamps: [ '🐄', '🐏', '🐃', '🐅', '🐇', '🐎', '🐐', '🐓', '🐕', '🐖', '🐂', '🐊', '🐫', '🐆', '🐈', '🐠', '🐟', '🐬', '🐳' ] },
  stamp6: { stamps: [ '🎈', '❄️', '💧', '☁️', '🌞', '🌛', '🌔', '🌎', '⭐', '⚡', '☔', '🔥', '✨', '💥', '💦', '💨', '💎', '🌀', '🚩' ] },
}

KiddoPaint.Stamps.stamp = function(stamp, alt, size, shiftAmount, color) {
	stamp = stamp || '';
	var canvasBrush = document.createElement('canvas');
	canvasBrush.width = Math.max(size + (size * 0.05), 24);
	canvasBrush.height = Math.max(size + (size * 0.05), 24);

	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.font = size + 'px ' + KiddoPaint.Stamps.currentFace;
	if(color) { // chrome & safari compat hack
	  contextBrush.fillStyle = color;
	}

	contextBrush.save();
	if(alt) {
	  contextBrush.translate(size, size);
  	  contextBrush.scale(-1, 1);
	  contextBrush.fillText(stamp, 0, 0);
	}
	else {
	  contextBrush.fillText(stamp, 0, size);
	}
	contextBrush.restore();

	if(shiftAmount != 0) {
		hueShift(canvasBrush, contextBrush, shiftAmount);
	}

	return canvasBrush;
}

KiddoPaint.Stamps.nextPage = function() {
  KiddoPaint.Stamps.page += 1;
  if(KiddoPaint.Stamps.page > KiddoPaint.Stamps.grouping.pages) {
    KiddoPaint.Stamps.page = 1;
  }
}
