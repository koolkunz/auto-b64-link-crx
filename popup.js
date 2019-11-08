function save_options() {
    var lnknewtab = document.getElementById('newtab').checked;
    chrome.storage.sync.set({
        lnknewtab: lnknewtab
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved!';
        fadein(status);
        setTimeout(function() {
            fade(status);
        }, 1250);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        lnknewtab: true
    }, function(items) {
        document.getElementById('newtab').checked = items.lnknewtab;
    });
}

function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function() {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadein(element) {
    element.style.opacity = 1;
    element.style.display = 'block';
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('newtab').addEventListener('change', save_options);
chrome.storage.onChanged.addListener(restore_options);