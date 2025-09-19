import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {CourtComponent} from '../../court/court.component';
import {PlayerListComponent} from '../../player-list/player-list.component';
import {ScoreboardComponent} from '../../scoreboard/scoreboard.component';
import {GestureController} from '@ionic/angular';

@Component({
  selector: 'app-game-page-tab',
  templateUrl: './game-page-tab.component.html',
  styleUrls: ['./game-page-tab.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CourtComponent,
    PlayerListComponent,
    ScoreboardComponent
  ]
})
export class GamePageTabComponent  implements OnInit, AfterViewInit{

  @ViewChild('swipeArea', { read: ElementRef }) swipeArea!: ElementRef;

  private gestureCtrl = inject(GestureController);

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.swipeArea.nativeElement,
      gestureName: 'swipe',
      onMove: ev => {
        // hier erkennst du die Richtung
        if (ev.deltaX > 50) {
          console.log('👉 Swipe von links nach rechts');
        } else if (ev.deltaX < -50) {
          console.log('👈 Swipe von rechts nach links');
        }
      },
      onEnd: ev => {
        if (ev.deltaX > 100) {
          alert('Swipe RIGHT erkannt!');
        } else if (ev.deltaX < -100) {
          alert('Swipe LEFT erkannt!');
        }
      }
    });
    gesture.enable(true);
  }

}
