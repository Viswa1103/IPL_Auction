let playerData = [];
let visitedPlayers = new Set();
let teams = [];
let totalPlayers = 202;

const playerPoints = document.getElementById("playerPoints");
const playerName = document.getElementById("playerName");
const playerCountry = document.getElementById("playerCountry");
const playerSpecialism = document.getElementById("playerSpecialism");
const playerBatting = document.getElementById("playerBatting");
const playerBowlingStyle = document.getElementById("playerBowlingStyle");
const basePriceDisplay = document.getElementById("basePriceDisplay");
const playersAuctioned = document.getElementById("playersAuctioned");
const remainingPlayers = document.getElementById("remainingPlayers");
const teamStats = document.getElementById("teamStats");
const teamSelect = document.getElementById("teamSelect");

let currentBasePrice = 0;

async function loadPlayerData() {
    const response = await fetch("players.json");
    playerData = await response.json();
}

function initializeTeams() {
    const storedTeams = localStorage.getItem("teams");
    const storedVisitedPlayers = localStorage.getItem("visitedPlayers");

    if (storedTeams) {
        teams = JSON.parse(storedTeams);
        visitedPlayers = new Set(JSON.parse(storedVisitedPlayers || "[]"));
        updateTeamStats();
        populateTeamDropdown();
        updateAuctionStats();
    } else {
        const teamCount = prompt("Enter the number of teams:");
        teams = [];
        for (let i = 0; i < teamCount; i++) {
            const teamName = prompt(`Enter the name of Team ${i + 1}:`);
            teams.push({ name: teamName, purse: 10000 });
        }
        updateTeamStats();
        populateTeamDropdown();
        saveData();
    }
}

function saveData() {
    localStorage.setItem("teams", JSON.stringify(teams));
    localStorage.setItem("visitedPlayers", JSON.stringify(Array.from(visitedPlayers)));
}

function clearData() {
    localStorage.removeItem("teams");
    localStorage.removeItem("visitedPlayers");
}

function updateTeamStats() {
    teamStats.innerHTML = teams
        .map(
            (team) =>
                `<p><strong>${team.name}:</strong> ₹${team.purse} L remaining</p>`
        )
        .join("");
}

function populateTeamDropdown() {
    teamSelect.innerHTML = teams
        .map((team, index) => `<option value="${index}">${team.name}</option>`)
        .join("");
}

function updateAuctionStats() {
    playersAuctioned.textContent = visitedPlayers.size;
    remainingPlayers.textContent = totalPlayers - visitedPlayers.size;
}

function generateRandomPlayer() {
    if (visitedPlayers.size === playerData.length) {
        playerPoints.textContent = "Auction Over!";
        clearPlayerDetails();
        return;
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * playerData.length) + 1;
    } while (visitedPlayers.has(randomNumber));

    visitedPlayers.add(randomNumber);
    displayPlayerDetails(randomNumber);

    updateAuctionStats();
    saveData();
}

function displayPlayerDetails(playerIndex) {
    const player = playerData[playerIndex - 1];

    const randomPoints = Math.floor(Math.random() * 7) * 5 + 20;

    playerPoints.textContent = `Points: ${randomPoints}`;
    playerName.innerHTML = `Name:<br><br>${player.FirstName} ${player.SecondName}`;
    playerCountry.innerHTML = `Country:<br><br>${player.Country}`;
    playerSpecialism.innerHTML = `Specialism:<br><br>${player.Specialism}`;
    playerBatting.innerHTML = `Batting:<br><br>${player.Batting}`;
    playerBowlingStyle.innerHTML = `Bowling Style:<br><br>${player.BowlingStyle}`;
    currentBasePrice = player.BasePrice;
    updateBasePriceDisplay();
}

function clearPlayerDetails() {
    playerName.textContent = "";
    playerCountry.textContent = "";
    playerSpecialism.textContent = "";
    playerBatting.textContent = "";
    playerBowlingStyle.textContent = "";
    basePriceDisplay.textContent = "";
}

function increasePrice() {
    if (currentBasePrice <= 100) {
        currentBasePrice += 20;
    } else {
        currentBasePrice += 25;
    }
    updateBasePriceDisplay();
}

function decreasePrice() {
    if (currentBasePrice > 20) {
        if (currentBasePrice <= 100) {
            currentBasePrice -= 20;
        } else {
            currentBasePrice -= 25;
        }
        updateBasePriceDisplay();
    }
}

function updateBasePriceDisplay() {
    basePriceDisplay.textContent = `${currentBasePrice} L`;
}

function sellPlayer() {
    const selectedTeamIndex = parseInt(teamSelect.value);
    const selectedTeam = teams[selectedTeamIndex];

    if (selectedTeam.purse >= currentBasePrice) {
        selectedTeam.purse -= currentBasePrice;
        updateTeamStats();
        saveData();
        alert(
            `Player sold to ${selectedTeam.name} for ₹${currentBasePrice} L! Remaining Purse: ₹${selectedTeam.purse} L`
        );
    } else {
        alert("Insufficient purse! Cannot purchase this player.");
    }
}

function resetAuction() {
    clearData();
    visitedPlayers.clear();
    clearPlayerDetails();
    playerPoints.textContent = "";
    playersAuctioned.textContent = 0;
    remainingPlayers.textContent = totalPlayers;
    initializeTeams();
}

window.onload = () => {
    loadPlayerData();
    initializeTeams();
};
