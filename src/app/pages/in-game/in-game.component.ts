import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { game, get_unachieved_game, player, register_score } from 'design/function-definitions';


@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {
  game: game = {
    rounds: 0,
    pins: 0,
    date: "",
    players: [],
  };

  selectedNbPins: number;
  currentTour = 1;
  currentPlayerIndex = 0;


  /////////////////////////////////////////////////////////////////////

  state: any = {};
 


  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      this.game = JSON.parse(params['data']);
    });

    this.game.players.forEach((player) => {
      this.state[player.name] = {};
      for (let i = 0; i < this.game.rounds - 1; i++) {
        this.state[player.name][i] = [-1, -1];
      }
      this.state[player.name][this.game.rounds - 1] = [-1, -1, -1];
    });
  }

  onScoreChange(player: player, round: number, property: string, event: any): void {
    register_score(player, this.game.pins, player.scores[round].first_shoot, player.scores[round].second_shoot, event);
    console.log("1");
  }
  
  register_score_tour() {
    for (let round = 0; round < this.game.rounds; round++) {
      for (let player in this.state) {
        if(!this.state[player][round].includes(-1)) {
          continue;
        }
        for(let shoot = 0; shoot < this.state[player][round].length; shoot++) {
          if(this.state[player][round][shoot] === -1) {
            this.state[player][round][shoot] = this.selectedNbPins;
            return;
          }
        }
        return;
      }
    }

    console.log(this.state);
  }

  submitForm() {
  }

}