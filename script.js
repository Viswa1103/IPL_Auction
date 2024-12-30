let playerData = [];
let visitedPlayers = new Set();

const playerPoints = document.getElementById("playerPoints");
const playerName = document.getElementById("playerName");
const playerCountry = document.getElementById("playerCountry");
const playerSpecialism = document.getElementById("playerSpecialism");
const playerBatting = document.getElementById("playerBatting");
const playerBowlingStyle = document.getElementById("playerBowlingStyle");
const playerBasePrice = document.getElementById("playerBasePrice");
const playersAuctioned = document.getElementById("playersAuctioned");
const remainingPlayers = document.getElementById("remainingPlayers");

async function loadPlayerData() {
    const response = await fetch("players.json");
    playerData = await response.json();
}

function generateRandomPlayer() {
    if (visitedPlayers.size === playerData.length) {
        playerPoints.textContent = "Auction Over!";
        playerName.textContent = "";
        playerCountry.textContent = "";
        playerSpecialism.textContent = "";
        playerBatting.textContent = "";
        playerBowlingStyle.textContent = "";
        playerBasePrice.textContent = "";
        return;
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * playerData.length) + 1;
    } while (visitedPlayers.has(randomNumber));

    visitedPlayers.add(randomNumber);
    displayPlayerDetails(randomNumber);

    playersAuctioned.textContent = visitedPlayers.size;
    remainingPlayers.textContent = playerData.length - visitedPlayers.size;
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
    playerBasePrice.innerHTML = `Base Price:<br><br>${player.BasePrice} L`;
}

function resetAuction() {
    visitedPlayers.clear();
    playerPoints.textContent = "";
    playerName.textContent = "Welcome to the Auction!";
    playerCountry.textContent = "Click here to start.";
    playerSpecialism.textContent = "";
    playerBatting.textContent = "";
    playerBowlingStyle.textContent = "";
    playerBasePrice.textContent = "";
    playersAuctioned.textContent = 0;
    remainingPlayers.textContent = playerData.length;
}

loadPlayerData();
