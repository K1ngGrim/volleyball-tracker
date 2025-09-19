import {Component, inject, OnDestroy, signal} from '@angular/core';
import {PlayerListComponent} from './components/player-list/player-list.component';
import {CourtComponent} from './components/court/court.component';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {ScoreboardComponent} from './components/scoreboard/scoreboard.component';
import {GameService} from './services/game.service';
import {JsonPipe} from '@angular/common';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, add, chevronUp } from 'ionicons/icons';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [PlayerListComponent, CourtComponent, CdkDropListGroup, ScoreboardComponent, JsonPipe, IonTabs, IonTabBar, IonTabButton, IonIcon, IonRouterOutlet, IonApp],
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
    addIcons({ library, playCircle, radio, search, add, chevronUp});
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
