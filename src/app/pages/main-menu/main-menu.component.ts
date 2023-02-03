import { Component, OnInit } from '@angular/core';
import { get_unachieved_game } from 'design/function-definitions';
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit {
  gameCurrent;
  buttonState = false;


  async ngOnInit(): Promise<void> {
    this.gameCurrent = await get_unachieved_game();
    if (this.gameCurrent) {
      this.buttonState = true;
    }
  }

  resumeGame() {
    console.log('resumeGame');
  }
}
