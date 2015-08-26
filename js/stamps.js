KiddoPaint.Stamps.grouping = {
  stamp1: { stamps: [ '🚂', '🚃', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚛', '🚚', '🚒', '🚑', '🚐', '🚜', '⛵', '🚤', '🚀', '✈️', '🚁' ] },
  stamp2: { stamps: [ '🏠', '🎪', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏨', '🏬', '🏤', '🏭', '🛁', '🚽', '📱', '🇺🇸', '🚏', '📭', '📦' ] },
  stamp3: { stamps: [ '🏃', '🚶', '💃', '🏇', '🏂', '🏊', '🏄', '🎃', '⛄', '🚧', '⛽', '🐓', '🐄', '🐐', '🐏', '🐅', '🐖', '🐊', '🐫' ] },
  stamp4: { stamps: [ '🌲', '🌳', '🌴', '🎄', '⛳', '🌼', '🌷', '🍀', '🌻', '🌺', '🌿', '🌾', '🍄', '🌵', '❄️', '💧', '☁️', '🌞', '🌛' ] }
  }


KiddoPaint.Stamps.stamp = function(stamp, alt, size, shiftAmount, color) {
	stamp = stamp || '';
	var canvasBrush = document.createElement('canvas');
	canvasBrush.width = Math.max(size + (size * 0.05), 24);
	canvasBrush.height = Math.max(size + (size * 0.05), 24);

	var contextBrush = canvasBrush.getContext('2d');
	contextBrush.font = size + 'px sans-serif';
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
