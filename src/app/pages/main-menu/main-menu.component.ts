import { Component, OnInit } from '@angular/core';
import { game, get_unachieved_game } from 'design/function-definitions';
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit {
  gameCurrent;
  buttonState = false;
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.gameCurrent = await get_unachieved_game();
    console.log(this.gameCurrent);

    if (this.gameCurrent) {
      this.buttonState = true;
    }
  }

  resumeGame() {
    console.log('resumeGame');
  }
}
