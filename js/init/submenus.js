KiddoPaint.Submenu = {};

function show_generic_submenu(subtoolbar) {
    if (!KiddoPaint.Submenu[subtoolbar]) {
        return;
    }

    reset_ranges();

    var subtoolbars = document.getElementById('subtoolbars').children;
    var genericsubmenu = null;
    for (var i = 0, len = subtoolbars.length; i < len; i++) {
        var div = subtoolbars[i];
        if (div.id === 'genericsubmenu') {
            div.className = 'subtoolbar'
            genericsubmenu = div;
        } else {
            div.className = 'hidden'
        }
    }

    // clear old ; todo cache constructed buttons instead
    genericsubmenu.removeAllChildren();
    for (var i = 0, len = KiddoPaint.Submenu[subtoolbar].length; i < len; i++) {
        var buttonDetail = KiddoPaint.Submenu[subtoolbar][i];
        var button = document.createElement('button');
        button.className = 'tool';

        // title on hover
        button.title = buttonDetail.name;

        // display
        if (buttonDetail.invisible) {
            button.className += " invisible";
        } else if (buttonDetail.imgSrc) {
            var img = document.createElement('img');
            img.src = buttonDetail.imgSrc;
            img.className = 'tool';
            button.appendChild(img);
        } else if (buttonDetail.imgJs) {
            var img = document.createElement('img');
            img.src = buttonDetail.imgJs();
            button.appendChild(img);
        } else if (buttonDetail.text) {
            var t = document.createTextNode(buttonDetail.text);
            button.appendChild(t);
        } else if (buttonDetail.emoji) {
            var emoji = document.createElement('emj');
            var text = document.createTextNode(buttonDetail.emoji);
            emoji.appendChild(text);
            button.appendChild(emoji);
        }

        // click handler
        button.onclick = buttonDetail.handler;

        genericsubmenu.appendChild(button);
    }

}