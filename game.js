'use strict';

angular.module('myApp', ['ngTouch', 'ngDragDrop'])
  .controller('Ctrl', function (
      $window, $scope, $log, $timeout,
      gameService, scaleBodyService, gameLogic) {

    $scope.order = ["ones", "twos", "threes", "fours", "fives", "sixes", "threeKind", "fourKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy", "bonus"];

    var rollSoundEff = new Audio('audio/roll.mp3');
    var moveSoundEff = new Audio('audio/move.mp3');
    rollSoundEff.load();
    moveSoundEff.load();

    function sendComputerRollMove() {
      rollSoundEff.play();
      $timeout(function(){
        gameService.makeMove(gameLogic.createComputerRollMove($scope.board, $scope.dice, $scope.turnIndex, $scope.rollNumber));
      },2100);
      $scope.computerRolled = true;
    }
    function sendComputerMove() {
      moveSoundEff.play();
      $timeout(function(){
        gameService.makeMove(gameLogic.createComputerMove($scope.board, $scope.turnIndex, $scope.dice));
      },500);
      $scope.rollNumber = 1;
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

      if($scope.rollNumber === undefined){
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
      
      // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        if(!$scope.computerRolled){
          $timeout(sendComputerRollMove, 3000);
        }else{
          $timeout(sendComputerMove, 3000);
        }
      }
    }
    
    $scope.scoreInCategory = function (category, playerId) {
      if (!$scope.isYourTurn || playerId != $scope.turnIndex || category == "bonus" || !$scope.doneRolling) {
        return;
      }
      if($scope.rollNumber == 1){
        $log.info(["You must roll the dice first!"]);
        return;
      }
      $log.info(["Score in category", category, playerId]);
      try {
        var move = gameLogic.createMove($scope.board, category, $scope.turnIndex, $scope.dice);
        $scope.isYourTurn = false; // to prevent making another move
        $scope.rollNumber = 1;
        $scope.rerolls = undefined;

        moveSoundEff.play();
        $timeout(function(){
          gameService.makeMove(move);  
        },500);
      } catch (e) {
        $log.info(["You've already scored here:", category, playerId]);
        return;
      }
    };

    $scope.doneRolling = false;
    $scope.rollDice = function () {
      $log.info(["Roll dice:", $scope.rerolls]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        $scope.doneRolling = false;
        var move = gameLogic.createRollMove($scope.dice, $scope.rerolls, $scope.rollNumber, $scope.turnIndex);
        $scope.rollNumber++;
        rollSoundEff.play();
        $timeout(function(){
          gameService.makeMove(move);  
          $scope.doneRolling = true;
        }, 2100);
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
        if($scope.dragging){
          $scope.dragging = false;
          return;  
        }else{
          if($scope.rerolls.indexOf("d" + dIndex) != -1){
            $scope.rerolls.splice($scope.rerolls.indexOf("d" + dIndex),1);
          }else{            
            $scope.rerolls.push("d" + dIndex);
          }
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

    $scope.dragging = false;
    $scope.onStartCallback = function () {
      $scope.dragging = true;
      var index = arguments[1]["helper"][0]["name"];
    };

    $scope.onDropReroll = function (e) {
      var index = arguments[1]["helper"][0]["name"];
      $scope.setReroll(index, 1);
    };

    $scope.onDropKeep = function (e) {
      var index = arguments[1]["helper"][0]["name"];
      $scope.setReroll(index, 0);
    };

    scaleBodyService.scaleBody({width: 350, height: 519});
  
    // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

    gameService.setGame({
      gameDeveloperEmail: "img236@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  });