var game;
(function (game) {
    var animationEnded = false;
    var isComputerTurn = false;
    var canMakeMove = false; // it's isYourTurn in js
    game.isHelpModalShown = false;
    var waitForComputer = false;
    var firstRoll = true;
    game.order = ["ones", "twos", "threes", "fours", "fives", "sixes", "threeKind", "fourKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy", "bonus"];
    var gameArea = null;
    var draggingLines = null;
    var horizontalDraggingLine = null;
    var scoreSheets = null;
    var rowsNum = 15;
    var rollNumber = 0;
    var rerolls = undefined;
    var board = null;
    var turnIndex = 0;
    var yourPlayerIndex = 0;
    var dice = null;
    var jsonState;
    var delta = null;
    function init() {
        console.log("Translation of 'RULES_OF_YATZY' is " + translate('RULES_OF_YATZY'));
        resizeGameAreaService.setWidthToHeight(320 / 480);
        // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
        gameService.setGame({
            // gameDeveloperEmail: "img236@nyu.edu",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            // exampleGame: gameLogic.getExampleGame,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
        dragAndDropService.addDragListener("score-sheets", handleDragEvent);
    }
    game.init = init;
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            sendComputerMove();
        });
    }
    function sendComputerMove() {
        if (!isComputerTurn) {
            return;
        }
        isComputerTurn = false; // to make sure the computer can only move once.
        var move = gameLogic.createComputerMove(board, turnIndex, dice);
        log.info("computer move: ", move);
        gameService.makeMove(move);
    }
    /**
      * This method update the game's UI.
      * @param params
      */
    function updateUI(params) {
        jsonState = angular.toJson(params.stateAfterMove, true);
        board = params.stateAfterMove.board;
        delta = params.stateAfterMove.delta;
        dice = {};
        if (rerolls === undefined) {
            rerolls = ["d0", "d1", "d2", "d3", "d4"];
        }
        // if that was a dice roll, increment the roll number
        // if that was a scoring move, set the roll number to 1
        // if rollnumber is undefined, set roll number to 1
        if (params.stateAfterMove.diceRoll) {
            rollNumber = params.stateAfterMove.rollNumber;
            rollNumber++;
            firstRoll = false;
        }
        else {
            rollNumber = 1;
        }
        if (params.stateAfterMove.d0 !== undefined) {
            dice["d0"] = params.stateAfterMove.d0;
        }
        else {
            dice["d0"] = null;
        }
        if (params.stateAfterMove.d1 !== undefined) {
            dice["d1"] = params.stateAfterMove.d1;
        }
        else {
            dice["d1"] = null;
        }
        if (params.stateAfterMove.d2 !== undefined) {
            dice["d2"] = params.stateAfterMove.d2;
        }
        else {
            dice["d2"] = null;
        }
        if (params.stateAfterMove.d3 !== undefined) {
            dice["d3"] = params.stateAfterMove.d3;
        }
        else {
            dice["d3"] = null;
        }
        if (params.stateAfterMove.d4 !== undefined) {
            dice["d4"] = params.stateAfterMove.d4;
        }
        else {
            dice["d4"] = null;
        }
        canMakeMove = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        turnIndex = params.turnIndexAfterMove;
        yourPlayerIndex = params.yourPlayerIndex;
        if (board === undefined) {
            board = gameLogic.getInitialBoard();
        }
        // if(!delta && canMakeMove) {
        //   try{
        //     let move: IMove;
        //     move.push()
        //
        //   } catch(e) {
        //     log.info(e);
        //     log.info("initial game failed");
        //   }
        //   return;
        // }
        // Is it the computer's turn?
        if (canMakeMove
            && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            // Wait 500 milliseconds until animation ends.
            if (rollNumber === 1) {
                gameService.makeMove(gameLogic.createComputerRollMove(board, dice, turnIndex, rollNumber));
            }
            else {
                gameService.makeMove(gameLogic.createComputerMove(board, turnIndex, dice));
            }
        }
        else {
            waitForComputer = false;
        }
    }
    function handleDragEvent(type, clientX, clientY, event) {
        gameArea = document.getElementById("gameArea");
        draggingLines = document.getElementById("draggingLines");
        horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        scoreSheets = document.getElementById("score-sheets");
        if (!canMakeMove || waitForComputer || rollNumber == 1) {
            return;
        }
        // Center point in gameArea
        var y = clientY - gameArea.offsetTop;
        // Is outside scoreSheets?
        draggingLines.style.display = "none";
        var totalHeight = scoreSheets.clientHeight;
        if (y < 0 || y >= totalHeight) {
            return;
        }
        // Inside scoreSheets. Let's find the containing row
        var row = Math.floor(rowsNum * y / totalHeight);
        // row 0 is the player number (player one/two),
        // and row 14 is bonus.
        if (row <= 0 || row >= 14) {
            return;
        }
        if (event.type.indexOf("mouse") !== 0) {
            draggingLines.style.display = "inline";
            var height = totalHeight / rowsNum;
            var centerY = row * height + height / 2;
            horizontalDraggingLine.setAttribute("y1", centerY.toString());
            horizontalDraggingLine.setAttribute("y2", centerY.toString());
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            log.debug("handleDragEvent: drag ended");
            draggingLines.style.display = "none";
            scoreInCategory(row - 1);
        }
    }
    function scoreInCategory(index) {
        var category = game.order[index];
        if (!category || category == "bonus") {
            return;
        }
        if (canMakeMove || waitForComputer) {
            return;
        }
        var playerId = turnIndex;
        if (rollNumber == 1) {
            log.info(["You must roll the dice first!"]);
            return;
        }
        log.info(["Score in category", category, playerId]);
        try {
            var move = gameLogic.createMove(board, category, turnIndex, dice);
            canMakeMove = false; // to prevent making another move
            rerolls = undefined;
            gameService.makeMove(move);
            waitForComputer = true;
        }
        catch (e) {
            log.info(["You've already scored here:", category, playerId]);
            return;
        }
    }
    game.scoreInCategory = scoreInCategory;
    function rollDice() {
        if (!canMakeMove || waitForComputer || rerolls.length == 0 || yourPlayerIndex != turnIndex) {
            return;
        }
        log.info(["Roll dice:", rerolls]);
        try {
            firstRoll = false;
            var move = gameLogic.createRollMove(dice, rerolls, rollNumber, turnIndex);
            gameService.makeMove(move);
        }
        catch (e) {
            log.info(["No more rolls:", rollNumber]);
            return;
        }
    }
    game.rollDice = rollDice;
    function setReroll(dIndex, setTo) {
        if (rollNumber == 1) {
            // you have to roll all of the dice
            return;
        }
        if (setTo == -1) {
            if (rerolls.indexOf("d" + dIndex) != -1) {
                rerolls.splice(rerolls.indexOf("d" + dIndex), 1);
            }
            else {
                rerolls.push("d" + dIndex);
            }
            return;
        }
        if (setTo == 0) {
            if (rerolls.indexOf("d" + dIndex) == -1) {
                return;
            }
            rerolls.splice(rerolls.indexOf("d" + dIndex), 1);
        }
        else {
            if (rerolls.indexOf("d" + dIndex) != -1) {
                return;
            }
            rerolls.push("d" + dIndex);
        }
    }
    game.setReroll = setReroll;
    function shouldDropIn(key, playerId) {
        return delta !== undefined && delta.category === key && turnIndex != playerId;
    }
    game.shouldDropIn = shouldDropIn;
    function onClickReroll(index) {
        log.info("onClickReroll:", index);
        setReroll(index, 0);
    }
    game.onClickReroll = onClickReroll;
    ;
    function onClickKeep(index) {
        log.info("onClickKeep:", index);
        setReroll(index, 1);
    }
    game.onClickKeep = onClickKeep;
    ;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        "RULES_OF_YATZY": "Rules of Yatzy",
        "RULES_SLIDE1": "Firstly, you can click on Roll 'Em button to roll dices.",
        "RULES_SLIDE2": "Then, after each roll, the player chooses which dice to keep, and which to reroll. A player may reroll some or all of the dice up to two times on a turn.",
        "RULES_SLIDE3": "The player must put a score or zero into a score box each turn.",
        "RULES_SLIDE4": "The game ends when all score boxes are used. The player with the highest total score wins the game.",
        "RULES_SLIDE5": "For more info about the game, please go to http://en.wikipedia.org/wiki/Yatzy.",
        "RULES_SLIDE6": "For more info about the game, please go to http://en.wikipedia.org/wiki/Yatzy.",
        "ROLL": "Roll",
        "KEEP": "Keep",
        "ROLL_EM": "Roll 'Em",
        "CLOSE": "Close",
        "PLAYER": "player",
        "SCORE_TABLE": "score table",
        "ONES": "Total of Aces only",
        "TWOS": "Total of Twos only",
        "THREES": "Total of Threes only",
        "FOURS": "Total of Fours only",
        "FIVES": "Total of Fives only",
        "SIXES": "Total of Sixes only",
        "THREEKIND": "Total of all 5 dices",
        "FOURKIND": "Total of all 5 dices",
        "SMALLSTRAIGHT": "30pts",
        "LARGESTRAIGHT": "40pts",
        "FULLHOUSE": "25pts",
        "CHANCE": "Total of all 5 dices",
        "YATZY": "50pts",
        "BONUS": "100pts",
        "KIND_EXPLANATION": "kind explanation",
        "ones": "total of aces only",
        "twos": "total of twos only",
        "threes": "total of threes only",
        "fours": "total of fours only",
        "fives": "total of fives only",
        "sixes": "total of sixes only",
        "threekind": "score in the box only if the dice include 3 or more of the same number",
        "fourkind": "score in the box only if the dice include 4 or more of the same number",
        "smallstraight": "score in the box only if the dice show any sequence of four numbers",
        "largestraight": "score in the box only if the dice show any sequence of five numbers",
        "fullhouse": "score in the box only if the dice show 3 of one number and 2 of another",
        "chance": "Score the total of any 5 dices in the box",
        "yatzy": "Score in the box only if the dice show 5 of the same number",
        "bonus": "If you roll a yatzy and already filled with 50, you get a 100 pts bonus!",
    });
    game.init();
});
