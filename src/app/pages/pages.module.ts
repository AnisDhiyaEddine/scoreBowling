import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryComponent } from './history/history.component';
import { InitGameComponent } from './init-game/init-game.component';
import { InGameComponent } from './in-game/in-game.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
       HistoryComponent,
       InitGameComponent,
       InGameComponent,
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
    MainMenuComponent
  ]
})
export class PagesModule { }
