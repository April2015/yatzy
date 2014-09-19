/*jslint devel: true, indent: 2 */
/*global console */
var isMoveOk = (function () {
  'use strict';

  //global scoreboard variable
  var totalScore;

  function isEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2);
  }

  function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
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

  function createRollMove(dice, rerolls) {
    var diceAfterRolls = JSON.parse(JSON.stringify(dice));
    var move = [];

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

      if(params.diceRoll) {
        console.log("we got a dice roller here");
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
              bonus: null
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
              bonus: null
            }
          ];
        }

        // must score in an unscored category
        if(board[turnIndexBeforeMove][scoreCategory] !== null){
          console.log("you can't rescore");
          return false;
        }
        var expectedMove = createMove(board, scoreCategory, turnIndexBeforeMove, score);

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

  console.log(
    [ //check a dice roll move
      isMoveOk({diceRoll: true, rollNumber: 1, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {setRandomInteger: {key: "d1", from: 0, to: 6}},
          {setRandomInteger: {key: "d2", from: 0, to: 6}},
          {setRandomInteger: {key: "d3", from: 0, to: 6}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]}),
      //check a dice re-roll move
      isMoveOk({diceRoll: true, rollNumber: 2, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {set: {key: "d1", value: 1}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]}),
      // check if isMoveOk returns value with no state
      isMoveOk({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]}),
      // check if isMoveOk returns true from legal move on previous board state
      isMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        move:[{setTurn: {turnIndex: 0}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "ones", score: 3}}}
        ]}),
      // a move that will end the game
      isMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{"endMatch":{"endMatchScores":[265,259]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 0, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 0}}}
        ]}),
      // illegal move on existing board state
      isMoveOk({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]})
    ]);

  return isMoveOk;
})();