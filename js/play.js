let gameData = null;

let playerCoins = 100;
let computerCoins = 0;

let currentAsset = 0;
let acquiredAssets = [];

const STORAGE_KEY = "dice-lockbox-save";

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

    if(computerCoins === 0){

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

            playerCoins:
                playerCoins,

            computerCoins:
                computerCoins,

            currentAsset:
                currentAsset,

            acquiredAssets:
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

    computerCoins =
        gameData.cover.value;

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

    updateCoins();

    renderGallery();

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

function rollDice(){

    if(playerCoins <= 0){

        alert(
            "You ran out of coins."
        );

        resetGame();

        return;

    }

    while(
        computerCoins < 20 &&
        currentAsset <
        gameData.assets.length
    ){

        autoSellAsset();

    }

    if(
        computerCoins <= 0 &&
        currentAsset >=
        gameData.assets.length
    ){

        showVictory();

        return;

    }

    const playerStake =
        Math.min(
            20,
            playerCoins
        );

    const computerStake =
        Math.min(
            20,
            computerCoins
        );

    const pot =
        playerStake +
        computerStake;

    playerCoins -=
        playerStake;

    computerCoins -=
        computerStake;

    const playerRoll =
        Math.floor(
            Math.random()*6
        ) + 1;

    const computerRoll =
        Math.floor(
            Math.random()*6
        ) + 1;

    let result =
        `You rolled ${playerRoll}. Computer rolled ${computerRoll}. `;

    if(
        playerRoll >
        computerRoll
    ){

        playerCoins +=
            pot;

        result +=
            `You win ${pot} coins!`;

    }
    else if(
        computerRoll >
        playerRoll
    ){

        computerCoins +=
            pot;

        result +=
            `Computer wins ${pot} coins!`;

    }
    else{

        playerCoins +=
            playerStake;

        computerCoins +=
            computerStake;

        result +=
            "Tie.";

    }

    document.getElementById(
        "diceResult"
    ).textContent =
        result;

    updateCoins();

    if(
        playerCoins <= 0
    ){

        alert(
            "You ran out of coins."
        );

        resetGame();

        return;

    }

    saveProgress();

}

function autoSellAsset(){

    const asset =
        gameData.assets[
            currentAsset
        ];

    acquiredAssets.push(
        asset.image
    );

    computerCoins +=
        asset.value;

    currentAsset++;

    saveProgress();

    document.getElementById(
        "gameScreen"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "assetReveal"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "soldImage"
    ).src =
        asset.image;

    document.getElementById(
        "soldValue"
    ).textContent =
        `Computer sold asset for ${asset.value} coins`;

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

    updateCoins();

    renderGallery();

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

        ...acquiredAssets,

        gameData.bonus

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

function resetGame(){

    localStorage.removeItem(
        STORAGE_KEY
    );

    location.reload();

}        const json =
            LZString
            .decompressFromEncodedURIComponent(
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

    if(computerCoins === 0){

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

    computerCoins =
        gameData.cover.value;

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

    updateCoins();

    renderGallery();

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

function rollDice(){

    if(playerCoins < 20){

        alert(
            "You ran out of coins. Starting over."
        );

        resetGame();

        return;

    }

    playerCoins -= 20;
    computerCoins -= 20;

    const playerRoll =
        Math.floor(
            Math.random()*6
        ) + 1;

    const computerRoll =
        Math.floor(
            Math.random()*6
        ) + 1;

    let resultText =
        `You rolled ${playerRoll}. Computer rolled ${computerRoll}. `;

    if(playerRoll >
       computerRoll){

        playerCoins += 40;

        resultText +=
            "You win!";

    }
    else if(
        computerRoll >
        playerRoll
    ){

        computerCoins += 40;

        resultText +=
            "Computer wins!";

    }
    else{

        playerCoins += 20;
        computerCoins += 20;

        resultText +=
            "Tie.";

    }

    document.getElementById(
        "diceResult"
    ).textContent =
        resultText;

    updateCoins();

    if(
        computerCoins <= 0
    ){

        sellAsset();

        return;

    }

    saveProgress();

}

function sellAsset(){

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

    acquiredAssets.push(
        asset.image
    );

    computerCoins =
        asset.value;

    currentAsset++;

    saveProgress();

    document.getElementById(
        "gameScreen"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "assetReveal"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "soldImage"
    ).src =
        asset.image;

    document.getElementById(
        "soldValue"
    ).textContent =
        `Asset liquidated for ${asset.value} coins`;

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

    updateCoins();

    renderGallery();

}

function renderGallery(){

    const gallery =
        document.getElementById(
            "gallery"
        );

    gallery.innerHTML = "";

    acquiredAssets.forEach(
        image => {

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                image;

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

        ...acquiredAssets,

        gameData.bonus

    ];

    images.forEach(
        src => {

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                src;

            gallery.appendChild(
                img
            );

        }
    );

}

function resetGame(){

    localStorage.removeItem(
        STORAGE_KEY
    );

    location.reload();

}
