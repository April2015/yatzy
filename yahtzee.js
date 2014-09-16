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
    var i;
    for(i = 0; i < 2; i++){
      for(var category in board[i]) {
        if (board[i][category] == null) {
          return -1;
        } else {
          totalScore[i] += board[i][category];  
        }
      }  
    }
    if (totalScore[0] > totalScore[1]) {
      return 0;
    } else if(totalScore[0] < totalScore[1]) {
      return 1;
    } else {
      return -1;
    }
  }

  function isTie(board) {
    totalScore = [0, 0];
    var i;
    for(i = 0; i < 2; i++){
      for(var category in board[i]) {
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
    

    if (winner !== -1 || isTie(board)) {
      firstOp = {endMatch: {endMatchScores: totalScore}};
    } else {
      firstOp = {setTurn: {turnIndex: 1 - turnIndex}};
    }
    return [firstOp, 
            {set: {key: "board", value: boardAfterMove}},
            {set: {key: "delta", value: {category: scoreCategory, score: score}}}];
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
      //   ]
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
      //continue with line 112 in tic tac toe example
      var expectedMove = createMove(board, scoreCategory, turnIndexBeforeMove, score);

      if (!isEqual(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      // not a valid move if any exceptions are thrown
      console.log("invalid move");
      return false;
    }
    return true;
  }

  console.log(
    [// check if isMoveOk returns value with no state
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {},
        dice: {d1:1, d2:1, d3:1, d4:2, d5:2, d6:2},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]}),
      // check if isMoveOk returns true from legal move on previous board state
      isMoveOk({turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        dice: {d1:1, d2:1, d3:1, d4:2, d5:2, d6:2},
        move:[{setTurn: {turnIndex: 0}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "ones", score: 3}}}
        ]}),
      // a move that will end the game
      isMoveOk({turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        dice: {d1:1, d2:1, d3:1, d4:2, d5:2, d6:2},
        move:[{"endMatch":{"endMatchScores":[265,259]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 0, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 0}}}
        ]}),
      // illegal move on existing board state
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        dice: {d1:1, d2:1, d3:1, d4:2, d5:2, d6:2},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]})
    ]);

  return isMoveOk;
})();