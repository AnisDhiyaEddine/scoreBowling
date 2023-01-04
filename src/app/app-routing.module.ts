import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './pages/history/history.component';
import { InitGameComponent } from './pages/init-game/init-game.component';
import { InGameComponent } from './pages/in-game/in-game.component';
import { EndGameComponent } from './pages/end-game/end-game.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';


const routes: Routes = [
  { path: '', component: MainMenuComponent},
  { path: 'history', component: HistoryComponent },
  { path: 'init-game', component: InitGameComponent },
  { path: 'in-game', component: InGameComponent },
  { path: 'end-game', component: EndGameComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
