import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from 'src/app/components/settings-dialog/settings-dialog.component';
import { AppConstants } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'customer-app';

  constructor(private configService: ConfigService, private dialog: MatDialog) { }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: AppConstants.FORM_SETTING_WIDTH,
      maxWidth: AppConstants.FORM_SETTING_MAX_WIDTH,
    });
  }
}
