/*jslint devel: true, indent: 2 */
/*global console */
var yatzy = (function () {
  'use strict';

  //global scoreboard variable
  var totalScore;

  function isEqual(object1, object2) {
    if (object1 === object2) {
      return true;
    }
    if (typeof object1 != 'object' && typeof object2 != 'object') {
      return object1 == object2;
    }
    try {
      var keys1 = Object.keys(object1);
      var keys2 = Object.keys(object2);
      var i, key;

      if (keys1.length != keys2.length) {
        return false;
      }
      //the same set of keys (although not necessarily the same order),
      keys1.sort();
      keys2.sort();
      // key test
      for (i = keys1.length - 1; i >= 0; i--) {
        if (keys1[i] != keys2[i]){
          return false;
        }
      }
      // equivalent values for every corresponding key
      for (i = keys1.length - 1; i >= 0; i--) {
        key = keys1[i];
        if (!isEqual(object1[key], object2[key])) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getWinner(board) {
    totalScore = [0, 0];
    var i, category;
    for (i = 0; i < 2; i++) {
      for (category in board[i]) {
        if (board[i][category] === null) {
          return -1;
        }
        totalScore[i] += board[i][category];
      }
    }
    if (totalScore[0] > totalScore[1]) {
      return 0;
    } else if (totalScore[0] < totalScore[1]) {
      return 1;
    } else {
      return -1;
    }
  }

  function isTie(board) {
    totalScore = [0, 0];
    var i, category;
    for (i = 0; i < 2; i++) {
      for (category in board[i]) {
        if (board[i][category] == null) {
          return false;
        } else {
          totalScore[i] += board[i][category];  
        }
      }
    }
    return totalScore[0] === totalScore[1];
    
  }

  function createMove(board, scoreCategory, turnIndex, score) {
    if (board === undefined) {
      board = [
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
          yahtzee: null,
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
          yahtzee: null,
          chance: null, 
          bonus: 0
        }
      ];
    }
    var boardAfterMove = JSON.parse(JSON.stringify(board));

    boardAfterMove[turnIndex][scoreCategory] = score;

    var winner = getWinner(boardAfterMove);
    var firstOp;

    if (winner !== -1 || isTie(boardAfterMove)) {
      firstOp = {endMatch: {endMatchScores: totalScore}};
    } else {
      firstOp = {setTurn: {turnIndex: 1 - turnIndex}};
    }
    return [firstOp, 
            {set: {key: "board", value: boardAfterMove}},
            {set: {key: "delta", value: {category: scoreCategory, score: score}}}];
  }

  /* dice is a JSON object representing the current state of the dice
   * resrolls is an array representing the dice that need to be rolled (or rolled again)
  */
  function createRollMove(dice, rerolls) {
    var move = [];
    if(dice.d0 === undefined){
      dice.d0 = null;
    }
    if(dice.d1 === undefined){
      dice.d1 = null;
    }
    if(dice.d2 === undefined){
      dice.d2 = null;
    }
    if(dice.d3 === undefined){
      dice.d3 = null;
    }
    if(dice.d4 === undefined){
      dice.d4 = null;
    }
    var s;
    for (s in dice) {
      if(rerolls.indexOf(s) !== -1){
        move.push({setRandomInteger: {key: s, from: 0, to: 6}});
      } else {
        move.push({set: {key: s, value: dice[s]}});
      }
    }
    return move;
  }

  /** Returns an array of {stateBeforeMove, stateAfterMove, move, comment}. */
  function getExampleMoves(initialTurnIndex, initialState, arrayOfDiceRollsAndScoringMoves) {
    var exampleMoves = [];
    var state = initialState;
    var diceState;
    var turnIndex = initialTurnIndex;
    var statesArray = [{},{d0:5, d1:5, d2:5, d3:2, d4:3},{d0:5, d1:3, d2:3, d3:5, d4:3},{d0:1, d1:3, d2:4, d3:5, d4:6},{d0:1, d1:3, d2:4, d3:5, d4:6},{d0:2, d1:3, d2:4, d3:5, d4:3},{d0:5, d1:5, d2:6, d3:5, d4:4},{d0:5, d1:3, d2:3, d3:5, d4:6},{d0:5, d1:3, d2:3, d3:5, d4:3},{d0:6, d1:6, d2:3, d3:5, d4:6},{d0:3, d1:4, d2:1, d3:5, d4:6},{d0:3, d1:4, d2:4, d3:5, d4:6},{d0:5, d1:4, d2:4, d3:5, d4:6},{d0:5, d1:3, d2:3, d3:5, d4:6},{d0:1, d1:2, d2:3, d3:1, d4:2},{d0:1, d1:2, d2:3, d3:1, d4:3},{d0:1, d1:2, d2:3, d3:1, d4:3},{d0:1, d1:2, d2:3, d3:5, d4:3},{d0:1, d1:4, d2:5, d3:5, d4:1},{d0:1, d1:4, d2:5, d3:6, d4:6},{d0:1, d1:4, d2:5, d3:6, d4:6},{d0:2, d1:4, d2:5, d3:6, d4:6},{d0:5, d1:5, d2:5, d3:1, d4:6},{d0:5, d1:5, d2:5, d3:1, d4:5},{d0:4, d1:4, d2:4, d3:1, d4:5},{d0:6, d1:5, d2:6, d3:1, d4:5},{d0:6, d1:5, d2:4, d3:3, d4:5},{d0:4, d1:4, d2:4, d3:3, d4:5},{d0:3, d1:5, d2:3, d3:3, d4:5},{d0:2, d1:2, d2:5, d3:1, d4:6},{d0:2, d1:2, d2:3, d3:2, d4:6},{d0:2, d1:2, d2:3, d3:2, d4:6},{d0:1, d1:2, d2:3, d3:4, d4:5},{d0:2, d1:2, d2:2, d3:3, d4:3},{d0:2, d1:2, d2:2, d3:2, d4:3},{d0:2, d1:2, d2:2, d3:2, d4:3},{d0:5, d1:5, d2:2, d3:3, d4:3},{d0:5, d1:5, d2:2, d3:2, d4:3},{d0:5, d1:5, d2:2, d3:2, d4:3},{d0:1, d1:2, d2:3, d3:4, d4:6},{d0:1, d1:2, d2:3, d3:4, d4:1},{d0:1, d1:2, d2:3, d3:4, d4:1},{d0:4, d1:4, d2:6, d3:4, d4:2},{d0:4, d1:4, d2:4, d3:4, d4:4},{d0:1, d1:1, d2:2, d3:4, d4:3},{d0:1, d1:1, d2:4, d3:2, d4:1},{d0:1, d1:1, d2:4, d3:1, d4:1}];
    var rollCounter = 0;
    var newState;

    for (var i = 0; i < arrayOfDiceRollsAndScoringMoves.length; i++) {
      var diceRollOrScoringMove = arrayOfDiceRollsAndScoringMoves[i];
      var move;

      if(diceRollOrScoringMove.diceRoll){
        diceState = statesArray[rollCounter];
        newState = statesArray[rollCounter+1];
        // for moves that involve rolling / re rolling the dice
        move = createRollMove(diceState, diceRollOrScoringMove.rerolls);
        exampleMoves.push({
          diceRoll: true,
          stateBeforeMove: diceState,
          stateAfterMove: newState,
          turnIndexBeforeMove: turnIndex,
          turnIndexAfterMove: turnIndex,
          rollNumber: diceRollOrScoringMove.rollNumber,
          move: move,
          comment: {en: diceRollOrScoringMove.comment} 
          // stateAfterMove: diceState,
        });
        // counter for adding start and end states for each roll move
        rollCounter++;
        //turnIndex does not change for a roll
      }else{
        // for moves that invovle scoring in a specific category 
        move = createMove(state.board, diceRollOrScoringMove.category, turnIndex, diceRollOrScoringMove.score);
        newState = {board : move[1].set.value, delta: move[2].set.value};
        exampleMoves.push({
          diceRoll: false,
          stateBeforeMove: state,
          stateAfterMove: newState,
          turnIndexBeforeMove: turnIndex,
          turnIndexAfterMove: 1 - turnIndex,
          move: move,
          comment: {en: diceRollOrScoringMove.comment}
        });

        state = newState;
        turnIndex = 1 - turnIndex;
      }
    }
    return exampleMoves;
  }

  function getExampleGame() {
    return getExampleMoves(0, {}, [
      //1
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: false, category: "threeKind", score: 20, comment: "player 1 elects to score in the three of a kind category."},
      //1
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "fullHouse", score: 25, comment: "player 2 elects to score in the full house category."},
      //2
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:3, d2:4, d3:5, d4:6}, rerolls: ["d0"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:3, d2:4, d3:5, d4:6}, rerolls: ["d0"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: false, category: "smallStraight", score: 30, comment: "player 1 elects to score in the small straight category."},
      //2
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "chance", score: 25, comment: "player 2 elects to score in the chance category."},
      //3
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:5, d1:3, d2:3, d3:5, d4:6}, rerolls: ["d4"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: false, category: "fullHouse", score: 25, comment: "player 1 elects to score in the full house category."},
      //3
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "sixes", score: 18, comment: "player 2 elects to score in the sixes category."},
      //4
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:3, d1:4, d2:1, d3:5, d4:6}, rerolls: ["d2"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:3, d1:4, d2:4, d3:5, d4:6}, rerolls: ["d2"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: false, category: "fives", score: 10, comment: "player 1 elects to score in the fives category."},
      //4
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "fives", score: 10, comment: "player 2 elects to score in the fives category."},
      //5
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:2, d2:3, d3:1, d4:2}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:2, d2:3, d3:1, d4:3}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: false, category: "twos", score: 4, comment: "player 1 elects to score in the twos category."},
      //5
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "ones", score: 1, comment: "player 2 elects to score in the ones category."},
      //6
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:4, d2:5, d3:5, d4:1}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:4, d2:5, d3:6, d4:6}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: false, category: "ones", score: 1, comment: "player 1 elects to score in the ones category."},
      //6
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "twos", score: 2, comment: "player 2 elects to score in the twos category."},
      //7
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:5, d1:5, d2:5, d3:1, d4:6}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: false, category: "chance", score: 21, comment: "player 1 elects to score in the chance category."},
      //7
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "fours", score: 12, comment: "player 2 elects to score in the fours category."},
      //8
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: false, category: "sixes", score: 12, comment: "player 1 elects to score in the sixes category."},
      //8
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "smallStraight", score: 30, comment: "player 2 elects to score in the small straight category."},
      //9
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: false, category: "fours", score: 12, comment: "player 1 elects to score in the fours category."},
      //9
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "threes", score: 9, comment: "player 2 elects to score in the threes category."},
      //10
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:2, d1:2, d2:5, d3:1, d4:6}, rerolls: ["d2", "d3", "d4"], comment: "player 1 re-rolls 3 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:2, d1:2, d2:3, d3:2, d4:6}, rerolls: ["d2", "d3", "d4"], comment: "player 1 re-rolls 3 of the dice"},
      {diceRoll: false, category: "threes", score: 3, comment: "player 1 elects to score in the threes category."},
      //10
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "largeStraight", score: 40, comment: "player 2 elects to score in the large straight category."},
      //11
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:2, d1:2, d2:2, d3:3, d4:3}, rerolls: ["d3", "d4"], comment: "player 1 re-rolls 2 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:2, d1:2, d2:2, d3:2, d4:3}, rerolls: ["d4"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: false, category: "fourKind", score: 11, comment: "player 1 elects to score in the four of a kind category."},
      //11
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:5, d1:5, d2:2, d3:3, d4:3}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:5, d1:5, d2:2, d3:2, d4:3}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: false, category: "fourKind", score: 0, comment: "player 2 elects to score in the four of a kind category."},
      //12
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:2, d2:3, d3:4, d4:6}, rerolls: ["d4"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:2, d2:3, d3:4, d4:1}, rerolls: ["d4"], comment: "player 1 re-rolls 1 of the dice"},
      {diceRoll: false, category: "largeStraight", score: 0, comment: "player 1 elects to score in the large straight category."},
      //12
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: false, category: "threeKind", score: 20, comment: "player 2 elects to score in the three of a kind category."},
      //13
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 1 rolls the 5 dice"},
      {diceRoll: false, category: "yahtzee", score: 50, comment: "player 1 elects to score in the yahtzee category."},
      //13
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:1, d2:2, d3:4, d4:3}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:1, d2:4, d3:2, d4:1}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: false, category: "yahtzee", score: 0, comment: "player 2 elects to score in the fours category. the game terminates."},
    ]);
  }

  function isMoveOk(params) {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove = params.stateBeforeMove;

    try {
      // EXAMPLE MOVE: 
      // [{setTurn: {turnIndex: 1}},
      //     {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
      //                                 {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
      //     {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
      // ]

      // EXAMPLE DICE ROLL MOVE:
      //  [{setRandomInteger: {key: "d0", from: 0, to: 6}},
      //     {setRandomInteger: {key: "d1", from: 0, to: 6}},
      //     {setRandomInteger: {key: "d2", from: 0, to: 6}},
      //     {setRandomInteger: {key: "d3", from: 0, to: 6}},
      //     {setRandomInteger: {key: "d4", from: 0, to: 6}},
      //   ]

      if(params.diceRoll) {
        
        var rollNumber = params.rollNumber;

        //can't roll more than 5 dice, can have up to 2 re-rolls
        if(move.length !== 5 || rollNumber > 3){
          return false;
        }
        var rerolls = [];
        var i;
        for(i = 0; i < 5; i++){
          if(move[i].setRandomInteger !== undefined){
            rerolls.push(move[i].setRandomInteger.key);
          }
        }

        var dice = stateBeforeMove;
        var expectedMove = createRollMove(dice, rerolls);

        if (!isEqual(move, expectedMove)) {
          return false;
        }
      }else{
        var deltaValue = move[2].set.value;
        var scoreCategory = deltaValue.category;
        var score = deltaValue.score;  

        // game state is represented as two scoreboards, one for player 1, the oher for player 2
        var board = stateBeforeMove.board;
        var expectedMove = createMove(board, scoreCategory, turnIndexBeforeMove, score);

        // must score in an unscored category
        if(board !== undefined && board[turnIndexBeforeMove][scoreCategory] !== null){
          return false;
        }

        if (!isEqual(move, expectedMove)) {
          return false;
        }
      }
    } catch (e) {
      // not a valid move if any exceptions are thrown
      console.log("invalid move");
      return false;
    }
    return true;
  }

  return {isMoveOk: isMoveOk, getExampleGame: getExampleGame};;
})();