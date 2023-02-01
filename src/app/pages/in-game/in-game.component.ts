import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { game, get_unachieved_game, player, register_score } from 'design/function-definitions';
import { ignoreElements } from 'rxjs';


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
  nbScoreLast = 0;

  /////////////////////////////////////////////////////////////////////

  state: any = {};
 


  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    
    this.game = await get_unachieved_game() || { rounds: 0, pins: 0, date: "", players: [] };
    console.log("1");
    
    console.log(this.game);

    // this.route.params.subscribe((params) => {
    //   this.game = JSON.parse(params['data']);
    // });

    

    this.game.players.forEach((player) => {
      this.state[player.name] = {};
      for (let i = 0; i < this.game.rounds - 1; i++) {
        this.state[player.name][i] = [-1, -1];
      }
      this.state[player.name][this.game.rounds - 1] = [-1, -1, -1];
    });
  }



  newPinHandler() {
    for (let round = 0; round < this.game.rounds; round++) {
      for (let player in this.state) {
        if(!this.state[player][round].includes(-1)) {
          continue;
        }
        for(let shoot = 0; shoot < this.state[player][round].length; shoot++) {
          
          if(this.state[player][round][shoot] === -1) {
            this.state[player][round][shoot] = this.selectedNbPins;
            return {
              round: round,
              player: player,
              isFull: !this.state[player][round].includes(-1),
            };
          }
        }
        return;
      }
    }
  }
  
  register_score_tour() {
    let temp = this.newPinHandler() || { isFull: false, round: -1, player: "" };
    
    let player = this.game.players.find((p) => p.name == temp.player) || {
      name: "",
      scores: [],
    }

    if (temp.isFull) {
      
      register_score(
        player,
        this.game.pins, 
        ...(this.state[temp.player][temp.round] as [number, number, number])
      );
      this.nbScoreLast = 0;
      return;
    }

    this.nbScoreLast = this.selectedNbPins
  }

  submitForm() {
  }

}