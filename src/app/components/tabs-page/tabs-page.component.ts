import {Component, OnInit} from '@angular/core';
import {IonIcon, IonLabel, IonRouterOutlet, IonTab, IonTabBar, IonTabButton, IonTabs} from '@ionic/angular/standalone';
import {PlayerPageTabComponent} from '../tabs/player-page-tab/player-page-tab.component';
import {GamePageTabComponent} from '../tabs/game-page-tab/game-page-tab.component';
import {HistoryPageTabComponent} from '../tabs/history-page-tab/history-page-tab.component';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonRouterOutlet,
    IonTab,
    PlayerPageTabComponent,
    GamePageTabComponent,
    HistoryPageTabComponent,
    IonLabel
  ]
})
export class TabsPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
