'use strict';

window.touchElementId = "score-sheets";

angular.module('myApp', [])
  .controller('Ctrl', function ($window, $scope, $log, $timeout, gameService, gameLogic, resizeGameAreaService, dragAndDropService) {

    // Click-to-drag on score-sheets
    var draggingLines = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var gameArea = document.getElementById("gameArea");
    var scoreSheets = document.getElementById("score-sheets");
    var rowsNum = 15;
    dragAndDropService.addDragListener("gameArea", handleDragEvent);
    function handleDragEvent(type, clientX, clientY) {
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
      if (row == 0 || row == 14) {
        return;
      }
      draggingLines.style.display = "inline";
      var height = totalHeight / rowsNum;
      var centerY = row * height + height / 2;
      horizontalDraggingLine.setAttribute("y1", centerY);
      horizontalDraggingLine.setAttribute("y2", centerY);

      if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
        // drag ended
        draggingLines.style.display = "none";
        $scope.scoreInCategory(row - 1);
      }
    }

    resizeGameAreaService.setWidthToHeight(320/480);

    $scope.order = ["ones", "twos", "threes", "fours", "fives", "sixes", "threeKind", "fourKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy", "bonus"];
    $scope.waitForComputer = false;
    $scope.firstRoll = true;

    function sendComputerRollMove() {
      $timeout(function(){
        gameService.makeMove(gameLogic.createComputerRollMove($scope.board, $scope.dice, $scope.turnIndex, $scope.rollNumber));
      },500);
      $scope.computerRolled = true;
    }
    function sendComputerMove() {
      $timeout(function(){
        gameService.makeMove(gameLogic.createComputerMove($scope.board, $scope.turnIndex, $scope.dice));
      },500);
      $scope.computerRolled = false;
    }

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
        if(!$scope.computerRolled){
          $timeout(sendComputerRollMove, 500);
        }else{
          $timeout(sendComputerMove, 500);
        }
      }else{
        $scope.waitForComputer = false;
      }
    }

    $scope.scoreInCategory = function (index) {
      var category = $scope.order[index];
      if (!category || category == "bonus") {
        throw new Error("Yoav Yatzy bug");
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
      gameDeveloperEmail: "img236@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  });
