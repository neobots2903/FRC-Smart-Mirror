const canvas = document.getElementById("ctx");
const c = canvas.getContext("2d");
    
c.imageSmoothingEnabled = true;

canvas.width = 1600;
canvas.height = 900;

function init() {
    
    window.requestAnimationFrame(draw);
}

init();

let x = 0;

let requestURL = "https://www.thebluealliance.com/api/v3/teams/1";
let request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.setRequestHeader("X-TBA-Auth-Key", "0NiCsg5pJzCGOVmZTbYk0LdTZOXcDMIQJKThzoqIVBuEWSZ5dXbtTouAspaayL5B")
request.send();

request.onload = function() {
    let information = request.response;
    console.log("wowee");
    console.log(information);
}



function draw() {
    
    
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.font = "150px cursive"
    c.fillStyle = "red";
    c.fillText("wowee", x++, 100);
    
    if (x == canvas.height) {
        x= -100;
    }
    
    window.requestAnimationFrame(draw);
}

