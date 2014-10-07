describe("In Yatzy", function() {
  var yatzy;

  beforeEach(module("myApp.gameLogic"));

  beforeEach(inject(function (gameLogic) {
    yatzyLogic = gameLogic;
  }));


  function expectMoveOk(params) {
    expect(yatzyLogic.isMoveOk(params)).toBe(true);
  }

  function expectIllegalMove(params) {
    expect(yatzyLogic.isMoveOk(params)).toBe(false);
  }

  it("rolling 5 dice on the first roll is legal", function() {
    expectMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{set: {key: "diceRoll", value: true}},
          {set: {key: "rollNumber", value: 1}},
          {setTurn: {turnIndex: 0}},
          {setRandomInteger: {key: "d0", from: 1, to: 7}},
          {setRandomInteger: {key: "d1", from: 1, to: 7}},
          {setRandomInteger: {key: "d2", from: 1, to: 7}},
          {setRandomInteger: {key: "d3", from: 1, to: 7}},
          {setRandomInteger: {key: "d4", from: 1, to: 7}},
        ]});
  });

  it("re-rolling 3 dice on the second roll is legal", function() {
    expectMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: true}},
          {set: {key: "rollNumber", value: 2}},
          {setTurn: {turnIndex: 0}},
          {setRandomInteger: {key: "d0", from: 1, to: 7}},
          {set: {key: "d1", value: 1}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 1, to: 7}},
        ]});
  });

  it("all five dice must be accounted for", function() {
    expectIllegalMove({turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: true}},
          {set: {key: "rollNumber", value: 2}},
          {setTurn: {turnIndex: 0}},
          {setRandomInteger: {key: "d0", from: 1, to: 7}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 1, to: 7}},
        ]});
  });

  it("you can only roll 3 times per turn", function() {
    expectIllegalMove({turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: true}},
          {set: {key: "rollNumber", value: 4}},
          {setTurn: {turnIndex: 0}},
          {setRandomInteger: {key: "d0", from: 1, to: 7}},
          {set: {key: "d2", value: 2}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 1, to: 7}},
        ]});
  });

  it("your dice roll must match the expected dice roll", function() {
    expectIllegalMove({turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 2, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: true}},
          {set: {key: "rollNumber", value: 2}},
          {setTurn: {turnIndex: 0}},
          {setRandomInteger: {key: "d0", from: 1, to: 7}},
          {set: {key: "d1", value: 1}},
          {set: {key: "d2", value: 5}},
          {set: {key: "d3", value: 3}},
          {setRandomInteger: {key: "d4", from: 1, to: 7}},
        ]});
  });

  it("making a scoring move with no initial board state is legal", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {d0: 1, d1: 1, d2: 1, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]});
  });

  it("you can't score in a made up category", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "superScoreCategory", score: 250}}}
        ]});
  });

  it("your move must match the expected move", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: 0}]}},
          {set: {key: "delta", value: {category: "ones", score: 10}}}
        ]});
  });

  it("the next player can make a move on the previous board state", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}, d0: 1, d1: 1, d2: 1, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 0}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, 
                                      {ones: 3, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "ones", score: 3}}}
        ]});
  });

  it("63 points in the upper sections (ones, twos, threes...) gets you a 35 point bonus", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, {ones: null, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}, d0: 1, d1: 1, d2: 1, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 0}},
          {set: {key: "board", value: [{ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, 
                                      {ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "ones", score: 3}}}
        ]});
  });

  it("the final scoring move of the last player ends the game", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{set: {key: "diceRoll", value: false}},
          {endMatch:{endMatchScores:[265,259]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 0, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 0}}}
        ]});
  });

  it("you can't re-score in a category that has already been scored in", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 0, stateBeforeMove: {board: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}], delta: {category: "fullHouse", score: 25}},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 1}},
          {set: {key: "board", value: [{ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: 25, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}, 
                                      {ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null, yatzy: null, chance: null, bonus: null}]}},
          {set: {key: "delta", value: {category: "fullHouse", score: 25}}}
        ]});
  });

  it("the player with the highest score wins", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}, d0: 2, d1: 2, d2: 2, d3: 2, d4: 3},
        move:[{set: {key: "diceRoll", value: false}},
          {endMatch:{endMatchScores:[265,267]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 8, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 8}}}
        ]});
  });

  it("ties happen if the scores are the same after 13 rounds of rolling", function() {
    expectMoveOk({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}, d0: 2, d1: 2, d2: 2, d3: 3, d4: 3},
        move:[{set: {key: "diceRoll", value: false}},
          {endMatch:{endMatchScores:[265,265]}},
          {set: {key: "board", value: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, 
                                      {ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}]}},
          {set: {key: "delta", value: {category: "twos", score: 6}}}
        ]});
  });

  it("a scoring move must explicitly change the board state", function() {
    expectIllegalMove({diceRoll: false, turnIndexBeforeMove: 1, stateBeforeMove: {board: [{ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}, {ones: 3, twos: null, threes: 9, fours: 12, fives: 15, sixes: 18, threeKind: 8, fourKind: 6, fullHouse: 25, smallStraight: 30, largeStraight: 40, yatzy: 50, chance: 8, bonus: 35}], delta: {category: "ones", score: 3}},
        move:[{set: {key: "diceRoll", value: false}},
          {setTurn: {turnIndex: 0}},
          {set: {key: "delta", value: {category: "twos", score: 6}}}
        ]});
  });

  function expectLegalHistoryThatEndsTheGame(history) {
    for (var i = 0; i < history.length; i++) {
      expectMoveOk(history[i]);
    }
    expect(history[history.length - 1].move[1].endMatch).toBeDefined();
  }

  it("getExampleGame returns a legal history and the last move ends the game", function() {
    var exampleGame = yatzyLogic.getExampleGame();
    expect(exampleGame.length).toBe(72);
    expectLegalHistoryThatEndsTheGame(exampleGame);
  });
});