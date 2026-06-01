let gameData = null;

let playerCoins = 100;
let computerCoins = 100;

let currentAsset = 0;
let acquiredAssets = [];

let playerDice = [];
let playerTotal = 0;

const STORAGE_KEY = "gamblers-lockbox-save-v1";

const diceFaces = [
    "",
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
];

document.addEventListener(
    "DOMContentLoaded",
    init
);

function init(){

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );

    if(!hash){

        document.getElementById(
            "loading"
        ).innerHTML =
        "<h2>No lockbox data found.</h2>";

        return;

    }

    try{

        const json =
            LZString.decompressFromEncodedURIComponent(
                hash
            );

        gameData =
            JSON.parse(json);

        loadProgress();

    }
    catch(err){

        console.error(err);

        document.getElementById(
            "loading"
        ).innerHTML =
        "<h2>Invalid lockbox link.</h2>";

    }

}

function loadProgress(){

    const save =
        localStorage.getItem(
            STORAGE_KEY
        );

    if(save){

        try{

            const data =
                JSON.parse(save);

            if(
                data.hash ===
                window.location.hash
            ){

                playerCoins =
                    data.playerCoins;

                computerCoins =
                    data.computerCoins;

                currentAsset =
                    data.currentAsset;

                acquiredAssets =
                    data.acquiredAssets || [];

            }

        }
        catch(e){}

    }

    document.getElementById(
        "loading"
    ).classList.add(
        "hidden"
    );

    if(
        playerCoins === 100 &&
        computerCoins === 100 &&
        currentAsset === 0
    ){

        showCover();

    }
    else{

        startGameUI();

    }

}

function saveProgress(){

    localStorage.setItem(
        STORAGE_KEY,

        JSON.stringify({

            hash:
                window.location.hash,

            playerCoins,

            computerCoins,

            currentAsset,

            acquiredAssets

        })

    );

}

function showCover(){

    document.getElementById(
        "coverScreen"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "coverImage"
    ).src =
        gameData.cover.image;

}

function startGame(){

    document.getElementById(
        "coverScreen"
    ).classList.add(
        "hidden"
    );

    playerCoins = 100;
    computerCoins = 100;

    currentAsset = 0;
    acquiredAssets = [];

    saveProgress();

    startGameUI();

}

function startGameUI(){

    document.getElementById(
        "gameScreen"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "opponentName"
    ).textContent =
        gameData.opponent ||
        "Computer";

    document.getElementById(
        "resultOpponentName"
    ).textContent =
        `${gameData.opponent || "Computer"} Roll`;

    updateCoins();
    renderGallery();
    showRollPhase();

}

function updateCoins(){

    document.getElementById(
        "playerCoins"
    ).textContent =
        playerCoins;

    document.getElementById(
        "computerCoins"
    ).textContent =
        computerCoins;

}

function showRollPhase(){

    document.getElementById(
        "rollPhase"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "decisionPhase"
    ).classList.add(
        "hidden"
    );

}

function rollPlayerDice(){

    playerDice = [
        rollDie(),
        rollDie()
    ];

    playerTotal =
        playerDice[0] +
        playerDice[1];

    document.getElementById(
        "playerDice"
    ).textContent =

        diceFaces[
            playerDice[0]
        ] +

        " " +

        diceFaces[
            playerDice[1]
        ];

    document.getElementById(
        "rollPhase"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "decisionPhase"
    ).classList.remove(
        "hidden"
    );

}

function foldRound(){

    playerCoins -= 10;
    computerCoins += 10;

    updateCoins();

    if(
        playerCoins <= 0
    ){

        gameOver();
        return;

    }

    saveProgress();

    alert(
        `${gameData.opponent || "Computer"} wins 10 coins.`
    );

    showRollPhase();

}

function playRound(betAmount){

    if(
        playerCoins < betAmount
    ){

        alert(
            "Not enough coins."
        );

        return;

    }

    const playerBet =
        betAmount;

    const computerBet =
        Math.min(
            betAmount,
            computerCoins
        );

    playerCoins -=
        playerBet;

    computerCoins -=
        computerBet;

    const computerDice = [
        rollDie(),
        rollDie()
    ];

    const computerTotal =
        computerDice[0] +
        computerDice[1];

    const pot =
        playerBet +
        computerBet;

    let message = "";

    if(
        playerTotal >
        computerTotal
    ){

        playerCoins +=
            pot;

        message =
            `You win ${pot} coins!`;

    }
    else if(
        computerTotal >
        playerTotal
    ){

        computerCoins +=
            pot;

        message =
            `${gameData.opponent || "Computer"} wins ${pot} coins!`;

    }
    else{

        playerCoins +=
            playerBet;

        computerCoins +=
            computerBet;

        message =
            "Tie. Bets returned.";

    }

    updateCoins();

    document.getElementById(
        "resultPlayerDice"
    ).textContent =

        diceFaces[
            playerDice[0]
        ] +

        " " +

        diceFaces[
            playerDice[1]
        ];

    document.getElementById(
        "resultComputerDice"
    ).textContent =

        diceFaces[
            computerDice[0]
        ] +

        " " +

        diceFaces[
            computerDice[1]
        ];

    document.getElementById(
        "resultMessage"
    ).textContent =
        message;

    document.getElementById(
        "gameScreen"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "resultScreen"
    ).classList.remove(
        "hidden"
    );

    saveProgress();

}

function nextRound(){

    document.getElementById(
        "resultScreen"
    ).classList.add(
        "hidden"
    );

    if(
        playerCoins <= 0
    ){

        gameOver();
        return;

    }

    if(
        computerCoins <= 0
    ){

        processComputerLoss();
        return;

    }

    document.getElementById(
        "gameScreen"
    ).classList.remove(
        "hidden"
    );

    showRollPhase();

}

function processComputerLoss(){

    if(
        currentAsset >=
        gameData.assets.length
    ){

        showVictory();
        return;

    }

    const asset =
        gameData.assets[
            currentAsset
        ];
    
    playerCoins -=
        asset.value;
    
    computerCoins +=
        asset.value;
    
    acquiredAssets.push(
        asset.image
    );
    
    currentAsset++;
    
    updateCoins();

    saveProgress();

    document.getElementById(
        "soldImage"
    ).src =
        asset.image;

    document.getElementById(
        "soldValue"
    ).textContent =

        `${gameData.opponent || "Computer"} is a loser and is forced to sell you this picture for ${asset.value} coins`;

    document.getElementById(
        "assetReveal"
    ).classList.remove(
        "hidden"
    );

    renderGallery();

    if(
        playerCoins <= 0
    ){

        gameOver();

    }

}

function continueGame(){

    document.getElementById(
        "assetReveal"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "gameScreen"
    ).classList.remove(
        "hidden"
    );

    showRollPhase();

}

function renderGallery(){

    const gallery =
        document.getElementById(
            "gallery"
        );

    gallery.innerHTML = "";

    acquiredAssets.forEach(
        src => {

            const img =
                document.createElement(
                    "img"
                );

            img.src = src;

            gallery.appendChild(
                img
            );

        }
    );

}

function showVictory(){

    localStorage.removeItem(
        STORAGE_KEY
    );

    document.getElementById(
        "gameScreen"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "assetReveal"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "resultScreen"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "victoryScreen"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "bonusImage"
    ).src =
        gameData.bonus;

    const gallery =
        document.getElementById(
            "finalGallery"
        );

    gallery.innerHTML = "";

    const images = [

        gameData.cover.image,

        ...acquiredAssets

    ];

    images.forEach(
        src => {

            const img =
                document.createElement(
                    "img"
                );

            img.src = src;

            gallery.appendChild(
                img
            );

        }
    );

}

function gameOver(){

    localStorage.removeItem(
        STORAGE_KEY
    );

    alert(
        "You ran out of coins. Starting over."
    );

    location.reload();

}

function rollDie(){

    return Math.floor(
        Math.random() * 6
    ) + 1;

}
