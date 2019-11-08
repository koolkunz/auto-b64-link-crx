// ==UserScript==
// @name     Automatic Base64 Decoder & Link Generator (forum.snahp.it)
// @grant    none
// @match    *://forum.snahp.it/viewtopic*
// ==/UserScript==
var lnt;

function updatePage() {
    chrome.storage.sync.get({
        lnknewtab: true
    }, function(items) {
        lnt = items.lnknewtab
        document.querySelectorAll(".content").forEach(post => {
            for (let i = 0; i < 3; i++) {
                post.innerText.split(/\s|\n/).forEach(word => {
                    var word1 = word
                    if ((word1.startsWith("aHR0cHM6Ly") || word1.startsWith("aHR0cDovL")) && word1.length % 4 !== 0) {
                        var lnct = word1.length % 4
                        var z
                        for (z = 0; z < lnct; z++) {
                            word1 = word1 + "="
                        }
                    }
                    if (word1.length < 16 || word1.length % 4 !== 0 || /^[\w]+={0,3}$/.exec(word1) === null) {
                        if (is_url(word1) && i == 0) {
                            if (!post.innerHTML.includes('="' + word) && !post.innerHTML.includes('="https://' + word) && !post.innerHTML.includes('="http://' + word) && !post.innerHTML.includes(word + '</a>') && !post.innerHTML.includes(word + ' </a>')) {
                                post.innerHTML = post.innerHTML.replace(word, linkify(word))
                            }
                        }
                        return
                    } else {
                        if (is_url(b64DecodeUnicode(word1))) {
                            post.innerHTML = post.innerHTML.replace(word, linkify(b64DecodeUnicode(word1)))
                        } else {
                            post.innerHTML = post.innerHTML.replace(word, b64DecodeUnicode(word1))
                        }
                    }
                })
            }
        })
    });
}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2;
    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    if (lnt) {
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" class="postlink">$1</a>');
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" class="postlink">$2</a>');
    } else {
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="" class="postlink">$1</a>');
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="" class="postlink">$2</a>');
    }
    return replacedText;
}

function is_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            chrome.runtime.sendMessage({
                "message": "open_options"
            });
        }
    }
);

updatePage();