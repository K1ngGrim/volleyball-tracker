import {Component, inject} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from '@angular/cdk/drag-drop';
import {NgClass} from '@angular/common';
import {Player} from '../player-list/player-list.component';
import {GameService} from '../../services/game.service';
import {MatFabButton, MatMiniFabButton} from '@angular/material/button';
import {isFrontRow} from '../../helper/Helper';

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
  positions = [5, 4, 6, 3, 1, 2];

  protected readonly gameService = inject(GameService);

  public onDrop(event: CdkDragDrop<any>, posIndex: number) {
    this.gameService.setPlayer(event.item.data, posIndex);
  }

  public track(action: Actions, player: Player) {
    this.gameService.recordPlayerAction(action, player);
  }

  protected readonly isFrontRow = isFrontRow;
}

export type Actions = 'hit' | 'kill' | 'attackError' | 'block' | 'serveError' | 'ace';
