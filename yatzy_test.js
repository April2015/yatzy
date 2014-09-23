describe("In Yatzy ", function() {
  
  function expectMoveOk(params) {
    expect(yatzy.isMoveOk(params)).toBe(true);
  }

  function expectIllegalMove(params) {
    expect(yatzy.isMoveOk(params)).toBe(false);
  }

  it("rolling 5 dice on the first roll is legal", function() {
    expectMoveOk({diceRoll: true, rollNumber: 1, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {setRandomInteger: {key: "d1", from: 0, to: 6}},
          {setRandomInteger: {key: "d2", from: 0, to: 6}},
          {setRandomInteger: {key: "d3", from: 0, to: 6}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]});
  });

  it("re-rolling 3 dice on the second roll is legal", function() {
    expectMoveOk({diceRoll: true, rollNumber: 2, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {set: {key: "d1", value: 1}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]});
  });

  it("all five dice must be accounted for", function() {
    expectIllegalMove({diceRoll: true, rollNumber: 2, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]});
  });

  it("you can only roll 3 times per turn", function() {
    expectIllegalMove({diceRoll: true, rollNumber: 4, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]});
  });

  it("your dice roll must match the expected dice roll", function() {
    expectIllegalMove({diceRoll: true, rollNumber: 2, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{setRandomInteger: {key: "d0", from: 0, to: 6}},
          {set: {key: "d1", value: 1}},
          {set: {key: "d2", value: 5}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 0, to: 6}},
        ]});
  });

  it("making a scoring move with no initial state is legal", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]});
  });

  it("you can't score in a made up category", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "superScoreCategory", score: 250}}}
        ]});
  });

  it("your move must match the expected move", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "ones", score: 10}}}
        ]});
  });

  it("the next player can make a move on the previous board state", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        move:[{setTurn: {turnIndex: 0}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "ones", score: 3}}}
        ]});
  });

  it("the final scoring move of the last player ends the game", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{endMatch:{endMatchScores:[265,259]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 0, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 0}}}
        ]});
  });

  it("you can't re-score in a category that has already been scored in", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        move:[{setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yahtzee: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]});
  });

  it("the player with the highest score wins", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{endMatch:{endMatchScores:[265,267]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 8, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 8}}}
        ]});
  });

  it("ties happen if the scores are the same after 13 rounds of rolling", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{endMatch:{endMatchScores:[265,265]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 6}}}
        ]});
  });

  it("a scoring move must explicitly change the board state", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yahtzee: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{setTurn: {turnIndex: 0}},
          {set: {key: "delta", value: {category: "twos", score: 6}}}
        ]});
  });

  function expectLegalHistoryThatEndsTheGame(history) {
    console.log(JSON.stringify(history[0]));
    for (var i = 0; i < history.length; i++) {
      expectMoveOk(history[i]);
    }
    expect(history[history.length - 1].move[0].endMatch).toBeDefined();
  }

  it("getExampleGame returns a legal history and the last move ends the game", function() {
    var exampleGame = yatzy.getExampleGame();
    console.log(exampleGame.length);
    expect(exampleGame.length).toBe(72);
    expectLegalHistoryThatEndsTheGame(exampleGame);
  });
});