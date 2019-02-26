//Teamkey and eventkey used for accessing API stuff
const teamKey = "frc2903";
const eventKey = "2018wamou";
const authKey = "0NiCsg5pJzCGOVmZTbYk0LdTZOXcDMIQJKThzoqIVBuEWSZ5dXbtTouAspaayL5B";

//Variables relating to canvas
const canvas = document.getElementById("ctx");
const c = canvas.getContext("2d");

//Variables for date and time
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth();
let h = today.getHours();
let m = today.getMinutes();

//Object to hold data displayed onscreen
let data = {
    "teamRank": 0,
    "latestRedPoints": 0,
    "latestBluePoints": 0,
    "latestRedAlliance": [],
    "latestBlueAlliance": [],
    "topThreeNumbers": [],
    "topThreeNames": [],
    "topThreeRankingPoints": [],
    "ourRankingPoints": 0
};

let teamInformation = {};

//Loading the logo
const logo = new Image();
logo.src = "logo.png";

//Add extra zeros to the date and month if need be
if (dd < 10) {
    dd = "0"+dd;
}

if (mm < 10) {
    mm = "0"+mm;
}

//c.imageSmoothingEnabled = true;

//Setting canvas width and height to computer screen resolution (prone to change)
canvas.width = 1080;
canvas.height = 1920;

//Initialize stuff
function init() {
    
    window.requestAnimationFrame(draw);
}

init();

//Draw is called repeatedly
function draw() {
    //Update date and hour
    today = new Date();
    h = today.getHours();
    m = today.getMinutes();
    
    //Save a matrix, then translate and rotate everything since smart mirror will be vertical
    c.save();
    
    //Redraw a black square in the background to prevent ugly blur
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.textAlign = "center";
    c.textBaseline = "top";
    c.font = "50px Segoe UI Light";
    c.fillStyle = "white";
    
    //Stuff on left side of screen
    c.fillText(mm+"/"+dd, 80, 30);
    
    c.fillText("#"+data["teamRank"], 60, 80);
    
    //Stuff on right side of screen
    c.fillText(h+":"+((m < 10)? m+"0":m), 820, 40);
    c.font = "35px Segoe UI Light";
    
    c.fillText("Most Recent Match", 740, 100);
    
    c.fillStyle = "red";
    c.fillText("Red", 660, 140);
    c.font = "45px Segoe Ui Light";
    c.fillText(data["latestRedPoints"], 660, 180);
    
    c.font = "20px Segoe Ui Light";
    c.fillText(data["latestRedAlliance"].join("|"), 660, 220);
    
    c.font = "35px Segoe UI Light";
    c.fillStyle = "cyan";
    c.fillText("Blue", 800, 140);
    c.font = "45px Segoe UI Light";
    c.fillText(data["latestBluePoints"], 800, 180);
    
    c.font = "20px Segoe Ui Light";
    c.fillText(data["latestBlueAlliance"].join("|"), 800, 220);
    
    c.font = "50px Segoe UI Light";
    c.fillStyle = "white";
    c.fillText("Top Ranking Teams", 830, 260);
    
    c.textAlign = "left";
    
    c.font = "40px Segoe UI Light";
    c.fillText("1. "+data["topThreeNumbers"][0], 650, 340);
    
    c.font = "30px Segoe UI Light";
    c.fillText(data["topThreeNames"][0]+"\t\t\t"+data["topThreeRankingPoints"][0]+" RP", 650, 380);
    
    c.font = "40px Segoe UI Light";
    c.fillText("2. "+data["topThreeNumbers"][1], 650, 340+100);
    
    c.font = "30px Segoe UI Light";
    c.fillText(data["topThreeNames"][1]+"\t\t\t"+data["topThreeRankingPoints"][1]+" RP", 650, 380+100);
    
    c.font = "40px Segoe UI Light";
    c.fillText("3. "+data["topThreeNumbers"][2], 650, 340+200);
    
    c.font = "30px Segoe UI Light";
    c.fillText(data["topThreeNames"][2]+"\t\t\t"+data["topThreeRankingPoints"][2]+" RP", 650, 380+200);
    
    //Draw the logo
    c.drawImage(logo, 280, 10, 300, 300);
    
    //Restore transformations to default
    c.restore();
    
    if (teamsFinishedLoading && eventsFinishedLoading) {
        for (let i in teamInformation) {
        if (topThreeKeys[0] == teamInformation[i]["key"]) {
            topThreeNames[0] = teamInformation[i]["nickname"];
        } else if (topThreeKeys[1] == teamInformation[i]["key"]) {
            topThreeNames[1] = teamInformation[i]["nickname"];
        } else if (topThreeKeys[2] == teamInformation[i]["key"]) {
            topThreeNames[2] = teamInformation[i]["nickname"];
        }
        teamsFinishedLoading = false;
    }
    
    data["topThreeNames"] = topThreeNames;
    }
    
    //I don't actually know what this does to be honest, stack overflow just told me to put this here and it works
    window.requestAnimationFrame(draw);
}

//Request data pertaining to our team status
let requestTeamStatus = `https://www.thebluealliance.com/api/v3/team/${teamKey}/event/${eventKey}/status`;
let teamStatus = new XMLHttpRequest();

teamStatus.open("GET", requestTeamStatus);
teamStatus.responseType = "json";
teamStatus.setRequestHeader("X-TBA-Auth-Key", authKey);
teamStatus.send();

teamStatus.onload = function() {
    let information = teamStatus.response;
    //console.log(information);
    data["teamRank"] = information["qual"]["ranking"]["rank"];
}

//Request data pertaining to matches our robot was involved in
let requestTeamMatches = `https://www.thebluealliance.com/api/v3/team/${teamKey}/event/${eventKey}/matches`;
let teamMatches = new XMLHttpRequest();

teamMatches.open("GET", requestTeamMatches);
teamMatches.responseType = "json";
teamMatches.setRequestHeader("X-TBA-Auth-Key", authKey);
teamMatches.send();

teamMatches.onload = function() {
    let information = teamMatches.response;
    //console.log(information);
    
    
    //Modify [0] so that it actually grabs the latest match
    
    let latestTime = 0;
    let latestTimeKey = 0;
    for (let i in information) {
        if (information[i]["actual_time"] > latestTime) {
            latestTimeKey = i;
            latestTime = information[i]["actual_time"];
        }
    }
    
    data["latestRedPoints"] = information[latestTimeKey]["alliances"]["red"]["score"];
    data["latestBluePoints"] = information[latestTimeKey]["alliances"]["blue"]["score"];
    
    let redTeamKeys = information[latestTimeKey]["alliances"]["red"]["team_keys"];
    for (let i in redTeamKeys) {
        redTeamKeys[i] = redTeamKeys[i].slice(3, redTeamKeys[i].length);
    }
    
    data["latestRedAlliance"] = redTeamKeys;
    
    let blueTeamKeys = information[latestTimeKey]["alliances"]["blue"]["team_keys"];
    for (let i in blueTeamKeys) {
        blueTeamKeys[i] = blueTeamKeys[i].slice(3, blueTeamKeys[i].length);
    }
    
    data["latestBlueAlliance"] = blueTeamKeys;
}

//Request data pertaining to teams at the event
let requestTeams = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`;
let teams = new XMLHttpRequest();

teams.open("GET", requestTeams);
teams.responseType = "json";
teams.setRequestHeader("X-TBA-Auth-Key", authKey);
teams.send();


let teamsFinishedLoading = false;
teams.onload = function() {
    let information = teams.response;
    teamInformation = information;
    teamsFinishedLoading = true;
}

//Request data pertaining to all teams attending the event
let requestEventRankings = `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`;
let eventRankings = new XMLHttpRequest();

eventRankings.open("GET", requestEventRankings);
eventRankings.responseType = "json";
eventRankings.setRequestHeader("X-TBA-Auth-Key", authKey);
eventRankings.send();

let topThreeKeys = [];
let topThreeNames = [];

let eventsFinishedLoading = false;
eventRankings.onload = function() {
    let information = eventRankings.response;
    console.log(information);
    
    data["topThreeNumbers"] = [information["rankings"][0]["team_key"].slice(3, information["rankings"][0]["team_key"].length),
                               information["rankings"][1]["team_key"].slice(3, information["rankings"][1]["team_key"].length),
                               information["rankings"][2]["team_key"].slice(3, information["rankings"][2]["team_key"].length)
                              ];
    
    
    data["topThreeRankingPoints"] = [information["rankings"][0]["extra_stats"][0],
                                     information["rankings"][1]["extra_stats"][0],
                                     information["rankings"][2]["extra_stats"][0]
                                    ];
    
    topThreeKeys = [information["rankings"][0]["team_key"],
                        information["rankings"][1]["team_key"],
                        information["rankings"][2]["team_key"]
                       ];
    
    topThreeNames = ["", "", ""];
    
    console.log(teamInformation);
    
    eventsFinishedLoading = true;
}


