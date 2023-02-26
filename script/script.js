var startScreen = document.querySelector("#start-screen");
var startText = document.querySelector("#start-text");

var dialogueEl = document.querySelector("#dialogue-cont");
var dialogueBox = document.querySelector("#dialogue");
var confirmEl = document.querySelector("#confirm-arrow");

var fightOptionsEl = document.querySelector("#fight-options");
var fightEl = document.querySelector("#fight");
var pkmnEl = document.querySelector("#pkmn");
var itemsEl = document.querySelector("#items");
var runEl = document.querySelector("#run");

var pikamanEl = document.querySelector("#pikaman");
var pikamanREl = document.querySelector("#pikamanR");
var pikamanTurnEl = document.querySelector("#pikaman-turning");
var pikamanLookEl = document.querySelector("#pikaman-looking");

var puppetMasterEl = document.querySelector("#puppet-master");
var puppetMasterREl = document.querySelector("#puppet-masterR");

var pokaballEl = document.querySelector("#pokaball");

var playerStats = document.querySelector("#player-pokeman");
var opponentStats = document.querySelector("#opponent-pokeman");

/*
------------------------------------------------------------
Sounds
------------------------------------------------------------
*/

var open = new Audio("./sounds/pokeball-opening.mp3");
var battle = new Audio("./sounds/battle-music.mp3");
var throwing = new Audio("./sounds/pokeball-throwing.mp3");
var pressA = new Audio("./sounds/a-sound.mp3");
var woosh1 = new Audio("./sounds/woosh1.mp3");
var woosh2 = new Audio("./sounds/woosh2.mp3");

var neckBreak = new Audio("./sounds/neck-snap.mp3");
var pikaman1 = new Audio("./sounds/pikaman1.mp3");
var pikaman2 = new Audio("./sounds/pikaman2.mp3");

var puppetMasterSound1 = new Audio("./sounds/puppet1.mp3");
var puppetMasterSound2 = new Audio("./sounds/puppet2.mp3");
var puppetMasterSound3 = new Audio("./sounds/puppet3.mp3");
var puppetMasterSound4 = new Audio("./sounds/puppet4.mp3");

puppetMasterSound3.volume = 0.25;
pressA.volume = 0.5;

/*
------------------------------------------------------------
Shorthands
------------------------------------------------------------
*/

var add = document.addEventListener;
var remove = document.removeEventListener;
var once = { once : true };

/*
------------------------------------------------------------
General Use Functions
------------------------------------------------------------
*/

function generateText(string, confirm, func, delay) {
    dialogueBox.textContent = "";
    let textArr = string.split("");
    let x = 0;

    let doThings = function() {
        pressA.play();
        confirmEl.style.display = "none";
        clearInterval(blinkInterval);
        
        Number.isInteger(delay) ? shortdelay(function() { return func() }, delay) : func();
    }

    const textGenerator = setInterval(function() {
        dialogueBox.textContent = dialogueBox.textContent + textArr[x];
        x++;
        if(x == textArr.length) {
            clearInterval(textGenerator);

            if(confirm === true) {
            confirmEl.style.display = "block";
            objectBlink(confirmEl, 500);
            add("keydown", doThings, once);
            } else { shortdelay(function() { func() }, 500) }
        }
    }, 50)
}

function objectBlink(object, interval) {
    object.style.opacity == "1";
    
    setTimeout(
    blinkInterval = setInterval(function() {
        if(object.style.opacity == "1") {
        object.style.opacity = "0";
        } else { object.style.opacity = "1"; }
    }, interval), interval)
}

function shortdelay(func, time) {
    const delayint = setTimeout(function() {
            func();
            clearTimeout(delayint);
    }, time)
}

/*
------------------------------------------------------------
Game Start Code
------------------------------------------------------------
*/

startGame();

fightEl.style.listStyle = '"► "';
fightOptionsEl.style.display = "none";

function startGame() {

    function generateBlackBoxes() {
        for(i=0;i<100;i++) {
        const newBox = document.createElement("div");
        newBox.classList.add("black-box");
        startScreen.appendChild(newBox);
    }}

    function removeBlackBoxes() {
        const removing = setInterval(function() {
            startScreen.children[0].remove();
            if(startScreen.children.length == 0) {
                clearInterval(removing);
                generateText("Go! Pakichu!", true, 
                function () { return throwPokaball("player", 200, pikamanEl, pikamanREl, pikaman1,
                function() { return generateText("You got this, Pikaman!", false, PikamanHeadTurn)}) }, 
                500);
            }
        }, 25);
    }
        
    function begin() {
        clearInterval(objectBlink);
        battle.volume = 0.1;
        battle.play();
        removeBlackBoxes();
    }
    
    objectBlink(startText, 750);
    generateBlackBoxes();
    add("keydown", begin, once);
}

/*
------------------------------------------------------------
Battle Code
------------------------------------------------------------
*/

function throwPokaball(team, pokemanHeight, pokemanEl, redPokemanEl, sound, func) {

    function createPokeman() {
        let x = 0;
        let y = 1;

        open.volume = 0.2;
        open.play();
        const creation = setInterval(function() {
            pokemanEl.style.height = `${x}px`;
            redPokemanEl.style.height = `${x}px`;
            if(team !== "player") {
                pokemanEl.style.top = `${10 + ((pokemanHeight - x) / 2)}px`;
                redPokemanEl.style.top = `${10 + ((pokemanHeight - x) / 2)}px`;
            }

            pokemanEl.style.display = "block";
            redPokemanEl.style.display = "block";
    
            redPokemanEl.style.opacity = y;
            if      (x<=pokemanHeight*0.5) {x+=pokemanHeight*0.03; y-=0.005;}
            else if (x<=pokemanHeight*0.9) {x+=pokemanHeight*0.025; y-=0.02;}
            else if (x<pokemanHeight)      {x+=pokemanHeight*0.015; y-=0.095;}
            else {
                pokaballEl.style.display = "none";
                pokaballEl.style.removeProperty("left");
                pokaballEl.style.removeProperty("right");
                clearInterval(creation);
                redPokemanEl.style.display = "none";

                if(team == "player") {
                    playerStats.style.display = "block";
                } else { opponentStats.style.display = "block"; }

                sound.play();
                func();
            }
        }, 30)
    }

    throwing.volume = 0.2;
    throwing.play();
    
    if(team == "player") {
        let degreeShift = 0;
        
        let gravity = 1.32;
        let yValue = 100

        let xValue = -70;

        let height = 40;

        const ballAnimation = setInterval(function() {
            console.log(xValue);
            yValue = yValue - 4 + gravity;
            gravity +=(0.03 * gravity);
            
            pokaballEl.style.top = `${yValue}px`;
            
            xValue += 4;
            pokaballEl.style.left = `${xValue}px`;

            height -= 0.15;
            pokaballEl.style.height = `${height}px`;

            degreeShift += 17;
            pokaballEl.style.transform = `rotate(${degreeShift}deg)`;
            pokaballEl.style.display = "block";

            if(yValue >= 260) {
                clearInterval(ballAnimation);
                createPokeman(pokemanEl, redPokemanEl);
            }
        }, 15)
    }
    else {
        let degreeShift = 0;
        
        let gravity = 1.32;
        let yValue = 20;

        let xValue = -100;

        let height = 20;
        console.log(xValue);

        const ballAnimation = setInterval(function() {
            console.log(xValue);
            yValue = yValue - 2 + gravity;
            gravity +=(0.015 * gravity);
            
            pokaballEl.style.top = `${yValue}px`;
            
            xValue += 4;
            pokaballEl.style.right = `${xValue}px`;

            height += 0.1;
            pokaballEl.style.height = `${height}px`;

            degreeShift += 17;
            pokaballEl.style.transform = `rotate(${degreeShift}deg)`;
            pokaballEl.style.display = "block";

            if(yValue >= 150) {
                clearInterval(ballAnimation);
                createPokeman(pokemanEl, redPokemanEl);
            }
        }, 15)
    }
}

function optionSelector(event) {
    if(event.key == "ArrowLeft" && pkmnEl.style.listStyle == '"► "') {
        pkmnEl.style.listStyle = "none";
        fightEl.style.listStyle = '"► "';
    } else if(event.key == "ArrowLeft" && runEl.style.listStyle == '"► "') {
        runEl.style.listStyle = "none";
        itemsEl.style.listStyle = '"► "';
    }

    if(event.key == "ArrowRight" && fightEl.style.listStyle == '"► "') {
        fightEl.style.listStyle = "none";
        pkmnEl.style.listStyle = '"► "';
    } else if(event.key == "ArrowRight" && itemsEl.style.listStyle == '"► "') {
        itemsEl.style.listStyle = "none";
        runEl.style.listStyle = '"► "';
    }

    if(event.key == "ArrowUp" && itemsEl.style.listStyle == '"► "') {
        itemsEl.style.listStyle = "none";
        fightEl.style.listStyle = '"► "';
    } else if(event.key == "ArrowUp" && runEl.style.listStyle == '"► "') {
        runEl.style.listStyle = "none";
        pkmnEl.style.listStyle = '"► "';
    }

    if(event.key == "ArrowDown" && fightEl.style.listStyle == '"► "') {
        fightEl.style.listStyle = "none";
        itemsEl.style.listStyle = '"► "';
    } else if(event.key == "ArrowDown" && pkmnEl.style.listStyle == '"► "') {
        pkmnEl.style.listStyle = "none";
        runEl.style.listStyle = '"► "';

    }
}

function PikamanHeadTurn() {
    neckBreak.play();
    woosh1.volume = 0.5;
    woosh1.play();
    pikamanEl.style.display = "none";
    pikamanTurnEl.style.display = "block";

    const turn2 = setTimeout(function() {
        pikamanTurnEl.style.display = "none";
        pikamanLookEl.style.display = "block";

        const turn3 = setTimeout(function() {
            pikamanLookEl.style.display = "none";
            pikamanTurnEl.style.display = "block";

            const turn4 = setTimeout(function() {
                woosh2.volume = 0.5;
                woosh2.play();
                pikamanTurnEl.style.display = "none";
                pikamanEl.style.display = "block";

                console.log("round 2");

                shortdelay(
                    function() { return generateText("Go! Demon Guest House Lord of Shadows!", false, 
                    function() { return throwPokaball("opponent", 250, puppetMasterEl, puppetMasterREl, puppetMasterSound3, beginBattle)}) },
                    200);

            }, 80)
            
        }, 1500)

    }, 80)
}

function beginBattle() {
    dialogueEl.style.display = "none";
    fightOptionsEl.style.display = "grid";
    add("keydown", optionSelector);
}