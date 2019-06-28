let c = document.getElementById("c"), ctx = c.getContext("2d");
c.width = window.innerHeight;
c.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;
const u = 32, imgu = 16, ms = Math.round(c.height / u), image = document.getElementById("d"), left = 37, down = 40, up = 38, right = 39;
let wup = true;
let keys = { 37: false, 38: false, 39: false, 40: false };
window.onkeydown = function (e) {
    if (d.h.ld == 0 && e.keyCode == down) return;
    if (d.h.ld == 1 && e.keyCode == left) return;
    if (d.h.ld == 2 && e.keyCode == right) return;
    if (d.h.ld == 3 && e.keyCode == up) return;
    keys = { 37: false, 38: false, 39: false, 40: false };
    keys[e.keyCode] = true;
    handleInputs();
};//direction: 0:n, 1:e, 2:w, 3:s

(function () {
    setTimeout(function () {
        initDragon();
        initSheep();
    }, 0);
    setInterval(function () {
        draw();
    }, 125);
    setInterval(function () {
        wup = !wup;
       
        noMoreSheep();
        collideBody();
        moveDragon();
        collideSheep();

    }, 250);
})();

let initDragon = function () {
    d = { h: { x: 5, y: 5, lx: 5, ly: 5, d: 2, s: 0 }, b: [{ x: 6, y: 5, lx: 6, ly: 5, d: 2, ld: 2 }, { x: 7, y: 5, lx: 7, ly: 5, d: 2, ld: 2 }, { x: 8, y: 5, lx: 7, ly: 5, d: 2, ld: 2 }] };
}

let eatSheep = function () {
    let _last = d.b[d.b.length - 1];
    d.b.push({ x: _last.x, y: _last.y, lx: _last.lx, ly: _last.ly, d: _last.ld, ld: _last.ld });
    initASheep();
}

let initSheep = function () {
    s = [];
    for (let _si = 0; _si < 4; _si++) {
        initASheep();
    }
};

let initASheep = function () {
    const x = range(2, ms - 5);
    const y = range(2, ms - 5);
    s.push({ x: x, y: y, s: 0 });
}

let range = function (start, stop) {
    return Math.round(Math.random() * stop) + start;
};


let handleInputs = function () {
    if (keys[up] == true) {
        d.h.d = 0;
        return;
    }
    if (keys[right] == true) {
        d.h.d = 1;
        return;
    }
    if (keys[left] == true) {
        d.h.d = 2;
        return;
    }
    if (keys[down] == true) {
        d.h.d = 3;
        return;
    }
}

let draw = function () {
    drawGround();
    drawSheep();
    if (d.h.d == 0) {
        drawDragonHead();
        drawDragonBody();
    }
    else {
        drawDragonBody();
        drawDragonHead();
    }
};

let getDelta = function (_d) {
    return _d == 0 ? [0, -1] : _d == 1 ? [1, 0] : _d == 2 ? [-1, 0] : [0, 1];
}

let moveDragon = function () {
    hitCornersAndWalls();
    const delta = getDelta(d.h.d);
    d.h.x += delta[0];
    d.h.y += delta[1];
    d.h.ld = d.h.d;
    for (let ix = 0; ix < d.b.length; ix++) {
        const db = d.b[ix];
        db.ld = db.d;
        db.lx = db.x;
        db.ly = db.y;
        if (ix == 0) {
            const bdelta = getDelta(db.d);
            db.x += bdelta[0];
            db.y += bdelta[1];
            db.d = d.h.d
        }
        else {
            let _ld = d.b[ix - 1];
            db.x = _ld.lx;
            db.y = _ld.ly;
            db.d = _ld.ld;
        }
    }
}

let drawDragonHead = function () {
    let sp = [];
    if (d.h.s == 1) {
        sp = d.h.d == 0 ? [6, 4] : d.h.d == 1 ? [2, 3] : d.h.d == 2 ? [1, 3] : [0, 3];
    }
    else {
        sp = d.h.d == 0 ? [6, 4] : d.h.d == 1 ? [2, 1] : d.h.d == 2 ? [1, 1] : [0, 1];
    }
    ctx.drawImage(image, imgu * sp[0], imgu * sp[1], imgu, imgu, d.h.x * u, d.h.y * u, u * 1.5, u * 1.5); //sx, sy, w, h, dx, dy, w, h
};

let drawDragonBody = function () {//todo - calc wings and feet and remove second forloop
    const _l = d.b.length, _w = _l == 1 ? 0 : Math.round(_l / 3) - 1, _leg = _l == 1 ? 0 : Math.round(_l * 2 / 3) - 1;
    //body
    for (let ix = 0; ix < _l; ix++) {
        const db = d.b[ix], _lb = ix == _l - 1, _wb = ix == _w, sp =
            db.d == 0 && _wb ? [3, 3]
                : db.d == 0 && _lb ? [6, 2]
                    : db.d == 0 ? [3, 2]
                        : db.d == 1 && _lb ? [6, 1]
                            : db.d == 1 ? [3, 1]
                                : db.d == 2 && _lb ? [5, 1]
                                    : db.d == 2 ? [4, 1]
                                        : db.d == 3 && _wb ? [4, 3]
                                            : db.d == 3 && _lb ? [5, 2]
                                                : [4, 2];
        ctx.drawImage(image, imgu * sp[0], imgu * sp[1], imgu, imgu, db.x * u, db.y * u, u * 1.5, u * 1.5);
    }
    //wings & feet
    for (let ix = 0; ix < _l; ix++) {
        const db = d.b[ix], _wb = ix == _w, _legb = ix == _leg, _facingVert = db.d == 0 || db.d == 3
        if (_wb) {

            const _y = wup ? -2 : 2;
            if (_facingVert) {
                const _wsp = wup ? [2, 4, 5, 4]
                    : [3, 4, 4, 4];
                ctx.drawImage(image, imgu * _wsp[0], imgu * _wsp[1], imgu, imgu, (db.x - 1) * u, db.y * u, u * 1.5, u * 1.5);
                ctx.drawImage(image, imgu * _wsp[2], imgu * _wsp[3], imgu, imgu, (db.x + 1) * u, db.y * u, u * 1.5, u * 1.5);
            }
            else if (db.d != 2) {
                const _wsp = wup ? [2, 4]
                    : [3, 5];
                ctx.drawImage(image, imgu * _wsp[0], imgu * _wsp[1], imgu, imgu, (db.x) * u, db.y * u + u / _y, u * 1.5, u * 1.5);
            }
            else if (db.d == 2) {
                const _wsp = wup ? [5, 4]
                    : [4, 5];
                ctx.drawImage(image, imgu * _wsp[0], imgu * _wsp[1], imgu, imgu, (db.x) * u, db.y * u + u / _y, u * 1.5, u * 1.5);
            }

        }
        if (_legb) {
            const _wsp = [0, 4, 1, 4];
            if (_facingVert) {
                ctx.drawImage(image, imgu * _wsp[0], imgu * _wsp[1], imgu, imgu, (db.x - 1) * u, db.y * u, u * 1.5, u * 1.5);
                ctx.drawImage(image, imgu * _wsp[2], imgu * _wsp[3], imgu, imgu, (db.x + 1) * u, db.y * u, u * 1.5, u * 1.5);
            }
            else if (db.d == 2) {
                ctx.drawImage(image, imgu * _wsp[0], imgu * _wsp[1], imgu, imgu, (db.x) * u, db.y * u + u / 2, u * 1.5, u * 1.5);
            }
            else if (db.d != 2) {
                ctx.drawImage(image, imgu * _wsp[2], imgu * _wsp[3], imgu, imgu, (db.x) * u, db.y * u + u / 2, u * 1.5, u * 1.5);
            }
        }
    }
};

let drawGround = function () {
    for (let x = 0; x < ms + 1; x++) {
        for (let y = 0; y < ms + 1; y++) {
            const i = ((x + y) % 2) + 5;
            ctx.drawImage(image, imgu * i, 0, imgu, imgu, u * x, u * y, u, u);
        }
    }
};

let drawSheep = function () {
    for (let si = 0; si < s.length; si++) {
        const sheep = s[si];
        const sx = sheep.s == 0 ? 1 : sheep.s == 1 ? 7 : 2;
        ctx.drawImage(image, imgu * sx, 0, imgu, imgu, u * sheep.x, u * sheep.y, u * 1.5, u * 1.5);
    }
};

let noMoreSheep = function () {
    if (s.every(sheep => sheep.s > 0)) {
        gameOver();
    }
}

let collideBody = function () {
    const _l = d.b.length;
    for (let ix = 0; ix < _l; ix++) {
        if (d.b[ix].x == d.h.x && d.b[ix].y == d.h.y) {
            gameOver();
            ix = _l;
        }
    }
}

let gameOver = function () {
    initDragon();
    initSheep();
}

let collideSheep = function () {
    d.h.s = 0;
    let del = getDelta(d.h.d);
    const nextPos = [d.h.x + del[0], d.h.y + del[1]];
    for (let si = 0; si < s.length; si++) {
        const sheep = s[si];
        if (sheep.s == 1) sheep.s = 2;
        if (sheep.s == 0) {
            if ((sheep.x == nextPos[0] && sheep.y == nextPos[1]) || (sheep.x == d.h.x && sheep.y == d.h.y)) {
                eatSheep();
                d.h.s = 1;
                console.log("sheep get")
                sheep.s = 1;
                si = s.length;
            }
        }
    }
}

let collideWall = function () {
    const delta = getDelta(d.h.d);
    const _x = d.h.x + delta[0];
    const _y = d.h.y + delta[1];
    return (_x == 0 || _y == 0 || _x == ms - 1 || _y == ms - 1);
}

function hitCornersAndWalls() {
    hitWall();
    hitWall();
}

function hitWall() {
    if (collideWall() === true) {
        d.h.d = d.h.d == 0 ? 2 : d.h.d == 1 ? 0 : d.h.d == 2 ? 3 : 1;
    }
}
