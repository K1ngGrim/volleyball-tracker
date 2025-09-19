import {Component, inject, OnInit, signal, viewChild} from '@angular/core';
import {
  IonButton, IonButtons,
  IonContent,
  IonFab,
  IonFabButton, IonHeader,
  IonIcon, IonInput,
  IonItem, IonItemOption, IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList, IonModal, IonSelect, IonSelectOption, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import {PlayerService} from '../../../services/player.service';
import {PlayerPostionShortPipe} from '../../../pipes/player-postion-short-pipe';
import {Player, PlayerPosition} from '../../../models/player';
import {FormsModule} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {PlayerModalComponent} from '../../player-modal/player-modal.component';

@Component({
  selector: 'app-player-page-tab',
  templateUrl: './player-page-tab.component.html',
  styleUrls: ['./player-page-tab.component.scss'],
  imports: [
    IonFabButton,
    IonIcon,
    IonFab,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    PlayerPostionShortPipe,
    FormsModule,
    PlayerModalComponent
  ]
})
export class PlayerPageTabComponent  implements OnInit {
  protected readonly playerService = inject(PlayerService);
  protected readonly editPlayerModel = signal<Player | null>(null);

  protected readonly editPlayerModal = viewChild<PlayerModalComponent>(PlayerModalComponent);

  constructor() { }

  ngOnInit() {}

  protected submitPlayer(player: Player) {
    if (this.editPlayerModel() !== null) {
      this.playerService.updatePlayer(this.editPlayerModel()!, player);
      this.editPlayerModel.set(null);
    } else {
      this.playerService.addPlayer(player);
    }
  }

  public openEditModal(player: Player) {
    this.editPlayerModel.set(player);
    this.editPlayerModal()?.openModal();
  }
}
