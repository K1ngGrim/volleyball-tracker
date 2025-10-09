import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {IonContent} from '@ionic/angular/standalone';
import {CourtComponent} from '../../court/court.component';
import {PlayerListComponent} from '../../player-list/player-list.component';
import {ScoreboardComponent} from '../../scoreboard/scoreboard.component';
import {GestureController} from '@ionic/angular';

@Component({
  selector: 'app-game-page-tab',
  templateUrl: './game-page-tab.component.html',
  styleUrls: ['./game-page-tab.component.scss'],
  imports: [
    IonContent,
    CourtComponent,
    PlayerListComponent,
    ScoreboardComponent
  ]
})
export class GamePageTabComponent  implements OnInit, AfterViewInit{

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
  }

}
