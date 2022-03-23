$(document).ready(function () {
    var nb = false;    

    $(document).keydown(function (event) {
        if (event.key == 'p') {
            $("#cercle").width($("#cercle").width() + 20);
            $("#cercle").height($("#cercle").height() + 20);
        } else if (event.key == 'm') {
            $("#cercle").width($("#cercle").width() - 20);
            $("#cercle").height($("#cercle").height() - 20);
        } else if (event.keycode == 39) {
            $("#cercle").offset({ top: 20, left: 0 });
            console.log(event.key);
        }
    });
    $(document).keydown(function (event) {
        var left = $("#cercle").offset().left;
        var top = $("#cercle").offset().top;
        if (top < 0) top = 0
        if (left < 0) left = 0
        if (left > limit) left = limit;
        if (top > limit) top = limit

        if (event.key == "ArrowUp") {
            jump();
        } else if (event.key == "ArrowDown") {
            $("#cercle").offset({ top: top + 5, left: left });
        } else if (event.key == "ArrowLeft") {
            $("#cercle").offset({ top: top, left: left - 5 });
            $("#cercle").attr("src", "imgs/perso-ConvertImage.png")
        } else if (event.key == "ArrowRight") {
            $("#cercle").offset({ top: top, left: left + 5 });
            $("#cercle").attr("src", "imgs/perso.png")
        }
    });
});
var limit, nb, imgs, arret, imageArray, perso, nbInterval, score, collisions, idImgs;
function init() {
    limit = Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    arret = false
    imageArray = ["imgs/heal.png", "imgs/flame1.gif", "imgs/waterdrop.gif"];
    nb = 20;
    perso = $("#cercle")
    var left = perso.offset().left;
    perso.offset({ top: limit-200, left: left });
    imgs = []
    idImgs = 0
    round()
    collisions = []
    score = 0
    nbInterval = 100;
}

function start(ele) {
    if (ele.id == "start") {
        init()
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "inline";
        timer.start()
        lancer();
        document.getElementById("menu").style.width = "150px";
        document.getElementById("menu").style.float = "right"
        document.getElementById("infos").style.display = "none";
        document.getElementById("btnInfos").style.display = "inline";
        document.getElementById("menu").style.opacity = "1"
    } else {
        document.getElementById("stop").style.display = "none";
        document.getElementById("start").style.display = "inline";
        document.getElementById("infos").style.display = "inline";
        document.getElementById("btnInfos").style.display = "none";
        timer.stop()
        arret = true;
        document.getElementById("menu").style.width = "100%";
        document.getElementById("menu").style.display = "inline-block"
        document.getElementById("menu").style.opacity = "0.75"
    }
}
function lancer() {
    fall()
}
//function jump() {
//    if ($("#cercle").classList != "jump") {
//        document.getElementById("cercle").classList.add("jump");

//        setTimeout(function () {
//            document.getElementById("cercle").classList.remove("jump");
//        }, 300);
//    }
//}
function round() {
    var i = 0;
    while (i < nb) {
        creerImg()
        i++
    }
}

function fall() {
    setInterval(function (){
        if (!arret) {
            console.log(creerImg())
            var id = Math.floor(Math.random() * imgs.length)
            var img = imgs[id]
            img.style.display = "inline"
            if(document.getElementById(img.id)=="undefined") document.getElementById('body1').appendChild(img);

            if (img.offsetTop <= limit) {
                $(img).offset({ top: img.offsetTop + 5, left: img.offsetLeft })
                points(img)
                //if (left > $("#cercle").offset().left && left < $("#cercle").width() && top > $("#cercle").offset().top && top < $("#cercle").height())
            } else {
                $(img).offset({ top: 0, left: Math.floor(Math.random() * 1500) })
                del(collisions, img)
            }
            creerImg()
        //    console.log(img.id)
        }
    }, 10)


}
function del (ar, val){
    for (var i = 0; i < ar.length; i++) {
        if(ar[i] == val) delete ar[i]
    }
}
function creerImg() {
    var img1 = document.createElement('img');
    img1.src = imageArray[Math.floor(Math.random() * imageArray.length)];
    img1.className = "imgs"
    img1.id = idImgs
    idImgs+=1
    //$("#cercle").attr("src", img)
    //$(img.id).offset({ top: 0, left: Math.floor(Math.random() * $(img.id).offsetLeft) });
    $(img1).offset({ top: img1.offsetTop, left: Math.floor(Math.random() * 1500) })
    img1.style.display = "none"
    imgs.push(img1);
    return img1;
}
function points(img) {
    if (!collisions.includes(img)) {
        if (collision(perso, img)) {
            console.log(img)
            console.log(img.src)
            if (img.src.includes("flame"))
                score += 5
            else
                score -= 10
            //if (score <= 0) {
            //    alert("Perdu...")
            //    arret = true;
            //    timer.stop()
            //}
        }
    }
    if (score >= 50 || document.getElementById('time').innerText > 30) nbInterval = 10
    document.getElementById('score').innerText = score;
}
function collision(img1, img2) {

    var x1 = $(img1).offset().left; // Positionnement de l'image (left)
    var y1 = $(img1).offset().top; // Positionnement de l'image (top)
    var h1 = $(img1).outerHeight(true); // Hauteur de l'image
    var w1 = $(img1).outerWidth(true); // Largeur de l'image
    var b1 = y1 + h1; // Positionnement du bas de l'image (top)
    var r1 = x1 + w1; // Positionnement à droite de l'image (left)

    var x2 = $(img2).offset().left;
    var y2 = $(img2).offset().top;
    var h2 = $(img2).outerHeight(true);
    var w2 = $(img2).outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;
    // Mise en relation des elements de la scene et leur collisions
    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
        //div1.attr("src", "attack.png")
        return false;
    }
    collisions.push(img2)
    return true;
}
class Timer {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = 0;
    }

    _getTimeElapsedSinceLastStart() {
        if (!this.startTime) {
            return 0;
        }
        return Date.now() - this.startTime;
    }

    start() {
        if (this.isRunning) {
            return console.error('Timer is already running');
        }

        this.isRunning = true;

        this.startTime = Date.now();
    }

    stop() {
        if (!this.isRunning) {
            return console.error('Timer is already stopped');
        }

        this.isRunning = false;

        this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset() {
        this.overallTime = 0;

        if (this.isRunning) {
            this.startTime = Date.now();
            return;
        }

        this.startTime = 0;
    }

    getTime() {
        if (!this.startTime) {
            return 0;
        }

        if (this.isRunning) {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }

        return this.overallTime;
    }
}

const timer = new Timer();
setInterval(() => {
    const timeInSeconds = Math.round(timer.getTime() / 1000);
    document.getElementById('time').innerText = timeInSeconds;
}, 100)