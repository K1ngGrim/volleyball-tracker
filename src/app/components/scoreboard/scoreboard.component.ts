import {Component, inject, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {GameService} from '../../services/game.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-scoreboard',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    NgClass,
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {

  protected readonly gameService = inject(GameService);

  public readonly hasHistory = signal(false);

  public readonly homeSiteRight = this.gameService.isHomeRightSide;

  public addPoint(team: 'home' | 'away') {
  }

  public undo() {
    this.gameService.undo();
  }

  public changeSites() {
    this.gameService.changeSides();
  }

  public changeServiceTeam() {
    this.gameService.changeServiceTeam();
  }
}


