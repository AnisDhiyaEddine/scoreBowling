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



  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      this.game = JSON.parse(params['data']);
    });
    // this.game.players.forEach((p) => {
    //   for (let i = 0; i < this.game.rounds; i++) {
    //     p.scores.push({
    //       first_shoot: 0,
    //       second_shoot: 0,
    //       third_shoot: 0,
    //       total: 0
    //     });
    //   }
    // });
    console.log(this.game);
    

  }

  onScoreChange(player: player, round: number, property: string, event: any): void {
    register_score(player, this.game.pins, player.scores[round].first_shoot, player.scores[round].second_shoot, event);
    console.log("1");
  }
  
  register_score_tour(){
    // this.game.players[0].scores.push({
    //   first_shoot: this.selectedNbPins,
    //   second_shoot: 0,
    //   third_shoot: 0,
    //   total: 0
    // });

    while(this.currentPlayerIndex !== this.game.players.length && this.currentTour !== this.game.rounds){
      console.log("debut index : " + this.currentPlayerIndex);
      if (this.currentTour > this.game.rounds) {
        return;
      }
    
      // const currentPlayer = this.game.players[currentPlayerIndex];
    
      if (!this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1]) {
        console.log("2");
        this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1] = { first_shoot: -1, second_shoot: -1, total: 0};
        console.log(this.game.players);
        

      }
    
      if (this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].first_shoot === -1 && this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].second_shoot === -1) {
        console.log("3");
        // Demander au joueur de renseigner son first_shoot pour ce tour
        this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].first_shoot = this.selectedNbPins;
        console.log(this.game.players);


      } else if (this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].second_shoot === -1 && this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].first_shoot !== -1) {
        console.log("4");
        // // Demander au joueur de renseigner son second_shoot pour ce tour
        // this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].second_shoot = this.selectedNbPins;
        // console.log(this.game.players);
        

      } else if (this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].second_shoot !== -1 && this.game.players[this.currentPlayerIndex].scores[this.currentTour - 1].first_shoot !== -1) {
        console.log("5");
        // Le joueur a renseigné ses scores pour ce tour, passer au joueur suivant
        // currentPlayerIndex = (currentPlayerIndex + 1) % this.game.players.length;

        // currentPlayerIndex += 1;
        console.log("index maj : " + this.currentPlayerIndex);
        this.currentTour += 1;
      }
    }
    this.game.players = [...this.game.players];
    this.cd.detectChanges();
    
  }

  submitForm() {
  }

}