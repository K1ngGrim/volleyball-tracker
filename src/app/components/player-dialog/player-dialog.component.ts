import {Component} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {GameService} from '../../services/game.service';
import {Player} from '../player-list/player-list.component';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-player-dialog',
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    MatInput
  ],
  templateUrl: './player-dialog.component.html',
  styleUrl: './player-dialog.component.scss'
})
export class PlayerDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
    private gameService: GameService
  ) {
    this.form = this.fb.group({
      number: [null, [Validators.required, Validators.min(1)]],
      name: ['', Validators.required],
      isLibero: [false],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const player: Player = {
      number: this.form.value.number,
      name: this.form.value.name,
      isLibero: this.form.value.isLibero,
    };
    this.gameService.addPlayer(player);
    this.dialogRef.close();
  }
}
