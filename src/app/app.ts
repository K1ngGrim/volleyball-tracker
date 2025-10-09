import {Component, inject, OnDestroy, signal} from '@angular/core';
import {GameService} from './services/game.service';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {add, chevronUp, library, playCircle, radio, search} from 'ionicons/icons';
import {ActivationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [IonRouterOutlet, IonApp],
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

  constructor(private router: Router) {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart) {
        console.warn('ACTIVATION for outlet:', e.snapshot.outlet, 'route:', e.snapshot.routeConfig?.path);
      }
    });

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
