import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  game,
  get_unachieved_game,
  register_score,
  save_game,
  save_state,
} from 'design/function-definitions';

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

  /////////////////////////////////////////////////////////////////////

  state: any = {};

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.game = (await get_unachieved_game()) || {
      rounds: 0,
      pins: 0,
      date: '',
      players: [],
    };

    this.game.players.forEach((player) => {
      if (player.id) {
        this.state[player.id] = {};
        for (let i = 0; i < this.game.rounds; i++) {
          if (i < this.game.rounds - 1) {
            if (player.scores[i]) {
              this.state[player.id][i] = [
                player.scores[i].first_shoot,
                player.scores[i].second_shoot,
              ];
            } else {
              this.state[player.id][i] = [-1, -1];
            }
          } else {
            if (this.game.rounds === player.scores.length) {
              if (player.scores[i - 1]) {
                this.state[player.id][i] = [
                  player.scores[i].first_shoot,
                  player.scores[i].second_shoot,
                  player.scores[i].third_shoot,
                ];
              } else {
                this.state[player.id][i] = [-1, -1, -1];
              }
            } else {
              this.state[player.id][i] = [-1, -1, -1];
            }
          }
        }
      }
    });
  }

  newPinHandler() {
    const lastPlayerName = this.game.players[this.game.players.length - 1].id;
    for (let round = 0; round < this.game.rounds; round++) {
      for (let player in this.state) {
        if (!this.state[player][round].includes(-1)) {
          continue;
        }
        for (let shoot = 0; shoot < this.state[player][round].length; shoot++) {
          if (this.state[player][round][shoot] === -1) {
            this.state[player][round][shoot] = this.selectedNbPins;
            return {
              round: round,
              player: player,
              isFull: !this.state[player][round].includes(-1),
              gameFinished:
                round === this.game.rounds - 1 &&
                !this.state[lastPlayerName ?? 0][round].includes(-1),
            };
          }
        }
        return;
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

    let player = this.game.players.find((p) => p.id == temp.player) || {
      name: '',
      scores: [],
    };

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
