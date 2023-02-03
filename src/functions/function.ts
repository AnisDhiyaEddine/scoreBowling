import {ApiServiceService} from "../app/services/api-service.service";

export type game = {
  id?: number;
  rounds: number;
  pins: number;
  date: string;
  players : player[]
}

export type player = {
  name: string;
  scores: score[];
}

export type score = {
  first_shoot: number;
  second_shoot: number;
  third_shoot?: number;
  total: number;
}

/**
 * Get all the completes games
 * */
export async function get_games() {
  return await ApiServiceService.get_all_games();
}

/**
 * Delete a game history from the database
 * @param game
 */
export async function delete_game(game_id: number) {
  await ApiServiceService.delete_game(game_id);
}

/**
 * Delete the database and empty the json file
 * */
export async function delete_games() {
  await ApiServiceService.delete_all_games();
}

/**
 * Get the game that has not been finished from the session storage
 */
export async function get_unachieved_game() {
  const game = await ApiServiceService.get_current_game();
  return game.players ? game : undefined;
}

/**
 * Create and a new game
 * @param nb_round
 * @param nb_pins
 * @param players
 */
export async function create_game(nb_round: number, nb_pins: number, players: player[]): Promise<game> {
  return await save_state({
    rounds: nb_round,
    pins: nb_pins,
    date: new Date().toLocaleDateString(),
    players: players,
  });
}

/**
 * Register the value of a round
 *
 * Update the last shoot if it was a strike
 * @param player
 * @param nb_pins
 * @param val1
 * @param val2
 * @param val3
 */
export function register_score(player: player, nb_pins: number, val1: number, val2: number, val3?: number) : void {
  const last_score = get_last_score(player);
  let current_score = val1 + val2 + (val3?? 0);
  if(last_score) {
    if(last_score.first_shoot === nb_pins)
      last_score.total += current_score;
    else if(last_score.total === nb_pins)
      last_score.total += val1;
    current_score += last_score.total;
  }
  const score: score = {
    first_shoot: val1,
    second_shoot: val2,
    total: current_score
  }
  if(val3 || val3 === 0) score.third_shoot = val3;
  player.scores.push(score);
}

/**
 * Gets the score of the last round played
 * @param player
 */
export function get_last_score(player: player): score | undefined {
  if(player.scores.length === 0) return undefined;
  return player.scores[player.scores.length - 1];
}

/**
 * Verify that the last round has been played
 * @param game
 */
export function is_finished(game: game, current_round: number): boolean {
  return game.rounds === current_round;
}

/**
 *
 * @param game
 */
export function is_last_round(game: game, current_round: number): boolean {
  return game.rounds - current_round === 1;
}

/**
 * Sets the date of the game
 * @param game
 */
export function set_date(game: game): void {
  game.date = new Date().toLocaleDateString();
}

/**
 * Save the state of the game into the json file
 */
export async function save_state(game: game): Promise<game> {
  return await ApiServiceService.update_current_game(game);
}

/**
 * Save the final game into the database
 */
export async function save_game(game: game): Promise<game[]> {
  await ApiServiceService.delete_current_game();
  return await ApiServiceService.save_game(game);
}
