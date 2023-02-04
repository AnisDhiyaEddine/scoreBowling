import { Component, OnInit } from '@angular/core';
import {
  game,
  get_games,
  delete_game,
  delete_games,
} from 'src/functions/function';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  games: game[] = [];

  async ngOnInit(): Promise<void> {
    this.games = await get_games();
  }

  async deleteGame(game_id: number | undefined) {
    if (game_id) {
      delete_game(game_id);
    }
    this.games = await get_games();
  }

  async deleteAllGames() {
    delete_games();
    this.games = [];
  }
}
