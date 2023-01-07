import { Injectable } from '@angular/core';
import axios from "axios";
import { game } from "../../../design/function-definitions";

const baseURL = "http://localhost:3000";
const http = axios.create({ baseURL })

@Injectable({
  providedIn: 'root'
})

export class ApiServiceService {

  static async get_all_games(): Promise<game[]> {
    return await http.get('games');
  }

  static async save_game(game: game) {
    await http.post('games', game);
  }

  static async delete_game(game_id: number) {
    await http.delete(`games/${game_id}`);
  }

  static async delete_all_games() {
    const games = await this.get_all_games();
    const promises = [];
    for(const game of games)
      if(game.id)
        promises.push(this.delete_game(game.id));
    await Promise.all(promises);
  }

  static async get_current_game() : Promise<game> {
    return await http.get('current_game')
  }

  static async update_current_game(game: game) {
    await http.patch('current_games', game);
  }
}
