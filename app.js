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
    for (var i = 0; i < evt.srcElement.files.length; i++) {
        var file = evt.srcElement.files[i];
        var name = file.name.split(".")[0];
        console.log("Processing " + name);
        loadFile(name, file);
    }
    evt.srcElement.value = null;
};

function loadFile(name, file) {
    var tile = document.querySelector("[data-name=" + name + "]");

    var reader = new FileReader();
    reader.onload = function() {
        localStorage.setItem(name, reader.result);
        var names = getNames();
        if (names.indexOf(name) < 0) {
            names.push(name);
        }
        localStorage.setItem("names", JSON.stringify(names));

        if (!tile) {
            addTile(name);
        }
    };
    reader.readAsDataURL(file);
}

function addTile(name) {
    var tile = document.querySelector("div.tile").cloneNode(true);
    tile.removeAttribute("hidden");
    tile.setAttribute("data-name", name);
    tile.textContent = name;

    tile.onclick = function(evt) {
        playing.track.pause();
        if (playing.name === name) {
            return;
        }

        var data = localStorage.getItem(evt.srcElement.getAttribute("data-name"));
        if (!data) {
            console.error("Error loading " + name);
            return;
        }

        playing = {name: name, track: new Audio(data)};
        playing.track.onplay = function() {
            tile.setAttribute("data-playing", "");
        };
        playing.track.onpause = function() {
            console.info("Paused " + name);
            playing.name = null;
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
    return (localStorage.getItem("names") ? JSON.parse(localStorage.getItem("names")) : []);
}
