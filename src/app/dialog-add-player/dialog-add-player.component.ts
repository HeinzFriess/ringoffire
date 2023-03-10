import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }
  name: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
