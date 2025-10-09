import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {GameService} from '../../services/game.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-scoreboard',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {

  protected readonly gameService = inject(GameService);

  public readonly hasHistory = this.gameService.hasHistory;

  public addPoint(team: 'home' | 'away') {
    this.gameService.addPoint(team);
  }

  public undo() {
    this.gameService.undo();
  }
}


