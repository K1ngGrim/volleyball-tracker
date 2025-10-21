import {Component, effect, inject, input, OnInit, output, signal, viewChild} from '@angular/core';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonSelect, IonSelectOption, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import {FormsModule} from '@angular/forms';
import {PlayerService} from '../../services/player.service';
import {Player} from '../../models/player';

@Component({
    selector: 'app-import-player-modal',
    templateUrl: './import-player-modal.component.html',
    styleUrls: ['./import-player-modal.component.scss'],
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
export class ImportPlayerModalComponent  implements OnInit {

  protected modal = viewChild<IonModal>(IonModal);
  protected playerListString = signal<string>('');

  public trigger = input.required<string>();
  public modalSave = output<string>();

  constructor() {
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
      this.modalSave.emit(this.playerListString());
    }
  }

  protected cancel() {
    this.modal()?.dismiss(null, 'cancel');
  }

}
