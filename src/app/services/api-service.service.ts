import { Injectable } from '@angular/core';
import axios from "axios";
import { game } from "../../functions/function";

const baseURL = "http://localhost:3000";
const http = axios.create({ baseURL })

@Injectable({
  providedIn: 'root'
})

export class ApiServiceService {

  static async get_all_games(): Promise<game[]> {
    return (await http.get('games')).data;
  }

  static async save_game(game: game) : Promise<game[]> {
    return (await http.post('games', game)).data;
  }

  static async delete_game(game_id: number) {
    await http.delete(`games/${game_id}`);
  }

  static async delete_all_games() {
    const games = await this.get_all_games();
    const promises = <Promise<void>[]>[];
    for(const game of games)
      if(game.id)
        promises.push(this.delete_game(game.id));
    await Promise.all(promises);
  }

  static async get_current_game() : Promise<game> {
    return (await http.get('current_game')).data
  }

  static async update_current_game(game: game) : Promise<game> {
    return (await http.post('current_game', game)).data;
  }

  static async delete_current_game() {
    await http.post('current_game', {});
  }
}
