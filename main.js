const canvas = document.getElementById("ctx");
const c = canvas.getContext("2d");
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth();
let h = today.getHours();
let m = today.getMinutes();

let data = {
    "teamRank": 0
};

const logo = new Image();
logo.src = "logo.png";

if (dd < 10) {
    dd = "0"+dd;
}

if (mm < 10) {
    mm = "0"+mm;
}

c.imageSmoothingEnabled = true;

canvas.width = 1600;
canvas.height = 900;

function init() {
    
    window.requestAnimationFrame(draw);
}

init();

function draw() {
    today = new Date();
    h = today.getHours();
    m = today.getMinutes();
    
    c.save();
    c.translate(0, canvas.height);
    c.rotate(-(Math.PI/180)*90);
    
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.height, canvas.width);
    
    c.textBaseline = "top";
    c.font = "50px Segoe UI Light"
    c.fillStyle = "white";
    c.fillText(mm+"/"+dd, 30, 30);
    c.fillText(h+":"+((m < 10)? m+"0":m), 740, 40);
    c.fillText("#"+data["teamRank"], 30, 80);
    
    c.drawImage(logo, 300, 10, 300, 300);
    
    c.restore();
    
    window.requestAnimationFrame(draw);
}


let requestTeamStatus = "https://www.thebluealliance.com/api/v3/team/frc2903/event/2018wamou/status";
let teamStatus = new XMLHttpRequest();
teamStatus.open("GET", requestTeamStatus);
teamStatus.responseType = "json";
teamStatus.setRequestHeader("X-TBA-Auth-Key", "0NiCsg5pJzCGOVmZTbYk0LdTZOXcDMIQJKThzoqIVBuEWSZ5dXbtTouAspaayL5B")
teamStatus.send();

teamStatus.onload = function() {
    let information = teamStatus.response;
    console.log(information);
    data["teamRank"] = information["qual"]["ranking"]["rank"];
}

