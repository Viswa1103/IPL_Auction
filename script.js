let playerData = [];
let visitedPlayers = new Set();

const playerNumber = document.getElementById("playerNumber");
const playerName = document.getElementById("playerName");
const playerCountry = document.getElementById("playerCountry");
const playerSpecialism = document.getElementById("playerSpecialism");
const playerBatting = document.getElementById("playerBatting");
const playerBowlingStyle = document.getElementById("playerBowlingStyle");
const playerBasePrice = document.getElementById("playerBasePrice");
const playersAuctioned = document.getElementById("playersAuctioned");
const remainingPlayers = document.getElementById("remainingPlayers");
const remainingPlayersList = document.getElementById("remainingPlayersList");

async function loadPlayerData() {
    const response = await fetch("players.json");
    playerData = await response.json();
    updateRemainingPlayersList();
}

function updateRemainingPlayersList() {
    remainingPlayersList.innerHTML = "";
    playerData.forEach((_, index) => {
        if (!visitedPlayers.has(index + 1)) {
            const listItem = document.createElement("li");
            listItem.textContent = `Player #${index + 1}`;
            remainingPlayersList.appendChild(listItem);
        }
    });
}

function generateRandomPlayer() {
    if (visitedPlayers.size === playerData.length) {
        playerNumber.textContent = "Auction Over!";
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

    updateRemainingPlayersList();
}

function displayPlayerDetails(playerIndex) {
    const player = playerData[playerIndex - 1];

    playerName.innerHTML = `Name:<br><br>${player.FirstName} ${player.SecondName}`;
    playerCountry.innerHTML = `Country:<br><br>${player.Country}`;
    playerSpecialism.innerHTML = `Specialism:<br><br>${player.Specialism}`;
    playerBatting.innerHTML = `Batting:<br><br>${player.Batting}`;
    playerBowlingStyle.innerHTML = `Bowling Style:<br><br>${player.BowlingStyle}`;
    playerBasePrice.innerHTML = `Base Price:<br><br>${player.BasePrice} L`;
}

function resetAuction() {
    visitedPlayers.clear();
    playerNumber.textContent = "";
    playerName.textContent = "Welcome to the Auction!";
    playerCountry.textContent = "Click 'Generate Player' to start.";
    playerSpecialism.textContent = "";
    playerBatting.textContent = "";
    playerBowlingStyle.textContent = "";
    playerBasePrice.textContent = "";
    playersAuctioned.textContent = 0;
    remainingPlayers.textContent = playerData.length;

    updateRemainingPlayersList();
}

loadPlayerData();
