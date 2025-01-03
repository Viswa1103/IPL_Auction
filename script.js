let playerData = [];
let visitedPlayers = new Set();
let teams = [];
let totalPlayers = 0;
let shuffledPlayers = [];
let otherPlayers = [];

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
    try {
        const response = await fetch("players.json");
        const allPlayers = await response.json();
        totalPlayers = allPlayers.length;

        const rangePlayers = allPlayers.filter(player => player.SNO >= 1 && player.SNO <= 78);
        otherPlayers = allPlayers.filter(player => player.SNO < 1 || player.SNO > 78);

        for (let i = rangePlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rangePlayers[i], rangePlayers[j]] = [rangePlayers[j], rangePlayers[i]];
        }

        shuffledPlayers = rangePlayers;

        playerData = [...shuffledPlayers, ...otherPlayers];

        const storedVisitedPlayers = localStorage.getItem("visitedPlayers");
        if (storedVisitedPlayers) {
            visitedPlayers = new Set(JSON.parse(storedVisitedPlayers));
        }

        updateAuctionStats();

        console.log("Player Data Loaded:", playerData);
    } catch (error) {
        console.error("Error loading player data:", error);
    }
}

function initializeTeams() {
    const storedTeams = localStorage.getItem("teams");

    if (storedTeams) {
        teams = JSON.parse(storedTeams);
        updateTeamStats();
        populateTeamDropdown();
    } else {
        const teamCount = prompt("Enter the number of teams:");
        teams = [];
        for (let i = 0; i < teamCount; i++) {
            const teamName = prompt(`Enter the name of Team ${i + 1}:`);
            teams.push({ name: teamName, purse: 12000 });
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

function generatePlayer() {
    if (playerData.length === 0) {
        playerPoints.textContent = "Auction Over! No more players available.";
        clearPlayerDetails();
        return;
    }

    const availablePlayers = playerData.filter(player => !visitedPlayers.has(player.SNO));

    if (availablePlayers.length === 0) {
        playerPoints.textContent = "Auction Over! All players have been visited.";
        clearPlayerDetails();
        return;
    }

    const nextPlayer = availablePlayers[0];
    visitedPlayers.add(nextPlayer.SNO);
    displayPlayerDetails(nextPlayer);
    updateAuctionStats();
    saveData();
}

function displayPlayerDetails(player) {
    const randomPoints = Math.floor(Math.random() * 7) * 5 + 20;

    playerPoints.textContent = `Points: ${randomPoints}`;
    playerName.innerHTML = `Name:<br><br>${player["First Name"]} ${player.Surname}`;
    playerCountry.innerHTML = `Country:<br><br>${player.Country}`;
    playerSpecialism.innerHTML = `Specialism:<br><br>${player.Specialism}`;
    playerBatting.innerHTML = `Batting:<br><br>${player["Batting "]}`;
    playerBowlingStyle.innerHTML = `Bowling Style:<br><br>${player["Bowling style"]}`;
    currentBasePrice = player["BASE(RS - L)"];
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
    currentBasePrice += 25;
    updateBasePriceDisplay();
}

function decreasePrice() {
    if (currentBasePrice > 25) {
        currentBasePrice -= 25;
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
    loadPlayerData();
    initializeTeams();
}

window.onload = () => {
    loadPlayerData();
    initializeTeams();
};
