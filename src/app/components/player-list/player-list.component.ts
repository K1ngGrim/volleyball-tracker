import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {GameService} from '../../services/game.service';
import {MatDialog} from '@angular/material/dialog';
import {PlayerService} from '../../services/player.service';
import {Player} from '../../models/player';

@Component({
  selector: 'app-player-list',
  imports: [
    NgClass
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
