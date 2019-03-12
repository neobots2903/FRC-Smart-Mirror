//Teamkey and eventkey used for accessing API stuff
const teamKey = "frc2903";
const eventKey = "2019wamou";
const authKey = "0NiCsg5pJzCGOVmZTbYk0LdTZOXcDMIQJKThzoqIVBuEWSZ5dXbtTouAspaayL5B";

const longNames = {
    "IMVERT (Interscholastic Mount Vernon Engineering Robotics Team)": "IMVERT",
    'Sequim Robotics Federation "SRF"': "SRF",
    "CPR - Cedar Park Robotics": "CPR",
};

const lnNames = Object.keys(longNames);

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
    "latestRedAlliance": ["", "", ""],
    "latestBlueAlliance": ["", "", ""],
    "latestRedAllianceKeys": ["", "", ""],
    "latestBlueAllianceKeys": ["", "", ""],
    "latestRedNames": ["", "", ""],
    "latestBlueNames": ["", "", ""],
    "latestRedRanks": [0, 0, 0],
    "latestBlueRanks": [0, 0, 0],
    "latestRedRPoints": [0, 0, 0],
    "latestBlueRPoints": [0, 0, 0],
    "latestMatchNum": 0,
    "topNumbers": [],
    "topNames": [],
    "topRankingPoints": [],
    "teamRankingPoints": 0,
    "teamWins": 0,
    "teamLosses": 0,
    "teamTies": 0,
    "latestMatchType": ""
};

let matchesUpdated = false;
let eventsUpdated = false;

//Loading the logo
const logo = new Image();
logo.src = "logoS.png";

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
    
    //Draw the logo
   
    
    c.textAlign = "left";
    c.textBaseline = "top";
    c.font = "60px Segoe UI Light";
    c.fillStyle = "white";
    
    //Stuff on left side of screen
    
    
    
    
    //Month and day
    c.fillText(mm+"-"+dd, 30, 30);
    
    c.font = "40px Segoe UI Light";
    c.textAlign = "center";
    
    c.save();
    
        c.translate(0, 40);
    
        c.drawImage(logo, canvas.width/2-(350)/2, 00, 350, 350);
        c.fillText(`Rank - ${data["teamRank"]} (${data["teamRankingPoints"]} RP)`, 540, 340);
        c.fillText(`${data["teamWins"]}W - ${data["teamTies"]}T - ${data["teamLosses"]}L`, 540, 400);

    c.restore();
    
    c.textAlign="right";
    
    //Stuff on right side of screen
    c.font = "60px Segoe UI Light";
    c.fillText(h+":"+((m < 10)? m+"0":m), 1050, 30);
    c.font = "35px Segoe UI Light";
    
    c.fillStyle = "white";
    c.font = "40px Segoe UI Light";
    
    
    for (let i in data["topNumbers"]) {
        c.textAlign = "left";
        c.fillText(`${parseInt(i)+1} - ${data["topNumbers"][i]}`, 30, 1140+55*i);
        
        c.textAlign = "center";
        c.fillText(data["topNames"][i], 1080/2, 1140+55*i);
        
        c.textAlign = "right";
        c.fillText(`${data["topRankingPoints"][i]} RP`, 1050, 1140+55*i);
    }
    
    c.textAlign = "center";
    c.fillText("Last", 1080/2, 1550);
    c.fillText("Match", 1080/2, 1595);
    
    c.font = "30px Segoe UI Light";
    c.fillText(data["latestMatchType"], 1080/2, 1675);
    
    c.font = "45px Segoe UI Light";
    c.fillText(data["latestMatchNum"], 1080/2, 1710);
    
    c.textAlign = "center";
    
    c.font = "40px Segoe UI Light";
    c.fillStyle = "red";
    c.fillText("Red Alliance", 200, 1450);
    
    c.font = "35px Segoe Ui Light";
    c.fillText(`${data["latestRedPoints"]} Points`, 200, 1500);
    c.fillRect(200-240/2, 1540, 240, 2);
    
    c.font = "30px Segoe Ui Light";
    
    c.textAlign = "left";
    for (let i in data["latestRedAlliance"]) {
        let teamName = `${data["latestRedAlliance"][i]} - ${data["latestRedNames"][i]}`;
        for (let t in lnNames) {
            teamName = teamName.replace(lnNames[t], longNames[lnNames[t]]);
        }
        
        c.fillText(teamName, 70, 1580+i*100);
        c.fillText(`Rank ${data["latestRedRanks"][i]} - ${data["latestRedRPoints"][i]} RP`, 70, 1620+i*100);
    }
    
    c.textAlign = "center";
    c.font = "40px Segoe UI Light";
    c.fillStyle = "cyan";
    c.fillText("Blue Alliance", 1080-200, 1450);
    
    c.font = "35px Segoe UI Light";
    c.fillText(`${data["latestBluePoints"]} Points`, 1080-200, 1500);
    c.fillRect(1080-200-240/2, 1540, 240, 2);
    
    c.font = "30px Segoe Ui Light";
    
    c.textAlign = "right";
    for (let i in data["latestBlueAlliance"]) {
        let teamName = `${data["latestBlueAlliance"][i]} - ${data["latestBlueNames"][i]}`;
        for (let t in lnNames) {
            teamName = teamName.replace(lnNames[t], longNames[lnNames[t]]);
        }
        
        c.fillText(teamName, 1080-70, 1580+i*100);
        c.fillText(`Rank ${data["latestBlueRanks"][i]} - ${data["latestBlueRPoints"][i]} RP`, 1080-70, 1620+i*100);
    }
    
    
    //Restore transformations to default
    c.restore();
    
    if (matchesLoaded && teamsLoaded && eventsLoaded) {
        processMatches();
        processMatchesAndTeams();
        matchesLoaded = false;
        matchesUpdated = true;
    }
    
    if (teamStatusLoaded) {
        processTeamStatus();
        teamStatusLoaded = false;
    }
    
    if (teamsLoaded && eventsLoaded && !eventsProcessed) {
        processEventRankings();
        processRankingsAndTeams();
        data["topNames"] = topNames;
        eventsProcessed = true;
        eventsUpdated = true;
    }
    
    if (matchesUpdated && eventsUpdated) {
        matchesUpdated = false;
        eventsUpdated = false;
        eventsLoaded = false;
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

let teamStatusInfo;
let teamStatusLoaded = false;

teamStatus.onload = function() {
    teamStatusInfo = teamStatus.response;
    teamStatusLoaded = true;
    //console.log(information);
}

function processTeamStatus() {
    data["teamRank"] = teamStatusInfo["qual"]["ranking"]["rank"];
    
    data["teamWins"] = teamStatusInfo["qual"]["ranking"]["record"]["wins"];
    data["teamLosses"] = teamStatusInfo["qual"]["ranking"]["record"]["losses"];
    data["teamTies"] = teamStatusInfo["qual"]["ranking"]["record"]["ties"];
}


//Request data pertaining to matches our robot was involved in
let requestMatches = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`;
let matches = new XMLHttpRequest();

matches.open("GET", requestMatches);
matches.responseType = "json";
matches.setRequestHeader("X-TBA-Auth-Key", authKey);
matches.send();

let matchesInfo;
let matchesLoaded = false;

matches.onload = function() {
    matchesInfo = matches.response;
    matchesLoaded = true;
}

function processMatches() {
    
    console.log(matchesInfo);
    
    let latestTime = 0;
    let latestTimeKey = 0;
    for (let i in matchesInfo) {
        if (matchesInfo[i]["actual_time"] > latestTime/* && matchesInfo[i]["comp_level"] == "qm"*/) {
            latestTimeKey = i;
            latestTime = matchesInfo[i]["actual_time"];
        }
    }
    
    data["latestRedPoints"] = matchesInfo[latestTimeKey]["alliances"]["red"]["score"];
    data["latestBluePoints"] = matchesInfo[latestTimeKey]["alliances"]["blue"]["score"];
    
    let redTeamKeys = matchesInfo[latestTimeKey]["alliances"]["red"]["team_keys"];
    let redTeamNumbers = [];
    for (let i in redTeamKeys) {
        redTeamNumbers.push(redTeamKeys[i].slice(3, redTeamKeys[i].length));
    }
    
    data["latestRedAlliance"] = redTeamNumbers;
    data["latestRedAllianceKeys"] = redTeamKeys;
    
    let blueTeamKeys = matchesInfo[latestTimeKey]["alliances"]["blue"]["team_keys"];
    let blueTeamNumbers = [];
    for (let i in blueTeamKeys) {
        blueTeamNumbers.push(blueTeamKeys[i].slice(3, blueTeamKeys[i].length));
    }
    
    data["latestBlueAlliance"] = blueTeamNumbers;
    data["latestBlueAllianceKeys"] = blueTeamKeys
    
    data["latestMatchNum"] = matchesInfo[latestTimeKey]["match_number"];
    
    let compLevel = matchesInfo[latestTimeKey]["comp_level"];
    switch(compLevel) {
        case "f":
            compLevel = "Finals";
            break;
        case "qf":
            compLevel = "Quarterfinals";
            break;
        case "sf":
            compLevel = "Semifinals";
            break;
        case "qm":
            compLevel = "Qualification";
    }
    
    data["latestMatchType"] = compLevel;
    
}

function processMatchesAndTeams() {
    
    
    for (let i in teamInfo) {
        if (data["latestRedAllianceKeys"][0] == teamInfo[i]["key"]) {
            data["latestRedNames"][0] = teamInfo[i]["nickname"];
        } else if (data["latestRedAllianceKeys"][1] == teamInfo[i]["key"]) {
            data["latestRedNames"][1] = teamInfo[i]["nickname"];
        } else if (data["latestRedAllianceKeys"][2] == teamInfo[i]["key"]) {
            data["latestRedNames"][2] = teamInfo[i]["nickname"];
        }
        
        if (data["latestBlueAllianceKeys"][0] == teamInfo[i]["key"]) {
            data["latestBlueNames"][0] = teamInfo[i]["nickname"];
        } else if (data["latestBlueAllianceKeys"][1] == teamInfo[i]["key"]) {
            data["latestBlueNames"][1] = teamInfo[i]["nickname"];
        } else if (data["latestBlueAllianceKeys"][2] == teamInfo[i]["key"]) {
            data["latestBlueNames"][2] = teamInfo[i]["nickname"];
        }
    }
    
    for (let i in eventsInfo["rankings"]) {
        if (eventsInfo["rankings"][i]["team_key"] == data["latestRedAllianceKeys"][0]) {
            data["latestRedRanks"][0] = eventsInfo["rankings"][i]["rank"];
            data["latestRedRPoints"][0] = eventsInfo["rankings"][i]["extra_stats"][0];
        } else if (eventsInfo["rankings"][i]["team_key"] == data["latestRedAllianceKeys"][1]) {
            data["latestRedRanks"][1] = eventsInfo["rankings"][i]["rank"];
            data["latestRedRPoints"][1] = eventsInfo["rankings"][i]["extra_stats"][0];
        } else if (eventsInfo["rankings"][i]["team_key"] == data["latestRedAllianceKeys"][2]) {
            data["latestRedRanks"][2] = eventsInfo["rankings"][i]["rank"];
            data["latestRedRPoints"][2] = eventsInfo["rankings"][i]["extra_stats"][0];
        }
        
        if (eventsInfo["rankings"][i]["team_key"] == data["latestBlueAllianceKeys"][0]) {
            data["latestBlueRanks"][0] = eventsInfo["rankings"][i]["rank"];
            data["latestBlueRPoints"][0] = eventsInfo["rankings"][i]["extra_stats"][0];
        } else if (eventsInfo["rankings"][i]["team_key"] == data["latestBlueAllianceKeys"][1]) {
            data["latestBlueRanks"][1] = eventsInfo["rankings"][i]["rank"];
            data["latestBlueRPoints"][1] = eventsInfo["rankings"][i]["extra_stats"][0];
        } else if (eventsInfo["rankings"][i]["team_key"] == data["latestBlueAllianceKeys"][2]) {
            data["latestBlueRanks"][2] = eventsInfo["rankings"][i]["rank"];
            data["latestBlueRPoints"][2] = eventsInfo["rankings"][i]["extra_stats"][0];
        }
    }
    
}



//Request data pertaining to teams at the event
let requestTeams = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`;
let teams = new XMLHttpRequest();

teams.open("GET", requestTeams);
teams.responseType = "json";
teams.setRequestHeader("X-TBA-Auth-Key", authKey);
teams.send();

let teamsLoaded = false;
let teamInfo;

teams.onload = function() {
    teamInfo = teams.response;
    teamsLoaded = true;
}

function processTeamInfo() {
    
}



//Request data pertaining to all teams attending the event
let requestEventRankings = `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`;
let eventRankings = new XMLHttpRequest();

eventRankings.open("GET", requestEventRankings);
eventRankings.responseType = "json";
eventRankings.setRequestHeader("X-TBA-Auth-Key", authKey);
eventRankings.send();

let topKeys = [];
let topNames = [];

let eventsLoaded = false;
let eventsInfo;
let eventsProcessed = false;

eventRankings.onload = function() {
    let information = eventRankings.response;
    eventsInfo = eventRankings.response;
    eventsLoaded = true;
}

function processEventRankings() {
    
    data["topNumbers"] = [];
    data["topRankingPoints"] = [];
    
    for (var i  = 0 ; i < 5 ; i++) {
        data["topNumbers"].push(eventsInfo["rankings"][i]["team_key"].slice(3, eventsInfo["rankings"][0]["team_key"].length));
        data["topRankingPoints"].push(eventsInfo["rankings"][i]["extra_stats"][0]);
        topKeys.push(eventsInfo["rankings"][i]["team_key"]);
    }
    
    let ourTeamKey = 0;
    for (let i in eventsInfo["rankings"]) {
        if (eventsInfo["rankings"][i]["team_key"] == "frc2903") {
            ourTeamKey = i;
            break;
        }
    }
    
    data["teamRankingPoints"] = eventsInfo["rankings"][ourTeamKey]["extra_stats"][0];
    
}

function processRankingsAndTeams() {
    for (let i in teamInfo) {
        if (topKeys[0] == teamInfo[i]["key"]) {
            topNames[0] = teamInfo[i]["nickname"];
        } else if (topKeys[1] == teamInfo[i]["key"]) {
            topNames[1] = teamInfo[i]["nickname"];
        } else if (topKeys[2] == teamInfo[i]["key"]) {
            topNames[2] = teamInfo[i]["nickname"];
        } else if (topKeys[3] == teamInfo[i]["key"]) {
            topNames[3] = teamInfo[i]["nickname"];
        } else if (topKeys[4] == teamInfo[i]["key"]) {
            topNames[4] = teamInfo[i]["nickname"];
        }
    }
    
}

window.setInterval(() => {
    teamStatus.open("GET", requestTeamStatus);
    teamStatus.responseType = "json";
    teamStatus.setRequestHeader("X-TBA-Auth-Key", authKey);
    teamStatus.send();
    
    matches.open("GET", requestMatches);
    matches.responseType = "json";
    matches.setRequestHeader("X-TBA-Auth-Key", authKey);
    matches.send();
    
    teams.open("GET", requestTeams);
    teams.responseType = "json";
    teams.setRequestHeader("X-TBA-Auth-Key", authKey);
    teams.send();
    
    eventRankings.open("GET", requestEventRankings);
    eventRankings.responseType = "json";
    eventRankings.setRequestHeader("X-TBA-Auth-Key", authKey);
    eventRankings.send();
    
    console.log("data updated");
}, 60000)

/*let dfkja = "https://www.thebluealliance.com/api/v3/district/2018pnw/events";
let asdfl = new XMLHttpRequest();

asdfl.open("GET", dfkja);
asdfl.responseType = "json";
asdfl.setRequestHeader("X-TBA-Auth-Key", authKey);
asdfl.send();

asdfl.onload = function() {
    console.log(asdfl.response);
}*/