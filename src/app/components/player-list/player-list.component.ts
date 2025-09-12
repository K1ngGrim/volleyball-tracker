import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {JsonPipe, NgClass} from '@angular/common';
import {CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList} from '@angular/cdk/drag-drop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {GameService} from '../../services/game.service';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {PlayerDialogComponent} from '../player-dialog/player-dialog.component';
import {CdkScrollable} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-player-list',
  imports: [
    MatCard,
    NgClass,
    MatCardContent,
    CdkDrag,
    CdkDropList,
    MatButton,
    CdkDragPreview,
    MatIcon,
    MatIconButton,
    JsonPipe,
    CdkDragPlaceholder,
    CdkScrollable
  ],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  protected gameService = inject(GameService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  public openAddPlayerDialog() {
    const s = this.dialog.open(PlayerDialogComponent, {
      width: '300px',
    });

    s.afterClosed().subscribe(result => {
      this.cdr.detectChanges();
    });

  }

}

export interface Player {
  number: number;
  name: string;
  isLibero?: boolean;
  liberoChangedFor?: Player;
  PlayerChangedFor?: Player;
}
