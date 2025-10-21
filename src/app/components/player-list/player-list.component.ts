import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {GameService} from '../../services/game.service';
import {MatDialog} from '@angular/material/dialog';
import {PlayerService} from '../../services/player.service';
import {Player, PlayerPosition} from '../../models/player';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-player-list',
  imports: [
    NgClass,
    MatIcon
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

  protected readonly PlayerPosition = PlayerPosition;
}
