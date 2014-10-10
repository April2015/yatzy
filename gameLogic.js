'use strict';

angular.module('myApp').service('gameLogic', function() {

  //global scoreboard variable
  var totalScore;

  function isEqual(object1, object2) {
    return angular.equals(object1, object2);
  }

  function copyObject(object) {
    return angular.copy(object);
  }

  function determineValueOfScore(category, dice){
    var value = 0;
    if(category == "ones"){
      for(var d in dice){
        if(dice[d] == 1){
          value++;
        }
      }
    }else if(category == "twos"){
      for(var d in dice){
        if(dice[d] == 2){
          value+=2;
        }
      }
    }else if(category == "threes"){
      for(var d in dice){
        if(dice[d] == 3){
          value+=3;
        }
      }
    }else if(category == "fours"){
      for(var d in dice){
        if(dice[d] == 4){
          value+=4;
        }
      }
    }else if(category == "fives"){
      for(var d in dice){
        if(dice[d] == 5){
          value+=5;
        }
      }
    }else if(category == "sixes"){
      for(var d in dice){
        if(dice[d] == 6){
          value+=6;
        }
      }
    }else if(category == "threeKind"){
      var tempvalue = 0;
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        tempvalue += dice[d];
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      for(var d in counts){
        if(counts[d] >= 3){
          value = tempvalue;
        }
      }
    }else if(category == "fourKind"){
      var tempvalue = 0;
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        tempvalue += dice[d];
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      for(var d in counts){
        if(counts[d] >= 4){
          value = tempvalue;
        }
      }
    }else if(category == "smallStraight"){
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      if((counts["ones"] >= 1 && counts["twos"] >= 1 && counts["threes"] >= 1 && counts["fours"] >= 1)
        ||(counts["twos"] >= 1 && counts["threes"] >= 1 && counts["fours"] >= 1 && counts["fives"] >= 1)
        ||(counts["threes"] >= 1 && counts["fours"] >= 1 && counts["fives"] >= 1 && counts["sixes"] >= 1)){
        value = 30;
      }
    }else if(category == "largeStraight"){
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      if((counts["ones"] >= 1 && counts["twos"] >= 1 && counts["threes"] >= 1 && counts["fours"] >= 1  && counts["fives"] >= 1)
        ||(counts["twos"] >= 1 && counts["threes"] >= 1 && counts["fours"] >= 1 && counts["fives"] >= 1  && counts["sixes"] >= 1)){
        value = 40;
      }
    }else if(category == "fullHouse"){
      var tempvalue = 0;
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        tempvalue += dice[d];
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      var threeK, twoK = false;
      for(var d in counts){
        if(counts[d] == 3){
          threeK = true;
        }else if(counts[d] == 2){
          twoK = true;
        }
      }
      if(threeK && twoK){
        value = 25;
      }
    }else if(category == "yatzy"){
      var counts = {ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0};
      for(var d in dice){
        if(dice[d] == 1){
          counts.ones++;
        }else if(dice[d] == 2){
          counts.twos++;
        }else if(dice[d] == 3){
          counts.threes++;
        }else if(dice[d] == 4){
          counts.fours++;
        }else if(dice[d] == 5){
          counts.fives++;
        }else if(dice[d] == 6){
          counts.sixes++;
        }
      }
      for(var d in counts){
        if(counts[d] == 5){
          value = 50;
        }
      }
    }else if(category == "chance"){
      for(var d in dice){
        value += dice[d];
      }
    }

    return value;
  }

  function checkForBonus(board, turnIndex, score, addScore){
    var playersBoard = board[turnIndex];
    var total = playersBoard.ones + playersBoard.twos + playersBoard.threes + playersBoard.fours + playersBoard.fives + playersBoard.sixes;
    if((addScore && (total + score) >= 63) || (total >= 63)){
      return true;
    }else{
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

  function getInitialBoard(){
    return [
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

  function createComputerRollMove(board, dice, turnIndex, rollNumber){
    // roll all the dice
    return createRollMove(dice, ["d0", "d1", "d2", "d3", "d4"], rollNumber, turnIndex);
  }

  function createComputerMove(board, turnIndexBeforeMove, dice){
    // score in the best category you can!
    var scoreCategory = "";
    var bestScore = -1;
    var move;
    for(var cat in board[0]){
      try{
        if(createMove(board, cat, turnIndexBeforeMove, dice)){
          if(determineValueOfScore(cat, dice) > bestScore || bestScore == -1){
            scoreCategory = cat;
            bestScore = determineValueOfScore(cat, dice);
          }
        }  
      }catch(e){
        //already scored in that category
      }
    }
    return createMove(board, scoreCategory, turnIndexBeforeMove, dice);
  }

  /* dice is a JSON object representing the current state of the dice
   * resrolls is an array representing the dice that need to be rolled (or rolled again)
  */
  function createRollMove(dice, rerolls, rollNumber, turnIndex) {
    var move = [{set: {key: "diceRoll", value: true}}, {set: {key: "rollNumber", value: rollNumber}}, {setTurn: {turnIndex: turnIndex}}];
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

    if(rollNumber > 3){
      throw new Error("You are out of rolls");
    }

    var s;
    for (s in dice) {
      if(rerolls.indexOf(s) !== -1){
        move.push({setRandomInteger: {key: s, from: 1, to: 7}});
      } else {
        move.push({set: {key: s, value: dice[s]}});
      }
    }
    return move;
  }

  function createMove(board, scoreCategory, turnIndex, dice) {
    if (board === undefined) {
      board = getInitialBoard();
    }

    if(board[turnIndex][scoreCategory] !== null){
      throw new Error("Can only score once in that category!");
    }

    var score = determineValueOfScore(scoreCategory, dice);
    
    if(checkForBonus(board, turnIndex, score, (scoreCategory == "ones" || scoreCategory == "ones" || scoreCategory == "threes" || scoreCategory == "fours" || scoreCategory == "fives" || scoreCategory == "sixes"))){
      board[turnIndex].bonus = 35;
    }
    
    var boardAfterMove = copyObject(board);

    boardAfterMove[turnIndex][scoreCategory] = score;

    var winner = getWinner(boardAfterMove);
    var secondOp;

    if (winner !== -1 || isTie(boardAfterMove)) {
      secondOp = {endMatch: {endMatchScores: totalScore}};
    } else {
      secondOp = {setTurn: {turnIndex: 1 - turnIndex}};
    }
    return [{set: {key: "diceRoll", value: false}},
            secondOp, 
            {set: {key: "board", value: boardAfterMove}},
            {set: {key: "delta", value: {category: scoreCategory, score: score}}}];
  }

  /** Returns an array of {stateBeforeMove, stateAfterMove, move, comment}. */
  function getExampleMoves(initialTurnIndex, initialState, arrayOfDiceRollsAndScoringMoves) {
    var exampleMoves = [];
    var state = initialState;
    var turnIndex = initialTurnIndex;
    var diceStatesArray = [{},{d0:5, d1:5, d2:5, d3:2, d4:3},{d0:5, d1:3, d2:3, d3:5, d4:3},{d0:1, d1:3, d2:4, d3:5, d4:6},{d0:1, d1:3, d2:4, d3:5, d4:6},{d0:2, d1:3, d2:4, d3:5, d4:3},{d0:5, d1:5, d2:6, d3:5, d4:4},{d0:5, d1:3, d2:3, d3:5, d4:6},{d0:5, d1:3, d2:3, d3:5, d4:3},{d0:6, d1:6, d2:3, d3:5, d4:6},{d0:3, d1:4, d2:1, d3:5, d4:6},{d0:3, d1:4, d2:4, d3:5, d4:6},{d0:5, d1:4, d2:4, d3:5, d4:6},{d0:5, d1:3, d2:3, d3:5, d4:6},{d0:1, d1:2, d2:3, d3:1, d4:2},{d0:1, d1:2, d2:3, d3:1, d4:3},{d0:1, d1:2, d2:3, d3:1, d4:3},{d0:1, d1:2, d2:3, d3:5, d4:3},{d0:1, d1:4, d2:5, d3:5, d4:1},{d0:1, d1:4, d2:5, d3:6, d4:6},{d0:1, d1:4, d2:5, d3:6, d4:6},{d0:2, d1:4, d2:5, d3:6, d4:6},{d0:5, d1:5, d2:5, d3:1, d4:6},{d0:5, d1:5, d2:5, d3:1, d4:5},{d0:4, d1:4, d2:4, d3:1, d4:5},{d0:6, d1:5, d2:6, d3:1, d4:5},{d0:6, d1:5, d2:4, d3:3, d4:5},{d0:4, d1:4, d2:4, d3:3, d4:5},{d0:3, d1:5, d2:3, d3:3, d4:5},{d0:2, d1:2, d2:5, d3:1, d4:6},{d0:2, d1:2, d2:3, d3:2, d4:6},{d0:2, d1:2, d2:3, d3:2, d4:6},{d0:1, d1:2, d2:3, d3:4, d4:5},{d0:2, d1:2, d2:2, d3:3, d4:3},{d0:2, d1:2, d2:2, d3:2, d4:3},{d0:2, d1:2, d2:2, d3:2, d4:3},{d0:5, d1:5, d2:2, d3:3, d4:3},{d0:5, d1:5, d2:2, d3:2, d4:3},{d0:5, d1:5, d2:2, d3:2, d4:3},{d0:1, d1:2, d2:3, d3:4, d4:6},{d0:1, d1:2, d2:3, d3:4, d4:1},{d0:1, d1:2, d2:3, d3:4, d4:1},{d0:4, d1:4, d2:6, d3:4, d4:2},{d0:4, d1:4, d2:4, d3:4, d4:4},{d0:1, d1:1, d2:2, d3:4, d4:3},{d0:1, d1:1, d2:4, d3:2, d4:1},{d0:1, d1:1, d2:4, d3:1, d4:1}];
    var rollCounter = 0;
    var newState = state;

    for (var i = 0; i < arrayOfDiceRollsAndScoringMoves.length; i++) {
      var diceRollOrScoringMove = arrayOfDiceRollsAndScoringMoves[i];
      var move;
      
      if(diceRollOrScoringMove.diceRoll){
        // for moves that involve rolling / re rolling the dice
        move = createRollMove({d0: state.d0, d1: state.d1, d2: state.d2, d3: state.d3, d4: state.d4}, diceRollOrScoringMove.rerolls, diceRollOrScoringMove.rollNumber, turnIndex);
        newState = {diceRoll: true, rollNumber:diceRollOrScoringMove.rollNumber, board: state.board, delta: state.delta, d0: diceStatesArray[rollCounter+1].d0, d1: diceStatesArray[rollCounter+1].d1, d2: diceStatesArray[rollCounter+1].d2, d3: diceStatesArray[rollCounter+1].d3, d4: diceStatesArray[rollCounter+1].d4};
        exampleMoves.push({
          diceRoll: true,
          stateBeforeMove: state,
          stateAfterMove: newState,
          turnIndexBeforeMove: turnIndex,
          turnIndexAfterMove: turnIndex,
          rollNumber: diceRollOrScoringMove.rollNumber,
          move: move,
          comment: {en: diceRollOrScoringMove.comment} 
        });
        // counter for adding start and end states for each roll move
        state = newState;
        rollCounter++;
        //turnIndex does not change for a roll
      }else{
        // for moves that invovle scoring in a specific category 
        move = createMove(state.board, diceRollOrScoringMove.category, turnIndex, {d0: state.d0, d1: state.d1, d2: state.d2, d3: state.d3, d4: state.d4});
        newState = {diceRoll: false, rollNumber:diceRollOrScoringMove.rollNumber, board: move[2].set.value, delta: move[3].set.value, d0: state.d0, d1: state.d1, d2: state.d2, d3: state.d3, d4: state.d4};
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
      {diceRoll: false, category: "yatzy", score: 50, comment: "player 1 elects to score in the yatzy category."},
      //13
      {diceRoll: true, rollNumber: 1, dice: {}, rerolls: ["d0", "d1", "d2", "d3", "d4"], comment: "player 2 rolls the 5 dice"},
      {diceRoll: true, rollNumber: 2, dice: {d0:1, d1:1, d2:2, d3:4, d4:3}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: true, rollNumber: 3, dice: {d0:1, d1:1, d2:4, d3:2, d4:1}, rerolls: ["d2", "d3", "d4"], comment: "player 2 re-rolls 3 of the dice"},
      {diceRoll: false, category: "yatzy", score: 0, comment: "player 2 elects to score in the fours category. the game terminates."}
    ]);
  }

  function isMoveOk(params) {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove = params.stateBeforeMove;

    try {
      // EXAMPLE MOVE: 
      // [{setTurn: {turnIndex: 1}},
      //     {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, 
      //                                 {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}]}},
      //     {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
      // ]

      // EXAMPLE DICE ROLL MOVE:
      //  [{setRandomInteger: {key: "d0", from: 1, to: 7}},
      //     {setRandomInteger: {key: "d1", from: 1, to: 7}},
      //     {setRandomInteger: {key: "d2", from: 1, to: 7}},
      //     {setRandomInteger: {key: "d3", from: 1, to: 7}},
      //     {setRandomInteger: {key: "d4", from: 1, to: 7}},
      //   ]

      // check if this is a dice rolling move
      if(move[0].set.value) {
        var rollNumber = move[1].set.value;
        
        //can't roll more than 5 dice, can have up to 2 re-rolls
        if(move.length !== 8 || rollNumber > 3){
          return false;
        }

        var rerolls = [];
        var i;
        for(i = 3; i < 8; i++){
          if(move[i].setRandomInteger !== undefined){
            rerolls.push(move[i].setRandomInteger.key);
          }
        }

        var dice = {d0: stateBeforeMove.d0, d1: stateBeforeMove.d1, d2: stateBeforeMove.d2, d3: stateBeforeMove.d3, d4: stateBeforeMove.d4};
        var expectedMove = createRollMove(dice, rerolls, rollNumber, turnIndexBeforeMove);
        if (!isEqual(move, expectedMove)) {
          return false;
        }

      }else{
        var deltaValue = move[3].set.value;
        var scoreCategory = deltaValue.category;
        var score = deltaValue.score;  
        var dice = {d0: stateBeforeMove.d0, d1: stateBeforeMove.d1, d2: stateBeforeMove.d2, d3: stateBeforeMove.d3, d4: stateBeforeMove.d4};

        // game state is represented as two scoreboards, one for player 1, the oher for player 2
        var board = stateBeforeMove.board;
        var expectedMove = createMove(board, scoreCategory, turnIndexBeforeMove, dice);
        // must score in an unscored category
        if(board !== undefined && board[turnIndexBeforeMove][scoreCategory] !== null){
          return false;
        }

        if(checkForBonus(move[2].set.value, turnIndexBeforeMove, score, false)){
          move[2].set.value[turnIndexBeforeMove].bonus = 35;
        }
        if (!isEqual(move, expectedMove)) {
          return false;
        }
      }
    } catch (e) {
      // not a valid move if any exceptions are thrown
      console.log("Invalid move.");
      return false;
    }
    return true;
  }

  this.getInitialBoard = getInitialBoard;
  this.createMove = createMove;
  this.createRollMove = createRollMove;
  this.createComputerMove = createComputerMove;
  this.createComputerRollMove = createComputerRollMove;
  this.isMoveOk = isMoveOk;
  this.getExampleGame = getExampleGame;
});