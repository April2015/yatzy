'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, stateService, gameLogic) {

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      $scope.dice = {};
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
        $scope.board = [
          {
            ones: null, 
            twos: null, 
            threes: null, 
            fours: null, 
            fives: null, 
            sixes: null, 
            threeKind: null,
            fourKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yatzy: null,
            chance: null, 
            bonus: 0
          }, 
          {
            ones: null, 
            twos: null, 
            threes: null,
            fours: null,
            fives: null, 
            sixes: null, 
            threeKind: null, 
            fourKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yatzy: null,
            chance: null, 
            bonus: 0
          }
        ];
      }
    }
    updateUI({stateAfterMove: {}});
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
    
    $scope.makeMove = function () {
      $log.info(["Making move:", $scope.move]);
      var moveObj = eval($scope.move);
      if (isLocalTesting) {
        stateService.makeMove(moveObj);
      } else {
        messageService.sendMessage({makeMove: moveObj});
      }
    };

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
