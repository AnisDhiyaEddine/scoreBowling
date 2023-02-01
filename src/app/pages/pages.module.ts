import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryComponent } from './history/history.component';
import { InitGameComponent } from './init-game/init-game.component';
import { InGameComponent } from './in-game/in-game.component';
import { EndGameComponent } from './end-game/end-game.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
       HistoryComponent,
       InitGameComponent,
       InGameComponent,
       EndGameComponent,
       MainMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ], 
  exports: [
    HistoryComponent,
    InitGameComponent,
    InGameComponent,
    EndGameComponent,
    MainMenuComponent
  ]
})
export class PagesModule { }
