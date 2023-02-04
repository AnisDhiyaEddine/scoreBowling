import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  game,
  get_unachieved_game,
  is_last_round,
  register_score,
  save_game,
  save_state,
} from 'src/functions/function';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css'],
})
export class InGameComponent implements OnInit {
  game: game;

  selectedNbPins: number = 0;
  nbScoreLast = 0;
  buttonState = true;
  lastRound: boolean;
  /////////////////////////////////////////////////////////////////////

  state: any = {};

  constructor(
    private router: Router
  ) {}

  async ngOnInit() {
    this.game = await get_unachieved_game() || { rounds: 0, pins: 0, date: '', players: [] };
    this.lastRound = false;

    this.initiliazeState();
    
    const lastPlayerId = this.game.players[this.game.players.length - 1].id;
    if (lastPlayerId && !this.state[lastPlayerId][this.game.rounds - 1].includes(-1)) {
      this.buttonState = false;
    }
  }

  initiliazeState() {
    for (const player of this.game.players) {
      if (!player.id) {
        continue;
      }
    
      this.state[player.id] = {};
      for (let round = 0; round < this.game.rounds; round++) {
        let roundData;
        if (round < this.game.rounds - 1) {
          roundData = player.scores[round] ? [player.scores[round].first_shoot, player.scores[round].second_shoot] : [-1, -1];
        } else {
          roundData = player.scores[round - 1] ? [player.scores[round].first_shoot, player.scores[round].second_shoot, player.scores[round].third_shoot] : [-1, -1, -1];
        }
        this.state[player.id][round] = roundData;
      }
    }
  }
  
  newPinHandler() {
    const lastPlayer = this.game.players[this.game.players.length - 1];
    for (let round = 0; round < this.game.rounds; round++) {
      for (let player in this.state) {
        if (!this.state[player][round].includes(-1)) {
          continue;
        }
  
        for (let shoot = 0; shoot < this.state[player][round].length; shoot++) {
          if (this.state[player][round][shoot] === -1) {
            this.state[player][round][shoot] = this.selectedNbPins;
            if (shoot === 2 && this.lastRound && this.state[player][round][0] + this.state[player][round][1] < this.game.pins) {
              this.state[player][round][2] = 0;
            }
            return {
              round,
              player,
              isFull: !this.state[player][round].includes(-1),
              gameFinished: round === this.game.rounds - 1 && !this.state[lastPlayer.id ?? -1][round].includes(-1),
            };
          }
        }
      }
    }
  }

  register_score_tour() {
    let temp = this.newPinHandler() || {
      isFull: false,
      round: -1,
      player: -1,
      gameFinished: false,
    };
    console.log(temp);
    

    let player = this.game.players.find((p) => p.id == temp.player) || {
      name: '',
      scores: [],
    };

    this.lastRound = is_last_round(this.game, temp.round);

    if (temp.isFull) {
      register_score(
        player,
        this.game.pins,
        ...(this.state[temp.player][temp.round] as [number, number, number])
      );

      save_state(this.game);
      if (temp.gameFinished) {
        this.buttonState = false;
      }
      this.nbScoreLast = 0;

      return;
    }

    if (is_last_round(this.game, temp.round)) {
      if (this.state[temp.player][temp.round][1] !== -1) {
        this.nbScoreLast = 0;
        return;
      } else if (this.state[temp.player][temp.round][0] === this.game.pins) {
        return;
      }
    }

    this.nbScoreLast = this.selectedNbPins;
    this.selectedNbPins = 0;
  }

  submit() {
    if (!this.buttonState) {
      save_game(this.game);
      this.router.navigate(['']);
    }
  }
}
