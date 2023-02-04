import * as def from './function'

describe('AppFunction', () => {
  it('should get a score', () => {
    const last_score : def.score = { first_shoot : 5, second_shoot: 6, total : 11}
    const player: def.player = { name : "alo", scores: [{ first_shoot : 5, second_shoot: 6, total : 11}] }
    const score =  def.get_last_score(player);
    expect(score).toEqual(last_score);
  });

  it('should not get anything', () => {
    const player: def.player = { name : "alo", scores: [] }
    const score =  def.get_last_score(player);
    expect(score).toEqual(undefined);
  });

  it(`'is_finished' should be true`, () => {
    const game : def.game = {
      rounds: 0,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    expect(def.is_finished(game, 0)).toBeTruthy();
    game.rounds = 2;
    expect(def.is_finished(game, 2)).toBeTruthy();
  });

  it(`'is_finished' should be false`, () => {
    const game : def.game = {
      rounds: 3,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    expect(def.is_finished(game, 5)).toBeFalsy()
    game.rounds = 5;
    expect(def.is_finished(game, 3)).toBeFalsy();
  });

  it(`'is_last_round' should be true`, () => {
    const game : def.game = {
      rounds: 4,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    expect(def.is_last_round(game, 3)).toBeTruthy()
  });

  it(`'is_last_round' should be false`, () => {
    const game : def.game = {
      rounds: 0,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    expect(def.is_last_round(game, 0)).toBeFalsy()
    game.rounds = 3;
    expect(def.is_last_round(game, 4)).toBeFalsy();
    game.rounds = 2;
    expect(def.is_last_round(game, 2)).toBeFalsy();
    game.rounds = 5;
    expect(def.is_last_round(game, 9)).toBeFalsy();
  });

  it(`'save_date' should update the date`, () => {
    const date = new Date("21/01/2022").toLocaleDateString();
    const game : def.game = {
      rounds: 0,
      pins: 8,
      players: [],
      date: "",
    }
    def.set_date(game);
    expect(game.date === date).toBeFalsy();
  });

  it(`'save_state' should save the unfinished game in the database`, async () => {
    const game: def.game = {
      rounds: 0,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    const state = await def.save_state(game);
    expect(state).toEqual(game);
  });

  it(`'save_game' should save the game in the database`, async () => {
    const game: def.game = {
      rounds: 0,
      pins: 8,
      players: [],
      date: new Date().toLocaleDateString()
    }
    const games = await def.save_game(game);
    expect(games).toBeTruthy();
  });

  it(`'get_ames' should get all the saved games`, async () => {
    const games = await def.get_games();
    expect(games).toBeTruthy();
  });

  it(`'delete_game' should delete a specifique game`, async () => {
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    let games = await def.get_games();
    const game = games[0];
    expect(games.find(g => g.id === game.id)).toBeTruthy();
    await def.delete_game(game.id || 0)
    games = await def.get_games();
    expect(games.find(g => g.id === game.id)).toBeFalsy();
  });

  it(`'delete_games' should delete all game`, async () => {
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    await def.delete_games();
    const games = await def.get_games();
    expect(games.length).toBeFalsy();
  });

  it(`'get_unachieved_game' should get the curent_game from database`, async () => {
    await def.save_state({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    const game = await def.get_unachieved_game();
    expect(game).toBeTruthy();
  });

  it(`'get_unachieved_game' should not anything get from database if current_game is empty`, async () => {
    await def.save_game({rounds: 2, date: new Date().toLocaleDateString(), pins: 3, players: []});
    const game = await def.get_unachieved_game();
    expect(game).toBeFalsy();
  });

  it(`'create_game' should create the curent_game in database`, async () => {
    const to_create : def.game = { rounds: 14, pins: 5, date: new Date().toLocaleDateString(), players: [{ name: "Player1", scores: []}]}
    const game = await def.create_game(14, 5, [{ name: "Player1", scores: []}]);
    expect(game).toEqual(to_create);
  });

  it(`'register_score' should set a new score in the scores array of player`, async () => {
    const player: def.player = { name: "Player1", scores: []}
    const score : def.score = { first_shoot: 0, second_shoot: 2, total: 2}
    def.register_score(player, 2, 0, 2);
    expect(player.scores[0]).toEqual(score);
  });

  it(`'register_score' should update the previous score array of player if it was a strike`, async () => {
    const player: def.player = { name: "Player1", scores: []}
    const score_strike : def.score = { first_shoot: 2, second_shoot: 0, total: 4}
    def.register_score(player, 2, 2, 0);
    def.register_score(player, 2, 1, 1, 2);
    expect(player.scores[0]).toEqual(score_strike);
  });

  it(`'register_score' should update the previous score array of player if it was a spare`, async () => {
    const player: def.player = { name: "Player1", scores: []}
    const score_spare : def.score = { first_shoot: 1, second_shoot: 1, total: 3}
    def.register_score(player, 2, 1, 1);
    def.register_score(player, 2, 1, 1);
    expect(player.scores[0]).toEqual(score_spare);
  });

  it(`'register_score' should update the two previous scores if both were a strikes`, async () => {
    const player: def.player = { name: "Player1", scores: []}
    const score_strike_1 : def.score = { first_shoot: 10, second_shoot: 0, total: 24}
    def.register_score(player, 10, 10, 0);
    def.register_score(player, 10, 10, 0);
    def.register_score(player, 10, 4, 3);
    expect(player.scores[0]).toEqual(score_strike_1);
  });

});
