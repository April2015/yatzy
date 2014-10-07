'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'myApp.scaleBodyService', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, scaleBodyService, stateService, gameLogic) {

    var isLocalTesting = $window.parent === $window;

    $scope.order = ["ones", "twos", "threes", "fours", "fives", "sixes", "threeKind", "fourKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy", "bonus"];

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
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
    }

    function sendMakeMove(move) {
      $log.info(["Making move:", move]);
      if (isLocalTesting) {
        stateService.makeMove(move);
      } else {
        messageService.sendMessage({makeMove: move});
      }
    }

    // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    var game = {
      gameDeveloperEmail: "img236@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame()
    };

    var isLocalTesting = $window.parent === $window;
    // a scoring move
    $scope.move = "[{set: {key: 'diceRoll', value: false}}, {setTurn: {turnIndex: 1}}, {set: {key: 'board', value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}]}}, {set: {key: 'delta', value: {category: 'fullHouse', score: 25}}}]";
    // a dice rolling move
    // $scope.move = "[{set: {key: 'diceRoll', value: true}}, {set: {key: 'rollNumber', value: 1}},{setTurn: {turnIndex: 0}}, {setRandomInteger: {key: 'd0', from: 0, to: 6}},{setRandomInteger: {key: 'd1', from: 0, to: 6}},{setRandomInteger: {key: 'd2', from: 0, to: 6}},{setRandomInteger: {key: 'd3', from: 0, to: 6}},{setRandomInteger: {key: 'd4', from: 0, to: 6}},]";
    
    $scope.scoreInCategory = function (category, playerId) {
      $log.info(["Score in category", category, playerId]);
      if (!$scope.isYourTurn || playerId != $scope.turnIndex || category == "bonus") {
        return;
      }
      if($scope.rollNumber == 1){
        $log.info(["You must roll the dice first!"]);
        return;
      }
      try {
        var move = gameLogic.createMove($scope.board, category, $scope.turnIndex, $scope.dice);
        $scope.isYourTurn = false; // to prevent making another move
        $scope.rollNumber = 1;
        $scope.rerolls = undefined;
        // TODO: show animations and only then send makeMove.
        sendMakeMove(move);
      } catch (e) {
        $log.info(["You've already scored here:", category, playerId]);
        return;
      }
    };

    $scope.rollDice = function () {
      $log.info(["Roll dice:", $scope.rerolls]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        var move = gameLogic.createRollMove($scope.dice, $scope.rerolls, $scope.rollNumber, $scope.turnIndex);
        $scope.rollNumber++;
        // TODO: show animations and only then send makeMove.
        sendMakeMove(move);
      } catch (e) {
        $log.info(["No more rolls:", $scope.rollNumber]);
        return;
      }
    };
    
    $scope.setReroll = function (dIndex) {
      if($scope.rollNumber == 1){
        // you have to roll all of the dice
        return;
      }      
      if($scope.rerolls.indexOf("d" + dIndex) > -1){
        $scope.rerolls.splice($scope.rerolls.indexOf("d" + dIndex),1);
      }else{
        $scope.rerolls.push("d" + dIndex);
      }
    };

    scaleBodyService.scaleBody({width: 350, height: 518});

    if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });

      messageService.sendMessage({gameReady : game});
    }
  });
