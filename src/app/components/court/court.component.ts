import {Component, inject} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from '@angular/cdk/drag-drop';
import {NgClass} from '@angular/common';
import {GameService} from '../../services/game.service';
import {MatFabButton, MatMiniFabButton} from '@angular/material/button';
import {isFrontRow} from '../../helper/Helper';
import {Player} from '../../models/player';
import {PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-court',
  imports: [
    CdkDropList,
    NgClass,
    MatMiniFabButton,
    MatFabButton,
    CdkDragPlaceholder,
    CdkDrag
  ],
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent {
  positions = [4, 3, 2, 5, 6, 1];

  protected readonly gameService = inject(GameService);
  protected readonly playerService = inject(PlayerService);

  public clickCourtCell(posIndex: number) {
    if (!this.playerService.selectedPlayer()) {
      return;
    }
    this.gameService.setPlayer(this.playerService.selectedPlayer()!, posIndex-1);
  }

  public track(action: Actions, player: Player) {
    this.gameService.recordPlayerAction(action, player);
  }

  protected readonly isFrontRow = isFrontRow;
}

export type Actions = 'hit' | 'kill' | 'attackError' | 'block' | 'serveError' | 'ace';
