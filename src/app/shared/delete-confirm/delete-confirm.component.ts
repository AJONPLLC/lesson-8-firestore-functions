import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  deleteConfirmed: boolean;
}

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.data.deleteConfirmed = false;
  }
  onNoClick(): void {
    this.data.deleteConfirmed = false;
    this.dialogRef.close(this.data);
  }
  onDelete(): void {
    this.data.deleteConfirmed = true;
    this.dialogRef.close(this.data);
  }
}
