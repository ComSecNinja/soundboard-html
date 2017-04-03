(function() {
    var names = getNames();
    for (var i = 0; i < names.length; i++) {
        addTile(names[i]);
    }
})();
document.querySelector("#reset").onclick = function() {
    if (confirm("This erases all user data on this app")) resetBoard();
};

var playing = {name: null, track: new Audio()};

var fi = document.querySelector("#fileInput");
fi.onchange = function(evt) {
    var file = evt.srcElement.files[evt.srcElement.files.length-1];
    var name = file.name.split(".")[0];

    var tile = document.querySelector("[data-name=" + name + "]");

    var reader = new FileReader();
    reader.onload = function() {
        localStorage.setItem(name, reader.result);
        var names = getNames();
        if (names.indexOf(name) < 0) {
            names.push(name);
        }
        localStorage.setItem("names", names.join("."));
    };
    reader.readAsDataURL(file);

    console.log(file);

    if (!tile) {
        addTile(name);
    }

    evt.srcElement.value = null;
};

function addTile(name) {
    var tile = document.querySelector("div.tile").cloneNode(true);
    tile.removeAttribute("hidden");
    tile.setAttribute("data-name", name);
    tile.textContent = name;

    tile.onclick = function(evt) {
        playing.track.pause();
        if (playing.name === name) {
            console.info("Pausing");
            playing.name = null;
            return;
        }

        playing = {name: name, track: new Audio(localStorage.getItem(evt.srcElement.getAttribute("data-name")))};
        playing.track.onplay = function() {
            tile.setAttribute("data-playing", "");
        };
        playing.track.onpause = function() {
            tile.removeAttribute("data-playing");
        };
        playing.track.play();
    };

    document.querySelector(".row").appendChild(tile);
}

function resetBoard() {
    var names = getNames();
    for (var i = 0; i < names.length; i++) {
        localStorage.removeItem(names[i]);
        document.querySelector("[data-name]").remove();
    }
    localStorage.removeItem("names");
    console.info("The soundboard has been reset");
}

function getNames() {
    return localStorage.getItem("names") ? localStorage.getItem("names").split(".") : [];
}
