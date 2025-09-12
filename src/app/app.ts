import {Component, inject, OnDestroy, signal} from '@angular/core';
import {PlayerListComponent} from './components/player-list/player-list.component';
import {CourtComponent} from './components/court/court.component';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {ScoreboardComponent} from './components/scoreboard/scoreboard.component';
import {GameService} from './services/game.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [PlayerListComponent, CourtComponent, CdkDropListGroup, ScoreboardComponent, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  protected readonly title = signal('volleyball-tracker');

  protected readonly gameService = inject(GameService);

  private listener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
    return '';
  };

  constructor() {
    //this.enable();
  }

  ngOnDestroy() {
    this.disable();
  }

  enable() {
    window.addEventListener('beforeunload', this.listener);
  }

  disable() {
    window.removeEventListener('beforeunload', this.listener);
  }

}
