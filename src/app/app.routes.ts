import { Routes } from '@angular/router';
import { TabsPageComponent } from './components/tabs-page/tabs-page.component';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'player',
        loadComponent: () =>
          import('./components/tabs/player-page-tab/player-page-tab.component').then(
            (m) => m.PlayerPageTabComponent
          ),
      },
      {
        path: 'game',
        loadComponent: () =>
          import('./components/tabs/game-page-tab/game-page-tab.component').then(
            (m) => m.GamePageTabComponent
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./components/tabs/history-page-tab/history-page-tab.component').then(
            (m) => m.HistoryPageTabComponent
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/game',
    pathMatch: 'full',
  },
];
