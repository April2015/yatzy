// 'use strict';
//
// angular.module('myApp', ['ngTouch', 'ui.bootstrap'])
//   .run(function ($translate, $window, $rootScope, $log, gameService, gameLogic, resizeGameAreaService, dragAndDropService) {
angular.module('myApp').run(['gameLogic',
        function (gameLogic) {

            'use strict';
    translate.setLanguage('en',{
    "RULES_OF_YATZY":"Rules of Yatzy",
    "RULES_SLIDE1":"Firstly, you can click on Roll 'Em button to roll dices.",
    "RULES_SLIDE2":"Then, after each roll, the player chooses which dice to keep, and which to reroll. A player may reroll some or all of the dice up to two times on a turn.",
    "RULES_SLIDE3":"The player must put a score or zero into a score box each turn.",
    "RULES_SLIDE4":"The game ends when all score boxes are used. The player with the highest total score wins the game.",
    "RULES_SLIDE5":"For more info about the game, please go to http://en.wikipedia.org/wiki/Yatzy.",
    "RULES_SLIDE6":"For more info about the game, please go to http://en.wikipedia.org/wiki/Yatzy.",
    "ROLL":"Roll",
    "KEEP":"Keep",
    "ROLL_EM":"Roll 'Em",
    "CLOSE":"Close",
    "PLAYER":"player",

    "SCORE_TABLE":"score table",

    "ONES":"Total of Aces only",
    "TWOS":"Total of Twos only",
    "THREES":"Total of Threes only",
    "FOURS":"Total of Fours only",
    "FIVES":"Total of Fives only",
    "SIXES":"Total of Sixes only",
    "THREEKIND":"Total of all 5 dices",
    "FOURKIND":"Total of all 5 dices",
    "SMALLSTRAIGHT":"30pts",
    "LARGESTRAIGHT":"40pts",
    "FULLHOUSE":"25pts",
    "CHANCE":"Total of all 5 dices",
    "YATZY":"50pts",
    "BONUS":"100pts",

    "KIND_EXPLANATION":"kind explanation",

    "ones":"total of aces only",
    "twos":"total of twos only",
    "threes":"total of threes only",
    "fours":"total of fours only",
    "fives":"total of fives only",
    "sixes":"total of sixes only",
    "threekind":"score in the box only if the dice include 3 or more of the same number",
    "fourkind":"score in the box only if the dice include 4 or more of the same number",
    "smallstraight":"score in the box only if the dice show any sequence of four numbers",
    "largestraight":"score in the box only if the dice show any sequence of five numbers",
    "fullhouse":"score in the box only if the dice show 3 of one number and 2 of another",
    "chance":"Score the total of any 5 dices in the box",
    "yatzy":"Score in the box only if the dice show 5 of the same number",
    "bonus":"If you roll a yatzy and already filled with 50, you get a 100 pts bonus!",
    });


    var $log = log;
    var $translate = translate;
    var $scope = $rootScope;

    // Click-to-drag on score-sheets
    var draggingLines = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var gameArea = document.getElementById("gameArea");
    var scoreSheets = document.getElementById("score-sheets");
    var rowsNum = 15;
    dragAndDropService.addDragListener("score-sheets", handleDragEvent);
    function handleDragEvent(type, clientX, clientY, event) {
      if (!$scope.isYourTurn || $scope.waitForComputer || $scope.rollNumber == 1) {
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
      if (event.type.indexOf("mouse") !== 0) { // WEIRD bug in dekstop (using mouse), so avoding showing draggingLines on desktop.
        draggingLines.style.display = "inline";
        var height = totalHeight / rowsNum;
        var centerY = row * height + height / 2;
        horizontalDraggingLine.setAttribute("y1", centerY);
        horizontalDraggingLine.setAttribute("y2", centerY);
      }

      if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
        $log.debug("handleDragEvent: drag ended");
        draggingLines.style.display = "none";
        $scope.scoreInCategory(row - 1);
      }
    }

    resizeGameAreaService.setWidthToHeight(320/480);

    $scope.order = ["ones", "twos", "threes", "fours", "fives", "sixes", "threeKind", "fourKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy", "bonus"];
    $scope.waitForComputer = false;
    $scope.firstRoll = true;

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      $scope.dice = {};
      if($scope.rerolls === undefined){
        $scope.rerolls = ["d0", "d1", "d2", "d3", "d4"];
      }

      // if that was a dice roll, increment the roll number
      // if that was a scoring move, set the roll number to 1
      // if rollnumber is undefined, set roll number to 1

      if(params.stateAfterMove.diceRoll){
        $scope.rollNumber = params.stateAfterMove.rollNumber;
        $scope.rollNumber++;
        $scope.firstRoll = false;
      }else{
        $scope.rollNumber = 1;
      }

      if(params.stateAfterMove.d0 !== undefined){
        $scope.dice.d0 = params.stateAfterMove.d0;
      }else {
        $scope.dice.d0 = null;
      }
      if(params.stateAfterMove.d1 !== undefined){
        $scope.dice.d1 = params.stateAfterMove.d1;
      }else {
        $scope.dice.d1 = null;
      }
      if(params.stateAfterMove.d2 !== undefined){
        $scope.dice.d2 = params.stateAfterMove.d2;
      }else {
        $scope.dice.d2 = null;
      }
      if(params.stateAfterMove.d3 !== undefined){
        $scope.dice.d3 = params.stateAfterMove.d3;
      }else {
        $scope.dice.d3 = null;
      }
      if(params.stateAfterMove.d4 !== undefined){
        $scope.dice.d4 = params.stateAfterMove.d4;
      }else {
        $scope.dice.d4 = null;
      }

      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;
      $scope.yourPlayerIndexForMatch = params.yourPlayerIndex;
      // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        if ($scope.rollNumber === 1) {
          gameService.makeMove(gameLogic.createComputerRollMove($scope.board, $scope.dice, $scope.turnIndex, $scope.rollNumber));
        }else{
          gameService.makeMove(gameLogic.createComputerMove($scope.board, $scope.turnIndex, $scope.dice));
        }
      }else{
        $scope.waitForComputer = false;
      }
    }

    $scope.scoreInCategory = function (index) {
      var category = $scope.order[index];
      if (!category || category == "bonus") {
        return;
      }
      if (!$scope.isYourTurn || $scope.waitForComputer) {
        return;
      }
      var playerId = $scope.turnIndex;
      if($scope.rollNumber == 1){
        $log.info(["You must roll the dice first!"]);
        return;
      }
      $log.info(["Score in category", category, playerId]);
      try {
        var move = gameLogic.createMove($scope.board, category, $scope.turnIndex, $scope.dice);
        $scope.isYourTurn = false; // to prevent making another move
        $scope.rerolls = undefined;

        gameService.makeMove(move);
        $scope.waitForComputer = true;
      } catch (e) {
        $log.info(["You've already scored here:", category, playerId]);
        return;
      }
    };

    $scope.rollDice = function () {
      if (!$scope.isYourTurn || $scope.waitForComputer || $scope.rerolls == 0 || $scope.yourPlayerIndexForMatch != $scope.turnIndex) {
        return;
      }
      $log.info(["Roll dice:", $scope.rerolls]);
      try {
        $scope.firstRoll = false;
        var move = gameLogic.createRollMove($scope.dice, $scope.rerolls, $scope.rollNumber, $scope.turnIndex);
        gameService.makeMove(move);
      } catch (e) {
        $log.info(["No more rolls:", $scope.rollNumber]);
        return;
      }
    };

    $scope.setReroll = function (dIndex, setTo) {

      if($scope.rollNumber == 1){
        // you have to roll all of the dice
        return;
      }
      if(setTo == -1){
        if($scope.rerolls.indexOf("d" + dIndex) != -1){
          $scope.rerolls.splice($scope.rerolls.indexOf("d" + dIndex),1);
        }else{
          $scope.rerolls.push("d" + dIndex);
        }
        return;
      }
      if(setTo == 0){
        if($scope.rerolls.indexOf("d" + dIndex) == -1){
          return;
        }
        $scope.rerolls.splice($scope.rerolls.indexOf("d" + dIndex),1);
      }else{
        if($scope.rerolls.indexOf("d" + dIndex) != -1){
          return;
        }
        $scope.rerolls.push("d" + dIndex);
      }
    };

    $scope.shouldDropIn = function (key, playerId) {
      return $scope.delta !== undefined && $scope.delta.category === key && $scope.turnIndex != playerId;
    }

    $scope.onClickReroll = function (index) {
      $log.info("onClickReroll:", index);
      $scope.setReroll(index, 0);
    };

    $scope.onClickKeep = function (index) {
      $log.info("onClickKeep:", index);
      $scope.setReroll(index, 1);
    };

    // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndexForMatch: -2});

    gameService.setGame({
      // gameDeveloperEmail: "img236@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
