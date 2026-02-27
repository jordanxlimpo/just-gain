(function () {
    var _ = [
        'getElementById',
        'vsl-container',
        'innerHTML',
        '\x3cvturb-smartplayer\x20id\x3d\x22vid-699ce4d27d7b375b25f4059b\x22\x20style\x3d\x22display\x3abloc\x6b\x3bmargin\x3a0\x20auto\x3bwidth\x3a10\x30\x25\x3bmax-width\x3a40\x30px\x3b\x22\x3e\x3c\x2fvturb-smartplayer\x3e',
        'createElement',
        'sc\x72ipt',
        'sr\x63',
        'https://scripts.converteai.net/51dde582-0ca5-4e62-a622-49f59f40a968/playe\x72s/699ce4d27d7b375b25f4059b/v4/playe\x72.js',
        'asy\x6ec',
        'he\x61d',
        'appendChild'
    ];
    var t = setInterval(function () {
        var c = document[_[0]](_[1]);
        if (c) {
            clearInterval(t);
            c[_[2]] = _[3];
            var s = document[_[4]](_[5]);
            s[_[6]] = _[7];
            s[_[8]] = true;
            document[_[9]][_[10]](s);
        }
    }, 100);
}());
