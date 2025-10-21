import {Component, inject, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {GameService} from '../../services/game.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-scoreboard',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    NgClass,
    MatSlideToggle,
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {

  protected readonly gameService = inject(GameService);
  protected readonly correctionPanelExpanded = signal(false);
  public readonly homeSiteRight = this.gameService.isHomeRightSide;
  public readonly correctionModeEnabled = this.gameService.correctModeActive;

  public addPoint(team: 'home' | 'away') {
    const correctionMode = this.gameService.correctModeActive();
    if (correctionMode) return;
    this.gameService.updateSetPoints(team);
  }

  public correctPoint(team: 'home' | 'away', increment: boolean) {
    const correctionMode = this.gameService.correctModeActive();
    if (!correctionMode) return;
    this.gameService.updateSetPoints(team, increment ? 1 : -1);
  }

  public correctRotation() {
    const correctionMode = this.gameService.correctModeActive();
    if (!correctionMode) return;
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

  public switchCorrectionPanel() {
    this.correctionPanelExpanded.set(!this.correctionPanelExpanded())
  }
}


