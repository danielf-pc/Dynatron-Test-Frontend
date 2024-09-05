import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  settingsForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      baseUrl: new FormControl(this.configService.baseUrl, [
        Validators.required,
        Validators.pattern('https?://.+')
      ]),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.settingsForm.valid) {
      const baseUrl = this.settingsForm.get('baseUrl')?.value;
      this.configService.baseUrl = baseUrl;
      this.dialogRef.close(baseUrl);
      return;
    }
  }
}
