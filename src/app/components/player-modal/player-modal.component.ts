import {Component, effect, inject, input, OnInit, output, signal, viewChild} from '@angular/core';
import {Player, PlayerPosition} from '../../models/player';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';
import {PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    FormsModule
  ]
})
export class PlayerModalComponent  implements OnInit {

  protected readonly playerService = inject(PlayerService);

  public inputModel = input<Player | null>(null);
  public trigger = input.required<string>();

  public playerModel = signal<Player>({name: '', number: 0});
  protected modal = viewChild<IonModal>(IonModal);

  public modalSave = output<Player>();

  constructor() {
    effect(() => {
      if (this.inputModel() !== null) {
        this.playerModel.set({...this.inputModel()!});
        console.log(this.inputModel());
      }
    });
  }

  ngOnInit() {
  }

  public openModal() {
    this.modal()?.present();
  }

  protected confirm() {
    this.modal()?.dismiss(null,'confirm');
  }

  protected onWillDismiss(event: CustomEvent) {
    if (event.detail.role === 'confirm') {
      this.modalSave.emit(this.playerModel());
      this.playerModel.set({name: '', number: 0});
    }
  }

  protected cancel() {
    this.modal()?.dismiss(null, 'cancel');
  }

  protected readonly PlayerPosition = PlayerPosition;

  public numberInvalid() {
    return !!this.playerService.players().find(x => x.number === this.playerModel().number);
  }
}
