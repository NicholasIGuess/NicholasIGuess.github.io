function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var match = document.cookie.split('; ').find(function (c) { return c.indexOf(name + '=') === 0; });
    return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function eraseCookie(name) {
    var expires = 'Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    var hostname = location.hostname;
    document.cookie = name + '=; ' + expires;
    var path = location.pathname || '/';
    if (!path.startsWith('/')) path = '/' + path;
    var tried = {};
    while (true) {
        var tryPath = path || '/';
        if (!tried[tryPath]) {
            document.cookie = name + '=; ' + expires + ' path=' + tryPath + ';';
            document.cookie = name + '=; ' + expires + ' path=' + tryPath + '; domain=' + hostname + ';';
            if (hostname.indexOf('.') !== -1) {
                document.cookie = name + '=; ' + expires + ' path=' + tryPath + '; domain=.' + hostname + ';';
            }
            tried[tryPath] = true;
        }

        if (tryPath === '/' || tryPath === '') break;
        var idx = path.lastIndexOf('/');
        if (idx <= 0) {
            path = '/';
        } else {
            path = path.substring(0, idx);
            if (path === '') path = '/';
        }
    }
}

function increment() {
    setCookie('flag', '_so_i_will')
    document.getElementById('count').textContent = parseInt(document.getElementById('count').textContent) + 1;
}

function decrement() {
    eraseCookie('flag')
    document.getElementById('count').textContent = parseInt(document.getElementById('count').textContent) - 1;
}

setCookie('part4', 'where are the styles set?')