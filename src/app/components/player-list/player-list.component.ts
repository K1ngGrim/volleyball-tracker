import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgClass} from '@angular/common';
import {CdkDrag, CdkDragPreview, CdkDropList} from '@angular/cdk/drag-drop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {GameService} from '../../services/game.service';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {PlayerService} from '../../services/player.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {Player} from '../../models/player';
import {IonIcon} from '@ionic/angular/standalone';

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
    CdkScrollable,
    MatCheckbox,
    IonIcon
  ],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {

  protected readonly gameService = inject(GameService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly playerService = inject(PlayerService);

  public readonly playerListOpened = signal<boolean>(false);

  public playerSelected(player: Player) {
    return this.playerService.selectedPlayer() === player;
  }

  public togglePlayerList() {
    this.playerListOpened.set(!this.playerListOpened());
  }

  public selectPlayer(player: Player) {
    this.playerService.selectedPlayer.set(player);
    this.cdr.detectChanges();
  }
}
